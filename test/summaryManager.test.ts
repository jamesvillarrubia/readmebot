import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runSummaryGeneration } from '../src/generator/summaryManager.js';
import { fileOperations } from '../src/generator/fileOperations.js';
import { aiOperations } from '../src/generator/aiOperations.js';

// Mock dependencies
vi.mock('../src/generator/fileOperations.js', () => ({
  fileOperations: {
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

vi.mock('../src/generator/aiOperations.js', () => ({
  aiOperations: {
    getSummaryFromAI: vi.fn(),
    updateMarkdownDocuments: vi.fn(),
  },
}));

describe('Summary Manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate summaries for all files', async () => {
    // Mock file operations
    vi.mocked(fileOperations.getProjectFiles).mockResolvedValue(['test.ts']);
    vi.mocked(fileOperations.readFile).mockResolvedValue('test content');
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
    vi.mocked(fileOperations.readFile).mockResolvedValue('test content');
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