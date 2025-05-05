import { AIProvider } from '../../core/ai/ai-provider.js';

/**
 * Mock implementation of AIProvider for testing
 */
export class MockAIProvider implements AIProvider {
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
            businessPurpose: `Mock business purpose for ${config.projectName}`,
            stakeholders: ['Mock Stakeholder 1', 'Mock Stakeholder 2'],
            businessProcesses: ['Mock Process 1', 'Mock Process 2'],
            complianceRequirements: ['Mock Requirement 1', 'Mock Requirement 2'],
            businessMetrics: ['Mock Metric 1', 'Mock Metric 2'],
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
            businessDomain: `Mock business domain for ${moduleInfo.moduleName}`,
            integrationPoints: ['Mock Integration 1', 'Mock Integration 2'],
            businessWorkflows: ['Mock Workflow 1', 'Mock Workflow 2'],
            businessRules: ['Mock Rule 1', 'Mock Rule 2'],
            performanceRequirements: ['Mock Performance 1', 'Mock Performance 2'],
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
            businessPurpose: `Mock business purpose for ${fileInfo.fileName}`,
            businessRules: ['Mock Rule 1', 'Mock Rule 2'],
            integrationRequirements: ['Mock Integration 1', 'Mock Integration 2'],
            errorHandling: ['Mock Error 1', 'Mock Error 2'],
            complianceRequirements: ['Mock Compliance 1', 'Mock Compliance 2'],
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
            businessPurpose: `Mock business purpose for ${functionInfo.functionName}`,
            businessRules: ['Mock Rule 1', 'Mock Rule 2'],
            inputContext: 'Mock input context',
            outputContext: 'Mock output context',
            errorScenarios: ['Mock Error 1', 'Mock Error 2'],
            performanceRequirements: ['Mock Performance 1', 'Mock Performance 2'],
        };
    }

    /**
     * Streams documentation generation
     */
    async *streamDocs(prompt: string): AsyncGenerator<string, void, unknown> {
        const mockChunks = [
            'Mock documentation ',
            'for ',
            prompt,
            '...',
        ];

        for (const chunk of mockChunks) {
            yield chunk;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
} 