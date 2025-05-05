/**
 * Tests for function-level documentation generator
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { FunctionGenerator } from '../../../src/generators/function/function-generator.js';
import { MockAIProvider } from '../../mocks/providers/ai/mock-ai-provider.js';
import { FunctionConfig } from '../../../src/core/generators/function-generator.js';

describe('FunctionGenerator', () => {
    let generator: FunctionGenerator;
    let mockAIProvider: MockAIProvider;

    beforeEach(() => {
        mockAIProvider = new MockAIProvider({
            model: 'test-model',
            temperature: 0,
            apiKey: 'test-key',
            maxTokens: 1000
        });
        generator = new FunctionGenerator(mockAIProvider);
    });

    test('should generate documentation for a simple function', async () => {
        const config: FunctionConfig = {
            functionName: 'testFunction',
            filePath: 'test.ts',
            functionBody: `
                /**
                 * Test function description
                 * @param {string} name - The name parameter
                 * @param {number} age - The age parameter
                 * @returns {boolean} Whether the operation succeeded
                 * @throws {Error} When name is empty
                 */
                function testFunction(name: string, age: number = 0): boolean {
                    if (!name) throw new Error('Name is required');
                    return true;
                }
            `
        };

        const docs = await generator.generateDocumentation(config);

        expect(docs).toBeDefined();
        expect(docs.name).toBe('testFunction');
        expect(docs.description).toContain('Test function description');
        expect(docs.parameters).toHaveLength(2);
        expect(docs.parameters[0]?.name).toBe('name');
        expect(docs.parameters[0]?.type).toBe('string');
        expect(docs.parameters[1]?.name).toBe('age');
        expect(docs.parameters[1]?.type).toBe('number');
        expect(docs.returns.type).toBe('boolean');
        expect(docs.errors).toHaveLength(1);
        expect(docs.errors[0]?.type).toBe('Error');
        expect(docs.businessContext).toBeDefined();
        expect(docs.examples).toHaveLength(2);
        expect(docs.testCases).toHaveLength(2);
    });

    test('should handle function with no JSDoc comments', async () => {
        const config: FunctionConfig = {
            functionName: 'simpleFunction',
            filePath: 'test.ts',
            functionBody: `
                function simpleFunction() {
                    return true;
                }
            `
        };

        const docs = await generator.generateDocumentation(config);

        expect(docs).toBeDefined();
        expect(docs.name).toBe('simpleFunction');
        expect(docs.description).toBe('No description available');
        expect(docs.parameters).toHaveLength(0);
        expect(docs.returns.type).toBe('void');
        expect(docs.errors).toHaveLength(0);
    });

    test('should analyze function dependencies', async () => {
        const config: FunctionConfig = {
            functionName: 'complexFunction',
            filePath: 'test.ts',
            functionBody: `
                import { helper } from './helper';
                import { utils } from './utils';

                function complexFunction(data: string): Promise<void> {
                    helper(data);
                    utils.process(data);
                    return Promise.resolve();
                }
            `
        };

        const docs = await generator.generateDocumentation(config);

        expect(docs.dependencies).toBeDefined();
        expect(docs.dependencies.length).toBeGreaterThan(0);
        expect(docs.dependencies.some(d => d.name === './helper')).toBe(true);
        expect(docs.dependencies.some(d => d.name === './utils')).toBe(true);
    });

    test('should generate examples and test cases', async () => {
        const config: FunctionConfig = {
            functionName: 'processData',
            filePath: 'test.ts',
            functionBody: `
                function processData(input: string, options?: { validate: boolean }): string {
                    return input.toUpperCase();
                }
            `
        };

        const docs = await generator.generateDocumentation(config);

        expect(docs.examples).toBeDefined();
        expect(docs.examples.length).toBeGreaterThan(0);
        expect(docs.examples[0]).toContain('processData');
        expect(docs.testCases).toBeDefined();
        expect(docs.testCases.length).toBeGreaterThan(0);
        expect(docs.testCases[0]).toContain('test(');
    });

    test('should handle async functions', async () => {
        const config: FunctionConfig = {
            functionName: 'fetchData',
            filePath: 'test.ts',
            functionBody: `
                /**
                 * Fetches data from an API
                 * @param {string} url - The API URL
                 * @returns {Promise<object>} The fetched data
                 * @throws {Error} When the fetch fails
                 */
                async function fetchData(url: string): Promise<object> {
                    const response = await fetch(url);
                    return response.json();
                }
            `
        };

        const docs = await generator.generateDocumentation(config);

        expect(docs).toBeDefined();
        expect(docs.returns.type).toBe('Promise<object>');
        expect(docs.examples.some(e => e.includes('await'))).toBe(true);
        expect(docs.testCases.some(t => t.includes('async'))).toBe(true);
    });
}); 