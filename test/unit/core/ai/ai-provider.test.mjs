import { describe, it, expect, beforeEach } from 'vitest';
import { AIProvider } from '../../../../src/core/ai/ai-provider.js';
import { MockAIProvider } from '../../../mocks/ai-provider.mock.mjs';

describe('AIProvider', () => {
    let provider;

    beforeEach(() => {
        provider = new MockAIProvider();
    });

    describe('generateProjectDocs', () => {
        it('should generate project documentation with business context', async () => {
            const config = {
                projectName: 'test-project',
                projectPath: './test/fixtures/ecommerce',
            };

            const docs = await provider.generateProjectDocs(config);

            expect(docs).toBeDefined();
            expect(docs.businessPurpose).toBeDefined();
            expect(docs.stakeholders).toBeInstanceOf(Array);
            expect(docs.businessProcesses).toBeInstanceOf(Array);
            expect(docs.complianceRequirements).toBeInstanceOf(Array);
            expect(docs.businessMetrics).toBeInstanceOf(Array);
        });
    });

    describe('generateModuleDocs', () => {
        it('should generate module documentation with business context', async () => {
            const moduleInfo = {
                moduleName: 'Cart',
                modulePath: './test/fixtures/ecommerce/src/cart',
            };

            const docs = await provider.generateModuleDocs(moduleInfo);

            expect(docs).toBeDefined();
            expect(docs.businessDomain).toBeDefined();
            expect(docs.integrationPoints).toBeInstanceOf(Array);
            expect(docs.businessWorkflows).toBeInstanceOf(Array);
            expect(docs.businessRules).toBeInstanceOf(Array);
            expect(docs.performanceRequirements).toBeInstanceOf(Array);
        });
    });

    describe('generateFileDocs', () => {
        it('should generate file documentation with business context', async () => {
            const fileInfo = {
                fileName: 'cart.js',
                filePath: './test/fixtures/ecommerce/src/cart/cart.js',
            };

            const docs = await provider.generateFileDocs(fileInfo);

            expect(docs).toBeDefined();
            expect(docs.businessPurpose).toBeDefined();
            expect(docs.businessRules).toBeInstanceOf(Array);
            expect(docs.integrationRequirements).toBeInstanceOf(Array);
            expect(docs.errorHandling).toBeInstanceOf(Array);
            expect(docs.complianceRequirements).toBeInstanceOf(Array);
        });
    });

    describe('generateFunctionDocs', () => {
        it('should generate function documentation with business context', async () => {
            const functionInfo = {
                functionName: 'addToCart',
                filePath: './test/fixtures/ecommerce/src/cart/cart.js',
                functionBody: 'function addToCart(cart, item) { /* ... */ }',
            };

            const docs = await provider.generateFunctionDocs(functionInfo);

            expect(docs).toBeDefined();
            expect(docs.businessPurpose).toBeDefined();
            expect(docs.businessRules).toBeInstanceOf(Array);
            expect(docs.inputContext).toBeDefined();
            expect(docs.outputContext).toBeDefined();
            expect(docs.errorScenarios).toBeInstanceOf(Array);
            expect(docs.performanceRequirements).toBeInstanceOf(Array);
        });
    });

    describe('streamDocs', () => {
        it('should stream documentation generation', async () => {
            const prompt = 'Generate documentation for a test function';
            const stream = provider.streamDocs(prompt);

            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            expect(chunks.length).toBeGreaterThan(0);
            expect(chunks.join('')).toContain('test function');
        });
    });
}); 