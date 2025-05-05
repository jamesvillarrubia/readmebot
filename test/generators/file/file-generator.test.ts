import { describe, it, expect, beforeEach } from 'vitest';
import { MockAIProvider, MockAIProviderConfig } from '../../mocks/providers/ai/mock-ai-provider.js';
import { FileGenerator } from '../../../src/generators/file/file-generator.js';
import path from 'path';

describe('FileGenerator', () => {
    let generator: FileGenerator;
    let mockAIProvider: MockAIProvider;
    const testProjectPath = path.join(__dirname, '../../fixtures/test-project');
    const testFilePath = path.join(testProjectPath, 'src/core/ai/ai-provider.ts');
    const mockConfig: MockAIProviderConfig = {
        apiKey: 'test-api-key',
        model: 'test-model',
        temperature: 0.7,
        maxTokens: 1000
    };

    beforeEach(() => {
        mockAIProvider = new MockAIProvider(mockConfig);
        generator = new FileGenerator(mockAIProvider);
    });

    describe('generateDocumentation', () => {
        it('should generate file-level documentation', async () => {
            const docs = await generator.generateDocumentation({
                fileName: 'ai-provider.ts',
                filePath: testFilePath,
                projectPath: testProjectPath
            });

            expect(docs).toBeDefined();
            expect(docs.businessContext).toBeDefined();
            expect(docs.businessContext.purpose).toBeDefined();
            expect(docs.businessContext.domain).toBeDefined();
            expect(docs.businessContext.stakeholders).toBeInstanceOf(Array);
            expect(docs.businessContext.requirements).toBeInstanceOf(Array);
            expect(docs.businessContext.constraints).toBeInstanceOf(Array);

            expect(docs.codeBlocks).toBeInstanceOf(Array);
            expect(docs.dependencies).toBeInstanceOf(Array);
            expect(docs.errorHandling).toBeInstanceOf(Array);
        });

        it('should handle missing file path', async () => {
            await expect(generator.generateDocumentation({
                fileName: 'ai-provider.ts',
                filePath: '/non/existent/path',
                projectPath: testProjectPath
            })).rejects.toThrow('File path does not exist');
        });

        it('should detect code blocks', async () => {
            const docs = await generator.generateDocumentation({
                fileName: 'ai-provider.ts',
                filePath: testFilePath,
                projectPath: testProjectPath
            });

            const codeBlocks = docs.codeBlocks;
            expect(codeBlocks).toContainEqual({
                name: 'AIProvider',
                type: 'interface',
                description: 'Interface for AI providers that generate documentation',
                usage: 'Implement this interface to provide functionality'
            });
        });

        it('should detect file dependencies', async () => {
            const docs = await generator.generateDocumentation({
                fileName: 'ai-provider.ts',
                filePath: testFilePath,
                projectPath: testProjectPath
            });

            const dependencies = docs.dependencies;
            expect(dependencies).toContainEqual({
                name: 'zod',
                type: 'external',
                purpose: 'Imports z for external functionality',
                usageLocations: ['ai-provider.ts']
            });
        });

        it('should detect error handling', async () => {
            const docs = await generator.generateDocumentation({
                fileName: 'ai-provider.ts',
                filePath: testFilePath,
                projectPath: testProjectPath
            });

            const errorHandling = docs.errorHandling;
            expect(errorHandling).toBeInstanceOf(Array);
        });
    });
}); 