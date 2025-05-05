import { AIProvider } from '../../../../src/core/ai/ai-provider.js';

/**
 * Configuration for mock AI provider
 */
export interface MockAIProviderConfig {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
}

/**
 * Error class for mock AI provider
 */
export class MockAIProviderError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'MockAIProviderError';
    }
}

/**
 * Mock implementation of AI provider for testing
 */
export class MockAIProvider implements AIProvider {
    constructor(private readonly config: MockAIProviderConfig) { }

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
        return {
            businessPurpose: 'Test project business purpose',
            stakeholders: ['Test stakeholder 1', 'Test stakeholder 2'],
            businessProcesses: ['Test process 1', 'Test process 2'],
            complianceRequirements: ['Test compliance 1', 'Test compliance 2'],
            businessMetrics: ['Test metric 1', 'Test metric 2']
        };
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
        return {
            businessDomain: 'Test module business domain',
            integrationPoints: ['Test integration 1', 'Test integration 2'],
            businessWorkflows: ['Test workflow 1', 'Test workflow 2'],
            businessRules: ['Test rule 1', 'Test rule 2'],
            performanceRequirements: ['Test requirement 1', 'Test requirement 2']
        };
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
        return {
            businessPurpose: 'Test file business purpose',
            businessRules: ['Test rule 1', 'Test rule 2'],
            integrationRequirements: ['Test requirement 1', 'Test requirement 2'],
            errorHandling: ['Test error 1', 'Test error 2'],
            complianceRequirements: ['Test compliance 1', 'Test compliance 2']
        };
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
        return {
            businessPurpose: 'Test function business purpose',
            businessRules: ['Test rule 1', 'Test rule 2'],
            inputContext: 'Test input context',
            outputContext: 'Test output context',
            errorScenarios: ['Test scenario 1', 'Test scenario 2'],
            performanceRequirements: ['Test requirement 1', 'Test requirement 2']
        };
    }

    /**
     * Streams documentation generation
     */
    async *streamDocs(prompt: string): AsyncGenerator<string, void, unknown> {
        yield 'Generating documentation for test function...\n';
        yield 'This is a test function that demonstrates functionality.\n';
        yield 'The test function takes input and produces output.\n';
    }

    /**
     * Validates module documentation using AI
     */
    async validateModuleDocs(docs: any): Promise<{
        errors: string[];
        warnings: string[];
    }> {
        return {
            errors: [],
            warnings: []
        };
    }

    /**
     * Verifies module documentation completeness using AI
     */
    async verifyModuleDocsCompleteness(docs: any): Promise<{
        errors: string[];
        warnings: string[];
    }> {
        const warnings: string[] = [];

        // Check for empty sections
        if (docs.businessContext && (!docs.businessContext.domain || !docs.businessContext.purpose)) {
            warnings.push('Business context section is empty');
        }
        if (docs.architecture && docs.architecture.components.length === 0) {
            warnings.push('Architecture section is empty');
        }
        if (docs.api && docs.api.exports.length === 0) {
            warnings.push('API section is empty');
        }
        if (docs.dependencies && docs.dependencies.length === 0) {
            warnings.push('Dependencies section is empty');
        }

        return {
            errors: [],
            warnings
        };
    }

    /**
     * Simulates an error in the AI provider
     * @throws MockAIProviderError
     */
    simulateError(): never {
        throw new MockAIProviderError(
            'Simulated error in mock AI provider',
            'SIMULATED_ERROR'
        );
    }
} 