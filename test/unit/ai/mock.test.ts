import { describe, it, expect, beforeEach } from 'vitest';
import type { DocumentationData } from '../../../src/core/ai/types.js';
import {
    createTestProvider,
    createTestProviderWithResponses,
    createTestProviderWithStreamResponses,
    collectStreamResponse,
} from '../../helpers/createTestProvider.js';

describe('MockAIProvider', () => {
    let provider: ReturnType<typeof createTestProvider>;

    beforeEach(() => {
        provider = createTestProvider();
    });

    describe('getName', () => {
        it('should return the provider name', () => {
            expect(provider.getName()).toBe('test-mock');
        });

        it('should return custom name when provided', () => {
            const customProvider = createTestProvider({ name: 'custom-mock' });
            expect(customProvider.getName()).toBe('custom-mock');
        });
    });

    describe('getAvailableModels', () => {
        it('should return default models', async () => {
            const models = await provider.getAvailableModels();
            expect(models).toEqual(['test-model-1', 'test-model-2']);
        });

        it('should return custom models when provided', async () => {
            const customModels = ['custom-model-1', 'custom-model-2'];
            const customProvider = createTestProvider({ models: customModels });
            const models = await customProvider.getAvailableModels();
            expect(models).toEqual(customModels);
        });
    });

    describe('validate', () => {
        it('should always return true', async () => {
            expect(await provider.validate()).toBe(true);
        });
    });

    describe('generateSummary', () => {
        it('should generate default mock summary', async () => {
            const content = 'test content';
            const summary = await provider.generateSummary(content, {});
            expect(summary.content).toBe('Mock summary for: test content');
            expect(summary.metadata).toEqual({
                tokens: summary.content.length,
                model: 'mock-model',
            });
        });

        it('should return custom response when set', async () => {
            const content = 'test content';
            const customResponse = 'Custom summary response';
            const provider = createTestProviderWithResponses({
                [content]: customResponse,
            });
            const summary = await provider.generateSummary(content, {});
            expect(summary.content).toBe(customResponse);
        });
    });

    describe('generateDocumentation', () => {
        it('should generate default mock documentation', async () => {
            const data: DocumentationData = {
                content: 'test content',
                metadata: { type: 'test' },
            };
            const doc = await provider.generateDocumentation(data);
            expect(doc.content).toBe('Mock documentation for: ' + JSON.stringify(data));
            expect(doc.metadata).toEqual({
                model: 'mock-model',
                tokens: doc.content.length,
            });
        });

        it('should return custom response when set', async () => {
            const data: DocumentationData = {
                content: 'test content',
                metadata: { type: 'test' },
            };
            const customResponse = 'Custom documentation response';
            const provider = createTestProviderWithResponses({
                [JSON.stringify(data)]: customResponse,
            });
            const doc = await provider.generateDocumentation(data);
            expect(doc.content).toBe(customResponse);
        });
    });

    describe('streamResponse', () => {
        it('should stream default mock response', async () => {
            const prompt = 'test prompt';
            const chunks = await collectStreamResponse(provider.streamResponse(prompt));
            expect(chunks).toEqual(['Mock', 'streaming', 'response']);
        });

        it('should stream custom response when set', async () => {
            const prompt = 'test prompt';
            const customResponses = ['Custom', 'stream', 'response'];
            const provider = createTestProviderWithStreamResponses({
                [prompt]: customResponses,
            });
            const chunks = await collectStreamResponse(provider.streamResponse(prompt));
            expect(chunks).toEqual(customResponses);
        });
    });
}); 