import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runSummaryGeneration } from '../src/generators/project/summaryManager.js';
import { fileOperations } from '../src/generators/project/fileOperations.js';
import { aiOperations } from '../src/generators/project/aiOperations.js';

// Mock dependencies
vi.mock('../src/generators/project/fileOperations.js', () => ({
  fileOperations: {
    getFileEnding: vi.fn().mockImplementation((path: string) => path.slice(path.lastIndexOf('.'))),
    getProjectFiles: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    getComponents: vi.fn(),
    regexExtractSummary: vi.fn(),
    removeSummaryFromFileContent: vi.fn(),
    prefixFileContent: vi.fn(),
    getExistingSummaries: vi.fn(),
    compileSummaries: vi.fn(),
    removeShortFileSummaries: vi.fn(),
  },
}));

vi.mock('../src/generators/project/aiOperations.js', () => ({
  aiOperations: {
    getSummaryFromAI: vi.fn(),
    updateMarkdownDocuments: vi.fn(),
  },
}));

vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock summary' } }],
        }),
      },
    },
  })),
}));

describe('Summary Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock package.json content
    vi.mocked(fileOperations.readFile).mockImplementation(async (path: string) => {
      if (path === 'package.json') {
        return JSON.stringify({
          name: 'test-project',
          version: '1.0.0',
          dependencies: {
            'test-dependency': '^1.0.0'
          }
        });
      }
      return 'test content';
    });
  });

  it('should generate summaries for all files', async () => {
    // Mock file operations
    vi.mocked(fileOperations.getProjectFiles).mockResolvedValue(['test.ts']);
    vi.mocked(fileOperations.getComponents).mockReturnValue(['header', 'footer', 'prefix']);
    vi.mocked(fileOperations.regexExtractSummary).mockReturnValue('test summary');
    vi.mocked(fileOperations.getExistingSummaries).mockResolvedValue({});
    vi.mocked(fileOperations.compileSummaries).mockResolvedValue({ 'test.ts': { summary: 'test summary' } });

    // Mock AI operations
    vi.mocked(aiOperations.getSummaryFromAI).mockResolvedValue('AI generated summary');
    vi.mocked(aiOperations.updateMarkdownDocuments).mockResolvedValue();

    await runSummaryGeneration();

    expect(fileOperations.getProjectFiles).toHaveBeenCalled();
    expect(aiOperations.getSummaryFromAI).toHaveBeenCalled();
    expect(aiOperations.updateMarkdownDocuments).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    // Mock file operations to throw an error
    vi.mocked(fileOperations.getProjectFiles).mockRejectedValue(new Error('Test error'));

    await expect(runSummaryGeneration()).rejects.toThrow('Test error');
  });

  it('should respect force option', async () => {
    // Mock file operations
    vi.mocked(fileOperations.getProjectFiles).mockResolvedValue(['test.ts']);
    vi.mocked(fileOperations.getComponents).mockReturnValue(['header', 'footer', 'prefix']);
    vi.mocked(fileOperations.regexExtractSummary).mockReturnValue('test summary');
    vi.mocked(fileOperations.getExistingSummaries).mockResolvedValue({ 'test.ts': { summary: 'existing summary' } });
    vi.mocked(fileOperations.compileSummaries).mockResolvedValue({ 'test.ts': { summary: 'test summary' } });

    // Mock AI operations
    vi.mocked(aiOperations.getSummaryFromAI).mockResolvedValue('AI generated summary');
    vi.mocked(aiOperations.updateMarkdownDocuments).mockResolvedValue();

    await runSummaryGeneration({ force: true });

    expect(aiOperations.getSummaryFromAI).toHaveBeenCalled();
  });
}); 