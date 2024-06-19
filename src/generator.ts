/** AUTO-SUMMARY **
   Purpose: This file implements a `Generator` class designed to automate the summarization of project files, enhancing documentation and providing insights into the codebase directly from the command line.

   Key Components:
   - `Generator` class: Manages file operations, AI interactions for summarizing content, and storage of summaries.
   - Methods like `summarizeFile`, `summarizeAllFiles`, and `compileSummaries`: Handle specific tasks related to file summarization and management.
   - Integration with OpenAI's API: Utilizes AI to generate summaries for files that lack them or require updates.

   Functional Overview: The `Generator` class provides functionalities to:
   1. Identify and read project files.
   2. Extract or generate summaries using AI.
   3. Manage summary storage and updates.
   4. Compile summaries into a centralized document.

   Dependencies and Integrations:
   - Uses the `fs/promises` and `fs-extra` for file system operations.
   - Integrates with the OpenAI API for generating summaries.
   - Utilizes `globby` for pattern-based file matching.

   Additional Context: The class is structured to support both initial summary generation and updates, ensuring that the project documentation remains current. It also includes provisions for handling different file types and managing summaries based on file content changes or force updates.
*** END-SUMMARY **/

import { readFile, writeFile, mkdir } from 'fs/promises';
import { pathExists, ensureDir } from 'fs-extra';
import * as path from 'path';
import OpenAI from 'openai';
import { globby } from 'globby';
import { summaryPrompt } from './prompts';
import { fstat } from 'fs';

export class Generator {
  private openai: OpenAI;
  private force: boolean;
  private summaryFilePath: string;
  private storagePath: string;
  private summaryFileName: string;

  constructor (options?: { force?: boolean }) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.force = options?.force ?? true;
    this.summaryFileName = 'summary';
    this.storagePath = './.autosummary';
    this.summaryFilePath = this.storagePath + '/' + this.summaryFileName + '.json';
  }

  private async getAllFiles (dir: string, extensions: string[]): Promise<string[]> {
    const patterns = extensions.map(ext => `${dir}/**/*${ext}`);
    return await globby(patterns, {
      ignore: ['node_modules', '**-lock.json', 'package.json', 'tsconfig.json'],
      gitignore: true
    });
  }

  // Get all markdown files in the docs directory
  public async getMarkdownFiles (): Promise<string[]> {
    return await this.getAllFiles('./docs', ['.md']);
  }

  // Get all relevant project files
  public async getProjectFiles (): Promise<string[]> {
    return await this.getAllFiles('.', ['.ts', '.js', '.json', '.tsx', '.jsx', '.yaml', '.yml']);
  }

  private getFileEnding (filePath: string): string {
    return path.extname(filePath);
    // example: '.ts'
  }

  private removeSummaryFromFileContent (fileContent: string, header: string, footer: string): string {
    const lines = fileContent.split('\n'); // Split the file content into lines
    const headerLine = lines.indexOf(header); // Find the index of the header line
    const footerLine = lines.indexOf(footer); // Find the index of the footer line
    if (headerLine === -1 || footerLine === -1) return fileContent;
    lines.splice(headerLine, footerLine - headerLine + 1);
    return lines.join('\n');
    // return fileContent.replace(lines.slice(headerLine, footerLine).join('\n'), '');
  }

  private prefixFileContent (fileContent: string, comment: string): string {
    const shebangPattern = /^#!.*/;
    const lines = fileContent.split('\n');

    if (shebangPattern.test(lines[0])) {
      // If the first line matches the shebang pattern, inject the comment after it
      lines[0] = lines[0] + '\n' + comment;
    } else {
      // Otherwise, inject the comment at the beginning
      lines.unshift(comment);
    }

    const updatedContent = lines.map(l => l.trim()).join('\n');
    return updatedContent;
  }

  private getComponents (filePath: string): (string|undefined)[] {
    let header: string|undefined;
    let footer: string|undefined;
    let prefix: string|undefined;
    switch (this.getFileEnding(filePath)) {
      case '.ts':
      case '.js':
      case '.tsx':
      case '.jsx':
        header = '/** AUTO-SUMMARY' + ' **';
        footer = '*** END-SUMMARY' + ' **/';
        prefix = '   ';
        break;
      case '.yaml':
      case '.yml':
      case '.sh':
        header = '### AUTO-SUMMARY ###';
        footer = '### END-SUMMARY ###';
        prefix = '#  ';
        break;
      default:
        break;
    }
    return [header, footer, prefix];
  }

  private regexExtractSummary (filePath: string, fileContent: string, header: string, footer: string, prefix: string): string {
    const lines = fileContent.split('\n'); // Split the file content into lines
    const headerLine = lines.indexOf(header); // Find the index of the header line
    const footerLine = lines.indexOf(footer); // Find the index of the footer line
    const summaryLines = lines.slice(headerLine + 1, footerLine); // Extract the summary lines
    // remove prefix from each line
    summaryLines.forEach((line, index) => {
      summaryLines[index] = line.replace(prefix, '');
    });
    // Join the summary lines into a single string
    return summaryLines.join('\n');
  }

  private async getSummaryFromAI (filePath: string, contentToSummarize: string): Promise<string> {
    // return 'Purpose: This file serves as a command-line interface (CLI) for the project, allowing users to execute the generator functionality from the terminal.\n\nKey Components:\n- `Command`: Imported from the \'commander\' package to handle CLI commands and options.\n- `Generator`: Imported from the local module to handle the generation process.\n\nFunctional Overview: The file sets up a CLI tool using the \'commander\' package, defines the version of the tool, and specifies an action that initializes and runs the `Generator` when the CLI command is executed.\n\nDependencies and Integrations: Depends on the \'commander\' package for CLI functionality and the `Generator` class from the local project to perform the generation tasks.\n\nAdditional Context: This CLI setup is typically used to provide a user-friendly way to interact with the functionalities of the project directly from the command line, enhancing usability and accessibility.';
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: summaryPrompt },
        { role: 'user', content: `Summarize the following file:\n\n\`\`\`\n${contentToSummarize}\n\`\`\`` }
      ],
      temperature: 0,
      max_tokens: 1000,
      seed: 42
    });

    if (!response) {
      throw new Error('Failed to generate summary');
    }
    return response.choices[0].message?.content?.trim() || 'No summary provided';
  }

  private async getExistingCapturedSummaries (filePath: string): Promise<any> {
    const exists = await pathExists(this.summaryFilePath);
    if (!exists) return {};
    const fileContent = await readFile(this.summaryFilePath, 'utf8');
    const capturedSummaries = JSON.parse(fileContent);
    return capturedSummaries || {};
  }

  private log (message: string): void {
    console.log(message);
  }

  // Function to summarize a file
  private async summarizeFile (filePath: string): Promise<{ filePath: string, summary: string }|undefined> {
    const allowedExtensions = ['.ts', '.js', '.json', '.tsx', '.jsx', '.yaml', '.yml', '.sh'];
    const embedExclusions = ['.json'];
    let fileContent = await readFile(filePath, 'utf8');
    const contentToSummarize = fileContent;
    const capturedSummaries = await this.getExistingCapturedSummaries(filePath);
    let summary:string|undefined;
    let comment:string|undefined;
    const exclude = embedExclusions.includes(this.getFileEnding(filePath));

    // Check if the file type is supported, else skip
    if (!allowedExtensions.includes(this.getFileEnding(filePath))) {
      this.log(`${filePath} Skipping.  File type not supported.`);
      return { filePath, summary: 'Skipped. File type not supported.' };
    }

    // check if the file has already been captured
    if (capturedSummaries[filePath] && capturedSummaries[filePath].summary) {
      summary = capturedSummaries[filePath].summary;
      // if captured and embedExclusions includes the file type, then skip
      if (summary && exclude) {
        this.log(`${filePath}: Skipped. Summary exists in storage. Filetype excluded.`);
        return { filePath, summary };
      }
    }

    const [header, footer, prefix] = this.getComponents(filePath);

    // check if the summary is already in the file
    if (header && footer && prefix && fileContent.includes(header) && fileContent.includes(footer) && !this.force) {
      summary = this.regexExtractSummary(filePath, fileContent, header, footer, prefix);
      this.log(`${filePath}: Skipped. Summary exists in file. Updating Storage.`);
      return { filePath, summary };
    }

    // if the summary is not in the file and not in the captured summaries, then get the summary from the AI
    if (!summary || this.force) {
      summary = await this.getSummaryFromAI(filePath, contentToSummarize);
      comment = `${header}\n${summary.split('\n').map(line => line === '' ? `${prefix}${line}` : '').join('\n')}\n${footer}\n`;
      if (!exclude) {
        fileContent = this.removeSummaryFromFileContent(fileContent, header, footer);
        fileContent = this.prefixFileContent(fileContent, comment);
        await writeFile(filePath, fileContent);
        this.log(`${filePath}: Summary generated. Prepended to file.`);
      } else {
        this.log(`${filePath}: Summary generated. Filetype excluded.`);
      }
      return { filePath, summary };
    }
  }

  // Summarize all project files
  public async summarizeAllFiles (): Promise<{ filePath: string, summary: string }[]> {
    const summaries = [];
    const projectFiles = await this.getProjectFiles();
    for (const file of projectFiles) {
      const summary = await this.summarizeFile(file);
      if (summary) summaries.push(summary);
    }
    return summaries;
  }

  // Compile all summaries into a text document
  public async compileSummaries (summaries: { filePath: string, summary: string }[]): Promise<void> {
    const summaryObject = summaries.reduce((obj, { filePath, summary }) => ({ ...obj, [filePath]: summary }), {});
    await writeFile(this.summaryFilePath, JSON.stringify(summaryObject, null, 2), 'utf8');
  }

  // Summarize major tools and frameworks
  public async summarizeToolsAndFrameworks (): Promise<void> {
    const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});

    const majorTools = [...dependencies, ...devDependencies];

    const summaries = await Promise.all(majorTools.map(async (tool) => {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes tools and frameworks.' },
          { role: 'user', content: `Summarize the purpose and usage of the following tool/framework:\n\n${tool}` }
        ],
        max_tokens: 50
      });

      return `- ${tool}: ${response.choices[0].message?.content?.trim()}`;
    }));

    const toolsSummary = `Major Tools and Frameworks:\n${summaries.join('\n')}`;
    await writeFile('tools_summary.txt', toolsSummary, 'utf8');
  }

  // Update markdown documents based on file summaries
  public updateMarkdownDocuments (summaries: { filePath: string, summary: string }[]): void {
    // Implement specific logic to update markdown documents
    // based on the provided summaries
  }

  // Main function to run all tasks
  public async run (): Promise<void> {
    // create directory if it doesn't exist
    ensureDir(this.storagePath);
    const summaries = await this.summarizeAllFiles();
    await this.compileSummaries(summaries);
    // await this.summarizeToolsAndFrameworks();
    // this.updateMarkdownDocuments(summaries);
  }
}

export default Generator;
