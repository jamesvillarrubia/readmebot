/**
 * Interface for project-level documentation generator
 */
export interface ProjectGenerator {
    /**
     * Generate project-level documentation
     */
    generateDocumentation(config: {
        projectName: string;
        projectPath: string;
    }): Promise<{
        businessContext: {
            purpose: string;
            stakeholders: string[];
            processes: string[];
            compliance: string[];
            metrics: string[];
        };
        technicalContext: {
            architecture: {
                components: Array<{
                    name: string;
                    purpose: string;
                    dependencies: string[];
                }>;
                dataFlow: Array<{
                    source: string;
                    target: string;
                    description: string;
                }>;
                interfaces: Array<{
                    name: string;
                    purpose: string;
                    methods: string[];
                }>;
                patterns: Array<{
                    name: string;
                    purpose: string;
                    implementation: string;
                }>;
            };
            dependencies: Array<{
                name: string;
                version: string;
                purpose: string;
            }>;
            buildSteps: string[];
            deploymentSteps: string[];
            testingStrategy: string;
        };
    }>;
} 