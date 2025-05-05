import { describe, it, expect, beforeEach } from 'vitest';
import { MockAIProvider } from '../../mocks/providers/ai/mock-ai-provider.js';
import { ModuleGenerator } from '../../../src/generators/module/index.js';
import { AIProvider } from '../../../src/core/ai/ai-provider.js';
import path from 'path';

describe('ModuleGenerator', () => {
    let generator: ModuleGenerator;
    let aiProvider: AIProvider;
    const testProjectPath = path.join(__dirname, '../../fixtures/test-project');
    const testFilePath = path.join(testProjectPath, 'src/core/ai');

    beforeEach(() => {
        const mockConfig = {
            apiKey: 'test-api-key',
            model: 'test-model',
            temperature: 0.7,
            maxTokens: 1000
        };
        aiProvider = new MockAIProvider(mockConfig);
        generator = new ModuleGenerator(aiProvider);
    });

    describe('generateDocumentation', () => {
        it('should generate module-level documentation', async () => {
            const docs = await generator.generateDocumentation({
                moduleName: 'ai',
                modulePath: testFilePath,
                projectPath: testProjectPath
            });

            expect(docs).toBeDefined();
            expect(docs.businessContext).toBeDefined();
            expect(docs.businessContext.domain).toBeDefined();
            expect(docs.businessContext.purpose).toBeDefined();
            expect(docs.businessContext.stakeholders).toBeInstanceOf(Array);
            expect(docs.businessContext.requirements).toBeInstanceOf(Array);
            expect(docs.businessContext.constraints).toBeInstanceOf(Array);

            expect(docs.api).toBeDefined();
            expect(docs.api.exports).toBeInstanceOf(Array);
            expect(docs.api.imports).toBeInstanceOf(Array);

            expect(docs.architecture).toBeDefined();
            expect(docs.architecture.components).toBeInstanceOf(Array);
            expect(docs.architecture.patterns).toBeInstanceOf(Array);
            expect(docs.architecture.dataFlow).toBeInstanceOf(Array);

            expect(docs.dependencies).toBeInstanceOf(Array);
        });

        it('should handle missing module path', async () => {
            await expect(generator.generateDocumentation({
                moduleName: 'ai',
                modulePath: '/non/existent/path',
                projectPath: testProjectPath
            })).rejects.toThrow('Module path does not exist');
        });

        it('should detect module exports', async () => {
            const docs = await generator.generateDocumentation({
                moduleName: 'ai',
                modulePath: testFilePath,
                projectPath: testProjectPath
            });

            const exports = docs.api.exports;
            expect(exports).toContainEqual({
                name: 'AIProvider',
                type: 'interface',
                description: 'Interface for AI providers that generate documentation',
                usage: 'Implement this interface to provide functionality'
            });
        });

        it('should detect module dependencies', async () => {
            const docs = await generator.generateDocumentation({
                moduleName: 'ai',
                modulePath: testFilePath,
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

        it('should analyze module architecture', async () => {
            const docs = await generator.generateDocumentation({
                moduleName: 'ai',
                modulePath: testFilePath,
                projectPath: testProjectPath
            });

            const { architecture } = docs;
            expect(architecture.components).toContainEqual({
                name: 'AIProvider',
                purpose: 'Interface for AI providers that generate documentation',
                dependencies: []
            });
        });
    });
}); 