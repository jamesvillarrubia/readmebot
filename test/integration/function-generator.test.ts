/**
 * Integration tests for function-level documentation generator
 */

import { describe, test, expect } from 'vitest';
import { FunctionGenerator } from '../../src/generators/function/function-generator.js';
import { MockAIProvider } from '../mocks/providers/ai/mock-ai-provider.js';
import { FunctionConfig } from '../../src/core/generators/function-generator.js';
import fs from 'fs/promises';
import path from 'path';

describe('FunctionGenerator Integration', () => {
    test('should generate complete documentation for a real function', async () => {
        // Create mock AI provider
        const mockAIProvider = new MockAIProvider({
            model: 'test-model',
            temperature: 0,
            apiKey: 'test-key',
            maxTokens: 1000
        });

        // Create function generator
        const generator = new FunctionGenerator(mockAIProvider);

        // Create test function file
        const testDir = path.join(process.cwd(), 'test', 'temp');
        const testFile = path.join(testDir, 'test-function.ts');

        await fs.mkdir(testDir, { recursive: true });

        const functionContent = `
            import { processData } from './data-processor';
            import { validateInput } from './validator';
            import { Logger } from './logger';

            /**
             * Processes user data and returns a formatted result
             * @param {object} userData - The user data to process
             * @param {object} options - Processing options
             * @returns {Promise<object>} Processed user data
             * @throws {ValidationError} When input validation fails
             * @throws {ProcessingError} When data processing fails
             */
            export async function processUserData(
                userData: {
                    id: string;
                    name: string;
                    email: string;
                },
                options: {
                    validate: boolean;
                    format: 'json' | 'xml';
                } = { validate: true, format: 'json' }
            ): Promise<object> {
                const logger = new Logger('processUserData');

                try {
                    // Validate input if required
                    if (options.validate) {
                        await validateInput(userData);
                    }

                    // Process the data
                    const result = await processData(userData, options.format);
                    logger.info('Data processed successfully');

                    return result;
                } catch (error) {
                    logger.error('Failed to process user data', error);
                    throw error;
                }
            }
        `;

        await fs.writeFile(testFile, functionContent);

        // Generate documentation
        const config: FunctionConfig = {
            functionName: 'processUserData',
            filePath: testFile,
            functionBody: functionContent
        };

        const docs = await generator.generateDocumentation(config);

        // Verify documentation structure
        expect(docs).toBeDefined();
        expect(docs.name).toBe('processUserData');
        expect(docs.description).toContain('Processes user data');

        // Verify parameters
        expect(docs.parameters).toHaveLength(2);
        const userDataParam = docs.parameters.find(p => p.name === 'userData');
        expect(userDataParam).toBeDefined();
        expect(userDataParam?.type).toContain('object');

        const optionsParam = docs.parameters.find(p => p.name === 'options');
        expect(optionsParam).toBeDefined();
        expect(optionsParam?.isOptional).toBe(true);

        // Verify return type
        expect(docs.returns.type).toBe('Promise<object>');

        // Verify errors
        expect(docs.errors).toHaveLength(2);
        expect(docs.errors.some(e => e.type === 'ValidationError')).toBe(true);
        expect(docs.errors.some(e => e.type === 'ProcessingError')).toBe(true);

        // Verify dependencies
        expect(docs.dependencies).toBeDefined();
        expect(docs.dependencies.some(d => d.name === './data-processor')).toBe(true);
        expect(docs.dependencies.some(d => d.name === './validator')).toBe(true);
        expect(docs.dependencies.some(d => d.name === './logger')).toBe(true);

        // Verify business context
        expect(docs.businessContext).toBeDefined();
        expect(docs.businessContext.purpose).toBeDefined();
        expect(docs.businessContext.rules).toBeDefined();
        expect(docs.businessContext.inputContext).toBeDefined();
        expect(docs.businessContext.outputContext).toBeDefined();
        expect(docs.businessContext.performanceRequirements).toBeDefined();

        // Verify examples and test cases
        expect(docs.examples).toBeDefined();
        expect(docs.examples.length).toBeGreaterThan(0);
        expect(docs.examples.some(e => e.includes('processUserData'))).toBe(true);
        expect(docs.examples.some(e => e.includes('try'))).toBe(true);

        expect(docs.testCases).toBeDefined();
        expect(docs.testCases.length).toBeGreaterThan(0);
        expect(docs.testCases.some(t => t.includes('test('))).toBe(true);
        expect(docs.testCases.some(t => t.includes('async'))).toBe(true);

        // Clean up
        await fs.rm(testDir, { recursive: true, force: true });
    });
}); 