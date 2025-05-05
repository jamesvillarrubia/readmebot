import { z } from 'zod';

/**
 * Schema for AI provider configuration
 */
export const AIConfigSchema = z.object({
    provider: z.enum(['openai', 'anthropic']),
    apiKey: z.string(),
    model: z.string().optional(),
    maxTokens: z.number().optional(),
    temperature: z.number().min(0).max(2).optional(),
});

/**
 * Schema for file system configuration
 */
export const FSConfigSchema = z.object({
    watchEnabled: z.boolean().optional(),
    watchInterval: z.number().optional(),
    encoding: z.enum(['utf8', 'binary']).optional(),
});

/**
 * Schema for documentation configuration
 */
export const DocumentationConfigSchema = z.object({
    template: z.string().optional(),
    outputPath: z.string().optional(),
    format: z.enum(['markdown', 'text']).optional(),
    excludePatterns: z.array(z.string()).optional(),
    includePatterns: z.array(z.string()).optional(),
});

/**
 * Schema for complete application configuration
 */
export const ConfigSchema = z.object({
    ai: AIConfigSchema,
    fs: FSConfigSchema.optional(),
    documentation: DocumentationConfigSchema.optional(),
    debug: z.boolean().optional(),
    logLevel: z.enum(['error', 'warn', 'info', 'debug', 'trace']).optional(),
});

// TypeScript types derived from Zod schemas
export type AIConfig = z.infer<typeof AIConfigSchema>;
export type FSConfig = z.infer<typeof FSConfigSchema>;
export type DocumentationConfig = z.infer<typeof DocumentationConfigSchema>;
export type Config = z.infer<typeof ConfigSchema>;

/**
 * Interface for configuration management
 */
export interface ConfigManager {
    /**
     * Loads configuration from various sources
     * @returns Promise resolving to the loaded configuration
     */
    load(): Promise<Config>;

    /**
     * Gets the current configuration
     * @returns The current configuration
     */
    get(): Config;

    /**
     * Updates the configuration
     * @param config - Partial configuration to merge
     * @returns The updated configuration
     */
    update(config: Partial<Config>): Config;

    /**
     * Validates a configuration object
     * @param config - Configuration to validate
     * @returns The validated configuration
     * @throws {Error} If validation fails
     */
    validate(config: unknown): Config;
} 