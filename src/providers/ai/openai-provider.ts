import OpenAI from 'openai';
import { AIProvider, ModuleDocumentation } from '../../core/ai/ai-provider.js';
import { AIProviderError } from '../../core/ai/types.js';

/**
 * Configuration for OpenAI provider
 */
export interface OpenAIProviderConfig {
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider implements AIProvider {
    private client: OpenAI;
    private readonly defaultModel = 'gpt-4-turbo-preview';

    constructor(private readonly config: OpenAIProviderConfig) {
        this.client = new OpenAI({
            apiKey: config.apiKey
        });
    }

    /**
     * Generates project-level documentation with business context
     */
    async generateProjectDocs(config: {
        projectName: string;
        projectPath: string;
    }): Promise<{
        businessPurpose: string;
        stakeholders: string[];
        businessProcesses: string[];
        complianceRequirements: string[];
        businessMetrics: string[];
    }> {
        const prompt = `Generate comprehensive project documentation for the project:
Name: ${config.projectName}
Path: ${config.projectPath}

Please provide:
1. Business purpose
2. Key stakeholders
3. Business processes
4. Compliance requirements
5. Business metrics

Format the response as JSON with the following structure:
{
    "businessPurpose": "string",
    "stakeholders": ["string"],
    "businessProcesses": ["string"],
    "complianceRequirements": ["string"],
    "businessMetrics": ["string"]
}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new AIProviderError(
                    'Empty response from OpenAI',
                    'EMPTY_RESPONSE'
                );
            }

            return JSON.parse(content);
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError(
                'Failed to generate project documentation',
                'OPENAI_ERROR',
                { cause: error }
            );
        }
    }

    /**
     * Generates module-level documentation with business context
     */
    async generateModuleDocs(moduleInfo: {
        moduleName: string;
        modulePath: string;
    }): Promise<{
        businessDomain: string;
        integrationPoints: string[];
        businessWorkflows: string[];
        businessRules: string[];
        performanceRequirements: string[];
    }> {
        const prompt = `Generate comprehensive module documentation for:
Module: ${moduleInfo.moduleName}
Path: ${moduleInfo.modulePath}

Please provide:
1. Business domain
2. Integration points
3. Business workflows
4. Business rules
5. Performance requirements

Format the response as JSON with the following structure:
{
    "businessDomain": "string",
    "integrationPoints": ["string"],
    "businessWorkflows": ["string"],
    "businessRules": ["string"],
    "performanceRequirements": ["string"]
}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new AIProviderError(
                    'Empty response from OpenAI',
                    'EMPTY_RESPONSE'
                );
            }

            return JSON.parse(content);
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError(
                'Failed to generate module documentation',
                'OPENAI_ERROR',
                { cause: error }
            );
        }
    }

    /**
     * Generates file-level documentation with business context
     */
    async generateFileDocs(fileInfo: {
        fileName: string;
        filePath: string;
    }): Promise<{
        businessPurpose: string;
        businessRules: string[];
        integrationRequirements: string[];
        errorHandling: string[];
        complianceRequirements: string[];
    }> {
        const prompt = `Generate comprehensive file documentation for:
File: ${fileInfo.fileName}
Path: ${fileInfo.filePath}

Please provide:
1. Business purpose
2. Business rules
3. Integration requirements
4. Error handling
5. Compliance requirements

Format the response as JSON with the following structure:
{
    "businessPurpose": "string",
    "businessRules": ["string"],
    "integrationRequirements": ["string"],
    "errorHandling": ["string"],
    "complianceRequirements": ["string"]
}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new AIProviderError(
                    'Empty response from OpenAI',
                    'EMPTY_RESPONSE'
                );
            }

            return JSON.parse(content);
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError(
                'Failed to generate file documentation',
                'OPENAI_ERROR',
                { cause: error }
            );
        }
    }

    /**
     * Generates function-level documentation with business context
     */
    async generateFunctionDocs(functionInfo: {
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
    }> {
        const prompt = `Generate comprehensive function documentation for:
Function: ${functionInfo.functionName}
Path: ${functionInfo.filePath}

Function body:
${functionInfo.functionBody}

Please provide:
1. Business purpose
2. Business rules
3. Input context
4. Output context
5. Error scenarios
6. Performance requirements

Format the response as JSON with the following structure:
{
    "businessPurpose": "string",
    "businessRules": ["string"],
    "inputContext": "string",
    "outputContext": "string",
    "errorScenarios": ["string"],
    "performanceRequirements": ["string"]
}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new AIProviderError(
                    'Empty response from OpenAI',
                    'EMPTY_RESPONSE'
                );
            }

            return JSON.parse(content);
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError(
                'Failed to generate function documentation',
                'OPENAI_ERROR',
                { cause: error }
            );
        }
    }

    /**
     * Streams documentation generation
     */
    async *streamDocs(prompt: string): AsyncGenerator<string, void, unknown> {
        try {
            const stream = await this.client.chat.completions.create({
                model: this.config.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                stream: true
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    yield content;
                }
            }
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError(
                'Failed to stream documentation',
                'OPENAI_ERROR',
                { cause: error }
            );
        }
    }

    /**
     * Validates module documentation using AI
     */
    async validateModuleDocs(docs: ModuleDocumentation): Promise<{
        errors: string[];
        warnings: string[];
    }> {
        const prompt = `Validate the following module documentation:
${JSON.stringify(docs, null, 2)}

Please check for:
1. Missing required information
2. Inconsistencies
3. Unclear descriptions
4. Potential issues

Format the response as JSON with the following structure:
{
    "errors": ["string"],
    "warnings": ["string"]
}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new AIProviderError(
                    'Empty response from OpenAI',
                    'EMPTY_RESPONSE'
                );
            }

            return JSON.parse(content);
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError(
                'Failed to validate module documentation',
                'OPENAI_ERROR',
                { cause: error }
            );
        }
    }

    /**
     * Verifies module documentation completeness
     */
    async verifyModuleDocsCompleteness(docs: ModuleDocumentation): Promise<{
        errors: string[];
        warnings: string[];
    }> {
        const prompt = `Verify the completeness of the following module documentation:
${JSON.stringify(docs, null, 2)}

Please check for:
1. Missing required information
2. Empty sections
3. Incomplete descriptions
4. Missing dependencies
5. Missing API documentation

Format the response as JSON with the following structure:
{
    "errors": ["string"],
    "warnings": ["string"]
}`;

        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model || this.defaultModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new AIProviderError(
                    'Empty response from OpenAI',
                    'EMPTY_RESPONSE'
                );
            }

            return JSON.parse(content);
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }
            throw new AIProviderError(
                'Failed to verify module documentation completeness',
                'OPENAI_ERROR',
                { cause: error }
            );
        }
    }
} 