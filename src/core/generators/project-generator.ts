import { z } from 'zod';

/**
 * Project configuration for documentation generation
 */
export const ProjectConfigSchema = z.object({
    projectName: z.string(),
    projectPath: z.string()
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

/**
 * Technical architecture documentation
 */
export const ArchitectureSchema = z.object({
    components: z.array(z.object({
        name: z.string(),
        purpose: z.string(),
        dependencies: z.array(z.string())
    })),
    dataFlow: z.array(z.object({
        source: z.string(),
        target: z.string(),
        description: z.string()
    })),
    interfaces: z.array(z.object({
        name: z.string(),
        purpose: z.string(),
        methods: z.array(z.string())
    })),
    patterns: z.array(z.object({
        name: z.string(),
        purpose: z.string(),
        implementation: z.string()
    }))
});

export type Architecture = z.infer<typeof ArchitectureSchema>;

/**
 * Project dependency documentation
 */
export const DependencySchema = z.object({
    name: z.string(),
    version: z.string(),
    purpose: z.string()
});

export type Dependency = z.infer<typeof DependencySchema>;

/**
 * Technical context documentation
 */
export const TechnicalContextSchema = z.object({
    architecture: ArchitectureSchema,
    dependencies: z.array(DependencySchema),
    buildSteps: z.array(z.string()),
    deploymentSteps: z.array(z.string()),
    testingStrategy: z.string()
});

export type TechnicalContext = z.infer<typeof TechnicalContextSchema>;

/**
 * Business context documentation
 */
export const BusinessContextSchema = z.object({
    purpose: z.string(),
    stakeholders: z.array(z.string()),
    processes: z.array(z.string()),
    compliance: z.array(z.string()),
    metrics: z.array(z.string())
});

export type BusinessContext = z.infer<typeof BusinessContextSchema>;

/**
 * Complete project documentation
 */
export const ProjectDocumentationSchema = z.object({
    businessContext: BusinessContextSchema,
    technicalContext: TechnicalContextSchema
});

export type ProjectDocumentation = z.infer<typeof ProjectDocumentationSchema>;

/**
 * Interface for project-level documentation generator
 */
export interface ProjectGenerator {
    /**
     * Generate project-level documentation
     */
    generateDocumentation(config: ProjectConfig): Promise<ProjectDocumentation>;
} 