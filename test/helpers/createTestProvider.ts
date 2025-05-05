import { MockAIProvider } from '../../src/providers/ai/mock.js';
import type { AIProvider } from '../../src/core/ai/types.js';

export interface TestProviderOptions {
    name?: string;
    models?: string[];
    responses?: Map<string, string>;
    streamResponses?: Map<string, string[]>;
}

/**
 * Creates a mock AI provider for testing
 * @param options - Configuration options for the mock provider
 * @returns A configured mock AI provider
 */
export function createTestProvider(options: TestProviderOptions = {}): AIProvider {
    const {
        name = 'test-mock',
        models = ['test-model-1', 'test-model-2'],
        responses = new Map(),
        streamResponses = new Map()
    } = options;

    return new MockAIProvider(name, models, responses, streamResponses);
}

/**
 * Creates a mock AI provider with pre-configured responses
 * @param responses - Map of input strings to response strings
 * @returns A mock provider with the specified responses
 */
export function createTestProviderWithResponses(responses: Record<string, string>): AIProvider {
    const responseMap = new Map(Object.entries(responses));
    return createTestProvider({ responses: responseMap });
}

/**
 * Creates a mock AI provider with pre-configured streaming responses
 * @param responses - Map of prompts to arrays of response chunks
 * @returns A mock provider with the specified streaming responses
 */
export function createTestProviderWithStreamResponses(
    responses: Record<string, string[]>
): AIProvider {
    const responseMap = new Map(Object.entries(responses));
    return createTestProvider({ streamResponses: responseMap });
}

/**
 * Helper to collect all chunks from an async iterable into an array
 * @param iterable - The async iterable to collect from
 * @returns Promise resolving to array of chunks
 */
export async function collectStreamResponse(
    iterable: AsyncIterable<string>
): Promise<string[]> {
    const chunks: string[] = [];
    for await (const chunk of iterable) {
        chunks.push(chunk);
    }
    return chunks;
} 