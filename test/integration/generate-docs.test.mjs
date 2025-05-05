import { describe, it, expect } from 'vitest';
import { MockAIProvider } from '../mocks/ai-provider.mock.mjs';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('Documentation Generation Integration', () => {
    const aiProvider = new MockAIProvider();
    const projectPath = './test/fixtures/ecommerce';

    describe('E-commerce Project Documentation', () => {
        it('should generate complete project documentation', async () => {
            // Generate project-level documentation
            const projectDocs = await aiProvider.generateProjectDocs({
                projectName: 'E-Commerce System',
                projectPath
            });

            expect(projectDocs.businessPurpose).toBeDefined();
            expect(projectDocs.stakeholders.length).toBeGreaterThan(0);
            expect(projectDocs.businessProcesses.length).toBeGreaterThan(0);

            // Generate cart module documentation
            const cartModuleDocs = await aiProvider.generateModuleDocs({
                moduleName: 'Cart',
                modulePath: join(projectPath, 'src/cart')
            });

            expect(cartModuleDocs.businessDomain).toBeDefined();
            expect(cartModuleDocs.businessWorkflows.length).toBeGreaterThan(0);

            // Generate cart.js file documentation
            const cartFileDocs = await aiProvider.generateFileDocs({
                fileName: 'cart.js',
                filePath: join(projectPath, 'src/cart/cart.js')
            });

            expect(cartFileDocs.businessPurpose).toBeDefined();
            expect(cartFileDocs.businessRules.length).toBeGreaterThan(0);

            // Generate addToCart function documentation
            const cartFileContent = await readFile(join(projectPath, 'src/cart/cart.js'), 'utf-8');
            const addToCartDocs = await aiProvider.generateFunctionDocs({
                functionName: 'addToCart',
                filePath: join(projectPath, 'src/cart/cart.js'),
                functionBody: cartFileContent
            });

            expect(addToCartDocs.businessPurpose).toBeDefined();
            expect(addToCartDocs.inputContext).toBeDefined();
            expect(addToCartDocs.outputContext).toBeDefined();
        });

        it('should generate documentation for the product catalog', async () => {
            // Generate products module documentation
            const productsModuleDocs = await aiProvider.generateModuleDocs({
                moduleName: 'Products',
                modulePath: join(projectPath, 'src/products')
            });

            expect(productsModuleDocs.businessDomain).toBeDefined();
            expect(productsModuleDocs.businessWorkflows.length).toBeGreaterThan(0);

            // Generate products.js file documentation
            const productsFileDocs = await aiProvider.generateFileDocs({
                fileName: 'products.js',
                filePath: join(projectPath, 'src/products/products.js')
            });

            expect(productsFileDocs.businessPurpose).toBeDefined();
            expect(productsFileDocs.businessRules.length).toBeGreaterThan(0);

            // Generate ProductCatalog class documentation
            const productsFileContent = await readFile(join(projectPath, 'src/products/products.js'), 'utf-8');
            const productCatalogDocs = await aiProvider.generateFunctionDocs({
                functionName: 'ProductCatalog',
                filePath: join(projectPath, 'src/products/products.js'),
                functionBody: productsFileContent
            });

            expect(productCatalogDocs.businessPurpose).toBeDefined();
            expect(productCatalogDocs.businessRules.length).toBeGreaterThan(0);
        });

        it('should stream documentation for the entire project', async () => {
            const prompt = 'Generate documentation for the e-commerce system';
            const stream = aiProvider.streamDocs(prompt);

            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            const fullDoc = chunks.join('');
            expect(fullDoc).toContain('e-commerce system');
            expect(fullDoc).toContain('mock documentation stream');
        });
    });
}); 