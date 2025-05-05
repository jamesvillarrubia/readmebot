import { describe, it, expect } from 'vitest';
import { MockAIProvider, MockAIProviderConfig, MockAIProviderError } from './mock-ai-provider.js';

describe('MockAIProvider', () => {
    const mockConfig: MockAIProviderConfig = {
        apiKey: 'test-api-key',
        model: 'test-model',
        temperature: 0.7,
        maxTokens: 1000
    };

    it('should be instantiated with valid config', () => {
        const provider = new MockAIProvider(mockConfig);
        expect(provider).toBeDefined();
    });

    describe('generateProjectDocs', () => {
        it('should generate project documentation', async () => {
            const provider = new MockAIProvider(mockConfig);
            const docs = await provider.generateProjectDocs({
                projectName: 'test-project',
                projectPath: '/test/path'
            });

            expect(docs).toBeDefined();
            expect(docs.businessPurpose).toBe('Test project business purpose');
            expect(docs.stakeholders).toHaveLength(2);
            expect(docs.businessProcesses).toHaveLength(2);
            expect(docs.complianceRequirements).toHaveLength(2);
            expect(docs.businessMetrics).toHaveLength(2);
        });
    });

    describe('generateModuleDocs', () => {
        it('should generate module documentation', async () => {
            const provider = new MockAIProvider(mockConfig);
            const docs = await provider.generateModuleDocs({
                moduleName: 'test-module',
                modulePath: '/test/path'
            });

            expect(docs).toBeDefined();
            expect(docs.businessDomain).toBe('Test module business domain');
            expect(docs.integrationPoints).toHaveLength(2);
            expect(docs.businessWorkflows).toHaveLength(2);
            expect(docs.businessRules).toHaveLength(2);
            expect(docs.performanceRequirements).toHaveLength(2);
        });
    });

    describe('generateFileDocs', () => {
        it('should generate file documentation', async () => {
            const provider = new MockAIProvider(mockConfig);
            const docs = await provider.generateFileDocs({
                fileName: 'test-file.ts',
                filePath: '/test/path'
            });

            expect(docs).toBeDefined();
            expect(docs.businessPurpose).toBe('Test file business purpose');
            expect(docs.businessRules).toHaveLength(2);
            expect(docs.integrationRequirements).toHaveLength(2);
            expect(docs.errorHandling).toHaveLength(2);
            expect(docs.complianceRequirements).toHaveLength(2);
        });
    });

    describe('generateFunctionDocs', () => {
        it('should generate function documentation', async () => {
            const provider = new MockAIProvider(mockConfig);
            const docs = await provider.generateFunctionDocs({
                functionName: 'testFunction',
                filePath: '/test/path',
                functionBody: 'function testFunction() {}'
            });

            expect(docs).toBeDefined();
            expect(docs.businessPurpose).toBe('Test function business purpose');
            expect(docs.businessRules).toHaveLength(2);
            expect(docs.inputContext).toBe('Test input context');
            expect(docs.outputContext).toBe('Test output context');
            expect(docs.errorScenarios).toHaveLength(2);
            expect(docs.performanceRequirements).toHaveLength(2);
        });
    });

    describe('streamDocs', () => {
        it('should stream documentation chunks', async () => {
            const provider = new MockAIProvider(mockConfig);
            const chunks: string[] = [];

            for await (const chunk of provider.streamDocs('test prompt')) {
                chunks.push(chunk);
            }

            expect(chunks).toHaveLength(3);
            expect(chunks[0]).toBe('Generating documentation for test function...\n');
            expect(chunks[1]).toBe('This is a test function that demonstrates functionality.\n');
            expect(chunks[2]).toBe('The test function takes input and produces output.\n');
        });
    });

    describe('simulateError', () => {
        it('should throw MockAIProviderError', () => {
            const provider = new MockAIProvider(mockConfig);
            expect(() => provider.simulateError()).toThrow(MockAIProviderError);
        });
    });
}); 