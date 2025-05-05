import { z } from 'zod';

/**
 * Represents metadata about an AI-generated response
 */
export const ResponseMetadataSchema = z.object({
    tokens: z.number(),
    model: z.string(),
    provider: z.string(),
    timestamp: z.number(),
});

export type ResponseMetadata = z.infer<typeof ResponseMetadataSchema>;

/**
 * Represents a summary of a code file or section
 */
export const SummaryMetadataSchema = z.object({
    tokens: z.number(),
    model: z.string(),
});

export const SummarySchema = z.object({
    content: z.string(),
    metadata: SummaryMetadataSchema,
});

export type SummaryMetadata = z.infer<typeof SummaryMetadataSchema>;
export type Summary = z.infer<typeof SummarySchema>;

/**
 * Options for generating summaries
 */
export const SummaryOptionsSchema = z.object({
    maxTokens: z.number().optional(),
    temperature: z.number().min(0).max(2).optional(),
    format: z.string().optional(),
});

export type SummaryOptions = z.infer<typeof SummaryOptionsSchema>;

/**
 * Represents documentation data used for generation
 */
export const DocumentationDataSchema = z.object({
    content: z.string(),
    metadata: z.record(z.string(), z.unknown()),
});

export type DocumentationData = z.infer<typeof DocumentationDataSchema>;

/**
 * Represents generated documentation
 */
export const DocumentationSchema = z.object({
    content: z.string(),
    metadata: z.record(z.string(), z.unknown()),
});

export type Documentation = z.infer<typeof DocumentationSchema>;

/**
 * Options for generating documentation
 */
export const DocumentationOptionsSchema = z.object({
    format: z.enum(['markdown', 'html', 'json']).optional(),
    template: z.string().optional(),
    maxTokens: z.number().optional(),
    temperature: z.number().min(0).max(2).optional(),
    model: z.string().optional(),
});

export type DocumentationOptions = z.infer<typeof DocumentationOptionsSchema>;

/**
 * Represents an error from the AI provider
 */
export class AIProviderError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly metadata?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'AIProviderError';
    }
}

/**
 * Interface for AI providers that generate documentation and summaries
 */
export interface AIProvider {
    /**
     * Generates a summary of the provided content
     * @param content - The content to summarize
     * @param options - Options for summary generation
     * @returns A promise that resolves to a Summary object
     */
    generateSummary(content: string, options: SummaryOptions): Promise<Summary>;

    /**
     * Generates documentation from the provided data
     * @param data - The data to generate documentation from
     * @returns A promise that resolves to a Documentation object
     */
    generateDocumentation(data: DocumentationData): Promise<Documentation>;

    /**
     * Streams a response for the given prompt
     * @param prompt - The prompt to generate a response for
     * @returns An async iterable that yields response chunks
     */
    streamResponse(prompt: string): AsyncIterable<string>;

    /**
     * Gets the provider's name
     */
    getName(): string;

    /**
     * Gets the available models for this provider
     */
    getAvailableModels(): Promise<string[]>;

    /**
     * Validates that the provider is properly configured
     */
    validate(): Promise<boolean>;
} 