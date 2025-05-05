import { describe, it, expect, beforeEach } from 'vitest';
import type {
    AIProvider,
    Summary,
    Documentation,
    SummaryOptions,
    DocumentationOptions,
    DocumentationData,
} from '../../../src/core/ai/types.js';

class MockAIProvider implements AIProvider {
    private responses: Map<string, string>;
    private isValid: boolean;
    private availableModels: string[];

    constructor(
        responses: Map<string, string> = new Map(),
        isValid = true,
        models: string[] = ['test-model']
    ) {
        this.responses = responses;
        this.isValid = isValid;
        this.availableModels = models;
    }

    async generateSummary(content: string, options?: SummaryOptions): Promise<Summary> {
        return {
            content: this.responses.get(content) || 'Mock summary for: ' + content,
            metadata: {
                tokens: content.length,
                model: options?.model || 'test-model',
                provider: this.getName(),
                timestamp: Date.now(),
            },
        };
    }

    async generateDocumentation(
        data: DocumentationData,
        options?: DocumentationOptions
    ): Promise<Documentation> {
        return {
            content: 'Mock documentation',
            metadata: {
                tokens: 100,
                model: options?.model || 'test-model',
                provider: this.getName(),
                timestamp: Date.now(),
            },
            sections: {
                introduction: 'Mock introduction',
                summary: 'Mock summary',
            },
        };
    }

    streamResponse(prompt: string): AsyncIterableIterator<string> {
        const response = this.responses.get(prompt) || 'Mock streaming response for: ' + prompt;
        let index = 0;

        return {
            async next(): Promise<IteratorResult<string>> {
                if (index < response.length) {
                    return { value: response[index++], done: false };
                }
                return { value: '', done: true };
            },
            async return(): Promise<IteratorResult<string>> {
                return { value: '', done: true };
            },
            async throw(error?: unknown): Promise<IteratorResult<string>> {
                throw error;
            },
            [Symbol.asyncIterator](): AsyncIterableIterator<string> {
                return this;
            },
        };
    }

    getName(): string {
        return 'mock-provider';
    }

    async getAvailableModels(): Promise<string[]> {
        return this.availableModels;
    }

    async validate(): Promise<boolean> {
        return this.isValid;
    }
}

describe('MockAIProvider', () => {
    let provider: AIProvider;
    let responses: Map<string, string>;

    beforeEach(() => {
        responses = new Map([
            ['test content', 'Test summary'],
            ['test prompt', 'Test streaming response'],
        ]);
        provider = new MockAIProvider(responses);
    });

    describe('generateSummary', () => {
        it('should generate a summary with correct metadata', async () => {
            const summary = await provider.generateSummary('test content');
            expect(summary.content).toBe('Test summary');
            expect(summary.metadata).toMatchObject({
                model: 'test-model',
                provider: 'mock-provider',
            });
            expect(summary.metadata.tokens).toBe('test content'.length);
            expect(summary.metadata.timestamp).toBeDefined();
        });

        it('should use custom model when provided', async () => {
            const summary = await provider.generateSummary('test content', {
                model: 'custom-model',
            });
            expect(summary.metadata.model).toBe('custom-model');
        });

        it('should generate default summary for unknown content', async () => {
            const summary = await provider.generateSummary('unknown content');
            expect(summary.content).toBe('Mock summary for: unknown content');
        });
    });

    describe('generateDocumentation', () => {
        it('should generate documentation with sections', async () => {
            const data: DocumentationData = {
                summaries: {},
                template: 'default',
            };
            const doc = await provider.generateDocumentation(data);
            expect(doc.content).toBe('Mock documentation');
            expect(doc.sections).toBeDefined();
            expect(doc.sections?.introduction).toBe('Mock introduction');
        });
    });

    describe('streamResponse', () => {
        it('should stream response character by character', async () => {
            const iterator = provider.streamResponse('test prompt');
            const response: string[] = [];
            for await (const chunk of iterator) {
                response.push(chunk);
            }
            expect(response.join('')).toBe('Test streaming response');
        });
    });

    describe('validation', () => {
        it('should validate successfully by default', async () => {
            expect(await provider.validate()).toBe(true);
        });

        it('should fail validation when configured', async () => {
            const invalidProvider = new MockAIProvider(new Map(), false);
            expect(await invalidProvider.validate()).toBe(false);
        });
    });

    describe('models', () => {
        it('should return configured models', async () => {
            const customModels = ['model1', 'model2'];
            const providerWithModels = new MockAIProvider(new Map(), true, customModels);
            expect(await providerWithModels.getAvailableModels()).toEqual(customModels);
        });
    });
});

// Export for use in other tests
export { MockAIProvider }; 