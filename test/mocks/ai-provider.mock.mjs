/**
 * Mock AI provider for testing purposes
 */
export class MockAIProvider {
    async generateProjectDocs(config) {
        return {
            businessPurpose: `Mock business purpose for ${config.projectName}`,
            stakeholders: [
                {
                    name: 'Mock Stakeholder',
                    role: 'Product Owner',
                    needs: 'Business requirements and documentation',
                },
            ],
            businessProcesses: [
                {
                    name: 'Mock Process',
                    purpose: 'Testing documentation generation',
                    steps: ['Step 1', 'Step 2'],
                    rules: [
                        {
                            rule: 'Mock Rule',
                            description: 'Test rule description',
                            impact: 'Test impact',
                        },
                    ],
                },
            ],
            complianceRequirements: [
                {
                    name: 'Mock Compliance',
                    description: 'Test compliance requirement',
                    impact: 'Test impact',
                },
            ],
            businessMetrics: [
                {
                    name: 'Mock Metric',
                    description: 'Test business metric',
                    target: 'Test target',
                },
            ],
        };
    }

    async generateModuleDocs(module) {
        return {
            businessDomain: `Mock domain for ${module.moduleName}`,
            integrationPoints: [
                {
                    name: 'Mock Integration',
                    purpose: 'Test integration',
                    impact: 'Test impact',
                },
            ],
            businessWorkflows: [
                {
                    name: 'Mock Workflow',
                    steps: ['Step 1', 'Step 2'],
                    rules: [
                        {
                            rule: 'Mock Rule',
                            description: 'Test rule description',
                            impact: 'Test impact',
                        },
                    ],
                },
            ],
            businessRules: [
                {
                    rule: 'Mock Rule',
                    description: 'Test rule description',
                    impact: 'Test impact',
                },
            ],
            performanceRequirements: [
                {
                    name: 'Mock Requirement',
                    description: 'Test performance requirement',
                    target: 'Test target',
                },
            ],
        };
    }

    async generateFileDocs(file) {
        return {
            businessPurpose: `Mock purpose for ${file.fileName}`,
            businessRules: [
                {
                    rule: 'Mock Rule',
                    description: 'Test rule description',
                    impact: 'Test impact',
                },
            ],
            integrationRequirements: [
                {
                    name: 'Mock Integration',
                    purpose: 'Test integration',
                    impact: 'Test impact',
                },
            ],
            errorHandling: [
                {
                    scenario: 'Mock Error',
                    impact: 'Test impact',
                    resolution: 'Test resolution',
                },
            ],
            complianceRequirements: [
                {
                    name: 'Mock Compliance',
                    description: 'Test compliance requirement',
                    impact: 'Test impact',
                },
            ],
        };
    }

    async generateFunctionDocs(func) {
        return {
            businessPurpose: `Mock purpose for ${func.functionName}`,
            businessRules: [
                {
                    rule: 'Mock Rule',
                    description: 'Test rule description',
                    impact: 'Test impact',
                },
            ],
            inputContext: {
                name: 'Mock Input',
                description: 'Test input context',
                constraints: ['Constraint 1', 'Constraint 2'],
            },
            outputContext: {
                name: 'Mock Output',
                description: 'Test output context',
                constraints: ['Constraint 1', 'Constraint 2'],
            },
            errorScenarios: [
                {
                    scenario: 'Mock Error',
                    impact: 'Test impact',
                    resolution: 'Test resolution',
                },
            ],
            performanceRequirements: [
                {
                    name: 'Mock Requirement',
                    description: 'Test performance requirement',
                    target: 'Test target',
                },
            ],
        };
    }

    async *streamDocs(prompt) {
        const chunks = [
            'This is a mock documentation stream.\n',
            'It simulates streaming documentation generation.\n',
            'The prompt was: ',
            prompt,
            '\nEnd of stream.',
        ];

        for (const chunk of chunks) {
            yield chunk;
            // Simulate some delay between chunks
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
} 