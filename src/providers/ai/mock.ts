import { AIProvider, Summary, SummaryOptions, DocumentationData, Documentation } from '../../core/ai/types.js';

/**
 * Mock AI provider for testing
 */
export class MockAIProvider implements AIProvider {
    private responses: Map<string, string>;
    private streamResponses: Map<string, string[]>;
    private readonly name: string;
    private readonly models: string[];

    constructor(
        name = 'mock',
        models = ['mock-model-1', 'mock-model-2'],
        responses: Map<string, string> = new Map(),
        streamResponses: Map<string, string[]> = new Map()
    ) {
        this.name = name;
        this.models = models;
        this.responses = responses;
        this.streamResponses = streamResponses;
    }

    getName(): string {
        return this.name;
    }

    async getAvailableModels(): Promise<string[]> {
        return this.models;
    }

    async validate(): Promise<boolean> {
        return true;
    }

    async generateSummary(content: string, options: SummaryOptions): Promise<Summary> {
        const response = this.responses.get(content) || 'Mock summary for: ' + content;
        return {
            content: response,
            metadata: {
                tokens: response.length,
                model: 'mock-model',
            },
        };
    }

    async generateDocumentation(data: DocumentationData): Promise<Documentation> {
        const response = this.responses.get(JSON.stringify(data)) ||
            'Mock documentation for: ' + JSON.stringify(data);
        return {
            content: response,
            metadata: {
                model: 'mock-model',
                tokens: response.length,
            },
        };
    }

    streamResponse(prompt: string): AsyncIterable<string> {
        const responses = this.streamResponses.get(prompt) || ['Mock', 'streaming', 'response'];
        return {
            async *[Symbol.asyncIterator]() {
                for (const chunk of responses) {
                    yield chunk;
                }
            }
        };
    }

    /**
     * Sets a mock response for a specific input
     */
    setResponse(input: string, response: string): void {
        this.responses.set(input, response);
    }

    /**
     * Sets a mock streaming response for a specific prompt
     */
    setStreamResponse(prompt: string, responses: string[]): void {
        this.streamResponses.set(prompt, responses);
    }

    /**
     * Clears all mock responses
     */
    clear(): void {
        this.responses.clear();
        this.streamResponses.clear();
    }
} 