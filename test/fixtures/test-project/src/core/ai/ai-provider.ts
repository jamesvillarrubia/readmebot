import { z } from 'zod';

/**
 * Interface for AI providers that generate documentation
 */
export interface AIProvider {
    /**
     * Generates project-level documentation with business context
     * @param config Project configuration
     * @returns Project documentation
     * @throws Error if project configuration is invalid
     */
    generateProjectDocs(config: {
        projectName: string;
        projectPath: string;
    }): Promise<{
        businessPurpose: string;
        stakeholders: string[];
        businessProcesses: string[];
        complianceRequirements: string[];
        businessMetrics: string[];
    }>;

    /**
     * Generates module-level documentation with business context
     * @param moduleInfo Module information
     * @returns Module documentation
     * @throws Error if module information is invalid
     */
    generateModuleDocs(moduleInfo: {
        moduleName: string;
        modulePath: string;
    }): Promise<{
        businessDomain: string;
        integrationPoints: string[];
        businessWorkflows: string[];
        businessRules: string[];
        performanceRequirements: string[];
    }>;

    /**
     * Generates file-level documentation with business context
     * @param fileInfo File information
     * @returns File documentation
     * @throws Error if file information is invalid
     */
    generateFileDocs(fileInfo: {
        fileName: string;
        filePath: string;
    }): Promise<{
        businessPurpose: string;
        businessRules: string[];
        integrationRequirements: string[];
        errorHandling: string[];
        complianceRequirements: string[];
    }>;

    /**
     * Generates function-level documentation with business context
     * @param functionInfo Function information
     * @returns Function documentation
     * @throws Error if function information is invalid
     */
    generateFunctionDocs(functionInfo: {
        functionName: string;
        filePath: string;
        functionBody: string;
    }): Promise<{
        businessPurpose: string;
        businessRules: string[];
        inputContext: string;
        outputContext: string;
        errorScenarios: string[];
        performanceRequirements: string[];
    }>;

    /**
     * Streams documentation generation
     * @param prompt Documentation prompt
     * @returns Async generator of documentation chunks
     */
    streamDocs(prompt: string): AsyncGenerator<string, void, unknown>;
}

/**
 * Configuration for AI provider
 */
export const AIProviderConfigSchema = z.object({
    apiKey: z.string(),
    model: z.string(),
    temperature: z.number().min(0).max(1),
    maxTokens: z.number().min(1)
});

export type AIProviderConfig = z.infer<typeof AIProviderConfigSchema>;

/**
 * Error handling for AI provider
 */
export class AIProviderError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'AIProviderError';
    }
}

/**
 * Base implementation of AI provider
 */
export abstract class BaseAIProvider implements AIProvider {
    constructor(protected readonly config: AIProviderConfig) {
        try {
            AIProviderConfigSchema.parse(config);
        } catch (error) {
            throw new AIProviderError(
                'Invalid AI provider configuration',
                'INVALID_CONFIG',
                error
            );
        }
    }

    abstract generateProjectDocs(config: {
        projectName: string;
        projectPath: string;
    }): Promise<{
        businessPurpose: string;
        stakeholders: string[];
        businessProcesses: string[];
        complianceRequirements: string[];
        businessMetrics: string[];
    }>;

    abstract generateModuleDocs(moduleInfo: {
        moduleName: string;
        modulePath: string;
    }): Promise<{
        businessDomain: string;
        integrationPoints: string[];
        businessWorkflows: string[];
        businessRules: string[];
        performanceRequirements: string[];
    }>;

    abstract generateFileDocs(fileInfo: {
        fileName: string;
        filePath: string;
    }): Promise<{
        businessPurpose: string;
        businessRules: string[];
        integrationRequirements: string[];
        errorHandling: string[];
        complianceRequirements: string[];
    }>;

    abstract generateFunctionDocs(functionInfo: {
        functionName: string;
        filePath: string;
        functionBody: string;
    }): Promise<{
        businessPurpose: string;
        businessRules: string[];
        inputContext: string;
        outputContext: string;
        errorScenarios: string[];
        performanceRequirements: string[];
    }>;

    abstract streamDocs(prompt: string): AsyncGenerator<string, void, unknown>;

    /**
     * Handles errors in AI provider operations
     * @param error Error to handle
     * @throws AIProviderError
     */
    protected handleError(error: unknown): never {
        if (error instanceof AIProviderError) {
            throw error;
        }

        try {
            throw new AIProviderError(
                'Unexpected error in AI provider',
                'UNEXPECTED_ERROR',
                error
            );
        } catch (e) {
            console.error('Error handling failed:', e);
            throw new AIProviderError(
                'Critical error in AI provider',
                'CRITICAL_ERROR'
            );
        }
    }
} 