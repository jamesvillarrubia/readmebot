import { readFile, writeFile, ensureDir, pathExists } from 'fs-extra';
import { globby } from 'globby';
import { z } from 'zod';
import { logger } from '../../utils/logger.js';

// Type definitions
const FileSummarySchema = z.object({
  name: z.string(),
  summary: z.string(),
});

type FileSummary = z.infer<typeof FileSummarySchema>;

/**
 * Gets the file extension from a file path
 */
export const getFileEnding = (filePath: string): string => {
  return filePath.slice(filePath.lastIndexOf('.'));
};

/**
 * Reads a file and returns its contents
 */
export const readFileContent = async (filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> => {
  return readFile(filePath, encoding);
};

/**
 * Writes content to a file
 */
export const writeFileContent = async (filePath: string, content: string): Promise<void> => {
  await writeFile(filePath, content);
};

/**
 * Gets all project files matching the specified patterns
 */
export const getProjectFiles = async (): Promise<string[]> => {
  return globby(['**/*.{ts,js,json,tsx,jsx,yaml,yml,sh}', '!node_modules/**', '!dist/**']);
};

/**
 * Gets the header, footer, and prefix components for a file
 */
export const getComponents = (filePath: string): [string, string, string] => {
  const extension = getFileEnding(filePath);
  switch (extension) {
    case '.ts':
    case '.js':
    case '.tsx':
    case '.jsx':
      return ['/** AUTO-SUMMARY **', '*** END-SUMMARY **/', ' * '];
    case '.yaml':
    case '.yml':
      return ['# AUTO-SUMMARY', '# END-SUMMARY', '# '];
    case '.sh':
      return ['# AUTO-SUMMARY', '# END-SUMMARY', '# '];
    default:
      return ['', '', ''];
  }
};

/**
 * Extracts a summary from a file using regex
 */
export const regexExtractSummary = (
  content: string,
  header: string,
  footer: string,
  prefix: string
): string => {
  const regex = new RegExp(`${header}\\n([\\s\\S]*?)${footer}`);
  const match = content.match(regex);
  if (!match || !match[1]) return '';

  return match[1]
    .split('\n')
    .map((line) => line.replace(new RegExp(`^\\s*${prefix}`), ''))
    .join('\n')
    .trim();
};

/**
 * Removes a summary from file content
 */
export const removeSummaryFromFileContent = (
  content: string,
  header: string,
  footer: string
): string => {
  const regex = new RegExp(`${header}\\n[\\s\\S]*?${footer}\\n?`);
  return content.replace(regex, '');
};

/**
 * Prefixes file content with a comment
 */
export const prefixFileContent = (content: string, comment: string): string => {
  return `${comment}\n\n${content}`;
};

/**
 * Gets existing summaries from a file
 */
export const getExistingSummaries = async (filePath: string): Promise<Record<string, { summary: string }>> => {
  if (!(await pathExists(filePath))) return {};

  try {
    const content = await readFileContent(filePath);
    return JSON.parse(content);
  } catch (error) {
    return {};
  }
};

/**
 * Compiles summaries into a file
 */
export const compileSummaries = async (
  summaries: FileSummary[],
  fileName: string
): Promise<Record<string, { summary: string }>> => {
  const result: Record<string, { summary: string }> = {};
  for (const summary of summaries) {
    result[summary.name] = { summary: summary.summary };
  }

  await ensureDir('./.autosummary');
  await writeFileContent(
    `./.autosummary/${fileName}.json`,
    JSON.stringify(result, null, 2)
  );

  return result;
};

/**
 * Removes short file summaries
 */
export const removeShortFileSummaries = async (filePath: string): Promise<void> => {
  const [header, footer, prefix] = getComponents(filePath);
  if (!header || !footer) return;

  const content = await readFileContent(filePath);
  const summary = regexExtractSummary(content, header, footer, prefix);
  if (summary.length < 10) {
    const newContent = removeSummaryFromFileContent(content, header, footer);
    await writeFileContent(filePath, newContent);
    logger.info(`${filePath}:`.padEnd(60) + 'Summary removed. File too short.');
  }
};

export const fileOperations = {
  getFileEnding,
  readFile: readFileContent,
  writeFile: writeFileContent,
  getProjectFiles,
  getComponents,
  regexExtractSummary,
  removeSummaryFromFileContent,
  prefixFileContent,
  getExistingSummaries,
  compileSummaries,
  removeShortFileSummaries,
};