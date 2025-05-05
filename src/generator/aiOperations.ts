// import axios from 'axios';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { pino } from 'pino';
import { summaryPrompt } from '../prompts.template.js';
import { readmeSystemPrompt, readmeTemplate } from '../readme.template.js';
import { fileOperations } from './fileOperations.js';

// Type definitions
const FileSummarySchema = z.object({
  name: z.string(),
  summary: z.string(),
});

type FileSummary = z.infer<typeof FileSummarySchema>;

// Logger setup
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

// OpenAI client setup
export const getOpenAIClient = (): OpenAI => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
};

export class AIOperations {
  private apiKey: string;
  private openai: OpenAI;

  constructor() {
    if (process.env.OPENAI_API_KEY === undefined) {
      throw new Error('Missing OpenAI API Key');
    }
    this.apiKey = process.env.OPENAI_API_KEY;
    this.openai = getOpenAIClient();
  }

  /**
   * Gets a summary of a file using AI
   */
  public async getSummaryFromAI(filePath: string, contentToSummarize: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes code files.',
          },
          {
            role: 'user',
            content: `Please provide a concise summary of the following code file:\n\n${contentToSummarize}`,
          },
        ],
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content;
      return content?.trim() || 'No summary available.';
    } catch (error) {
      logger.error(`Error getting AI summary for ${filePath}:`, error);
      return 'Error generating summary.';
    }
  }

  /**
   * Updates markdown documents with summaries
   */
  public async updateMarkdownDocuments(summaries: any, toolsSummaries: any): Promise<string> {
    const packageJson = await fileOperations.readFile('package.json');
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates comprehensive README files.',
        },
        {
          role: 'user',
          content: `Please create a comprehensive README file based on the following code summaries and tool descriptions:\n\nCode Summaries:\n${JSON.stringify(
            summaries,
            null,
            2
          )}\n\nTool Summaries:\n${JSON.stringify(toolsSummaries, null, 2)}\n${packageJson}`,
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    const readmeContent = content?.trim() || '';
    if (readmeContent) {
      await fileOperations.writeFile('autoREADME.md', readmeContent);
      logger.info('README content generated successfully.');
    }
    return readmeContent;
  }
}

// Create and export a singleton instance
export const aiOperations = new AIOperations();

export default AIOperations;