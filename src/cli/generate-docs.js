import { MockAIProvider } from '../providers/ai/mock-ai-provider.mjs';
import { readFile } from 'fs/promises';
import { join } from 'path';

const aiProvider = new MockAIProvider();

async function generateDocumentation(projectPath) {
    try {
        // Generate project-level documentation
        const projectDocs = await aiProvider.generateProjectDocs({
            projectName: 'E-Commerce System',
            projectPath
        });

        console.log('Project Documentation:');
        console.log(JSON.stringify(projectDocs, null, 2));

        // Generate module-level documentation for cart
        const cartModuleDocs = await aiProvider.generateModuleDocs({
            moduleName: 'Cart',
            modulePath: join(projectPath, 'src/cart')
        });

        console.log('\nCart Module Documentation:');
        console.log(JSON.stringify(cartModuleDocs, null, 2));

        // Generate file-level documentation for cart.js
        const cartFileDocs = await aiProvider.generateFileDocs({
            fileName: 'cart.js',
            filePath: join(projectPath, 'src/cart/cart.js')
        });

        console.log('\nCart File Documentation:');
        console.log(JSON.stringify(cartFileDocs, null, 2));

        // Generate function-level documentation for addToCart
        const cartFileContent = await readFile(join(projectPath, 'src/cart/cart.js'), 'utf-8');
        const addToCartDocs = await aiProvider.generateFunctionDocs({
            functionName: 'addToCart',
            filePath: join(projectPath, 'src/cart/cart.js'),
            functionBody: cartFileContent
        });

        console.log('\naddToCart Function Documentation:');
        console.log(JSON.stringify(addToCartDocs, null, 2));

        // Demonstrate streaming documentation
        console.log('\nStreaming Documentation:');
        const stream = aiProvider.streamDocs('Generate documentation for the e-commerce system');
        for await (const chunk of stream) {
            process.stdout.write(chunk);
        }

    } catch (error) {
        console.error('Error generating documentation:', error);
        process.exit(1);
    }
}

// Get project path from command line argument or use default
const projectPath = process.argv[2] || './test/fixtures/ecommerce';
generateDocumentation(projectPath); 