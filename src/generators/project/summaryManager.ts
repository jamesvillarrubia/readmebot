import { ensureDir } from 'fs-extra';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';
import { fileOperations } from './fileOperations.js';
import { aiOperations } from './aiOperations.js';

// Type definitions
const ConfigSchema = z.object({
  force: z.boolean().optional(),
  minPrependLines: z.number().optional(),
  storagePath: z.string().optional(),
  summaryFileName: z.string().optional(),
  toolsSummaryFileName: z.string().optional(),
  prepend: z.boolean().optional(),
  padWidth: z.number().optional(),
});

type Config = z.infer<typeof ConfigSchema>;

const FileSummarySchema = z.object({
  name: z.string(),
  summary: z.string(),
});

type FileSummary = z.infer<typeof FileSummarySchema>;

// Default configuration
const defaultConfig: Config = {
  force: false,
  minPrependLines: 10,
  storagePath: './.autosummary',
  summaryFileName: 'summary',
  toolsSummaryFileName: 'toolsSummary',
  prepend: true,
  padWidth: 60,
};

// OpenAI client setup
export const getOpenAIClient = (): OpenAI => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
};

/**
 * Creates the storage directory if it doesn't exist
 */
const ensureStorageDirectory = async (storagePath: string): Promise<void> => {
  await ensureDir(storagePath);
};

/**
 * Summarizes a single file
 */
const summarizeFile = async (
  filePath: string,
  config: Config
): Promise<FileSummary | undefined> => {
  const allowedExtensions = ['.ts', '.js', '.json', '.tsx', '.jsx', '.yaml', '.yml', '.sh'];
  const embedExclusions = ['.json'];
  const fileExtension = fileOperations.getFileEnding(filePath);

  if (!allowedExtensions.includes(fileExtension)) {
    logger.info(`${filePath}:`.padEnd(config.padWidth || 60) + 'Skipping. File type not supported.');
    return { name: filePath, summary: 'Skipped. File type not supported.' };
  }

  const fileContent = await fileOperations.readFile(filePath, 'utf8');
  const capturedSummaries = await fileOperations.getExistingSummaries(
    `${config.storagePath}/${config.summaryFileName}.json`
  );

  let summary = capturedSummaries[filePath]?.summary;
  const exclude = embedExclusions.includes(fileExtension);

  if (summary && exclude) {
    logger.info(
      `${filePath}:`.padEnd(config.padWidth || 60) +
      'Skipped. Summary exists in storage. Filetype excluded.'
    );
    return { name: filePath, summary };
  }

  const [header, footer, prefix] = fileOperations.getComponents(filePath);

  if (header && footer && prefix && fileContent.includes(header) && fileContent.includes(footer) && !config.force) {
    summary = fileOperations.regexExtractSummary(filePath, fileContent, header, footer, prefix);
    logger.info(
      `${filePath}:`.padEnd(config.padWidth || 60) + 'Skipped. Summary exists in file. Updating Storage.'
    );
    return { name: filePath, summary };
  }

  if (!summary || config.force) {
    summary = await aiOperations.getSummaryFromAI(filePath, fileContent);
    const comment = `${header}\n${summary
      .split('\n')
      .map((line) => (line !== '' ? `${prefix}${line}` : ''))
      .join('\n')}\n${footer}`;

    const longEnoughToPrepend = fileContent.split('\n').length > (config.minPrependLines || 10);

    if (!exclude && config.prepend && header && footer && longEnoughToPrepend) {
      const cleanedContent = fileOperations.removeSummaryFromFileContent(fileContent, header, footer);
      const newContent = fileOperations.prefixFileContent(cleanedContent, comment);
      await fileOperations.writeFile(filePath, newContent);
      logger.info(
        `${filePath}:`.padEnd(config.padWidth || 60) + 'Summary generated. Prepended to file.'
      );
    } else {
      if (!exclude) {
        logger.info(
          `${filePath}:`.padEnd(config.padWidth || 60) + 'Summary generated. Filetype excluded.'
        );
      } else if (!longEnoughToPrepend) {
        logger.info(
          `${filePath}:`.padEnd(config.padWidth || 60) + 'Summary generated. Too short to prepend.'
        );
      } else {
        logger.info(
          `${filePath}:`.padEnd(config.padWidth || 60) + 'Summary generated. Prepending disabled.'
        );
      }
    }
    return { name: filePath, summary };
  }
};

/**
 * Summarizes all project files
 */
const summarizeAllFiles = async (config: Config): Promise<FileSummary[]> => {
  const summaries: FileSummary[] = [];
  const projectFiles = await fileOperations.getProjectFiles();

  for (const file of projectFiles) {
    await fileOperations.removeShortFileSummaries(file);
    const summary = await summarizeFile(file, config);
    if (summary) summaries.push(summary);
  }

  return summaries;
};

/**
 * Summarizes tools and frameworks from package.json
 */
const summarizeToolsAndFrameworks = async (config: Config): Promise<FileSummary[]> => {
  const existingSummaries = await fileOperations.getExistingSummaries(
    `${config.storagePath}/${config.toolsSummaryFileName}.json`
  );

  const packageJson = JSON.parse(await fileOperations.readFile('package.json', 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});

  const openai = getOpenAIClient();
  const summaries = await Promise.all(
    dependencies.map(async (tool: string) => {
      if (!existingSummaries[tool] || config.force) {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes tools and frameworks.',
            },
            {
              role: 'user',
              content: `Summarize the purpose and usage of the following tool/framework:\n\n${tool}`,
            },
          ],
          max_tokens: 50,
        });

        const content = response.choices[0]?.message?.content;
        return { name: tool, summary: content?.trim() || 'No summary available.' };
      }
      return { name: tool, summary: existingSummaries[tool]?.summary || 'No summary available.' };
    })
  );

  return summaries;
};

/**
 * Main function to run the summary generation process
 */
export const runSummaryGeneration = async (userConfig: Partial<Config> = {}): Promise<void> => {
  const config = ConfigSchema.parse({ ...defaultConfig, ...userConfig });

  await ensureStorageDirectory(config.storagePath || './.autosummary');

  const summariesArray = await summarizeAllFiles(config);
  const summaries = await fileOperations.compileSummaries(
    summariesArray,
    config.summaryFileName || 'summary'
  );

  const toolsSummariesArray = await summarizeToolsAndFrameworks(config);
  const toolsSummaries = await fileOperations.compileSummaries(
    toolsSummariesArray,
    config.toolsSummaryFileName || 'toolsSummary'
  );

  await aiOperations.updateMarkdownDocuments(summaries, toolsSummaries);
};

export default {
  runSummaryGeneration,
};