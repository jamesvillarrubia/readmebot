import { z } from 'zod';

/**
 * Module configuration for documentation generation
 */
export const ModuleConfigSchema = z.object({
    moduleName: z.string(),
    modulePath: z.string(),
    projectPath: z.string()
});

export type ModuleConfig = z.infer<typeof ModuleConfigSchema>;

/**
 * Module dependency documentation
 */
export const ModuleDependencySchema = z.object({
    name: z.string(),
    type: z.enum(['internal', 'external']),
    purpose: z.string(),
    usageLocations: z.array(z.string())
});

export type ModuleDependency = z.infer<typeof ModuleDependencySchema>;

/**
 * Module API documentation
 */
export const ModuleAPISchema = z.object({
    exports: z.array(z.object({
        name: z.string(),
        type: z.enum(['function', 'class', 'interface', 'type', 'constant', 'variable']),
        description: z.string(),
        usage: z.string()
    })),
    imports: z.array(z.object({
        name: z.string(),
        source: z.string(),
        purpose: z.string()
    }))
});

export type ModuleAPI = z.infer<typeof ModuleAPISchema>;

/**
 * Module architecture documentation
 */
export const ModuleArchitectureSchema = z.object({
    components: z.array(z.object({
        name: z.string(),
        purpose: z.string(),
        dependencies: z.array(z.string())
    })),
    patterns: z.array(z.object({
        name: z.string(),
        purpose: z.string(),
        implementation: z.string()
    })),
    dataFlow: z.array(z.object({
        source: z.string(),
        target: z.string(),
        description: z.string()
    }))
});

export type ModuleArchitecture = z.infer<typeof ModuleArchitectureSchema>;

/**
 * Module business context documentation
 */
export const ModuleBusinessContextSchema = z.object({
    domain: z.string(),
    purpose: z.string(),
    stakeholders: z.array(z.string()),
    requirements: z.array(z.object({
        type: z.enum(['functional', 'non-functional', 'business', 'technical']),
        description: z.string(),
        priority: z.enum(['low', 'medium', 'high'])
    })),
    constraints: z.array(z.string())
});

export type ModuleBusinessContext = z.infer<typeof ModuleBusinessContextSchema>;

/**
 * Complete module documentation
 */
export const ModuleDocumentationSchema = z.object({
    businessContext: ModuleBusinessContextSchema,
    architecture: ModuleArchitectureSchema,
    api: ModuleAPISchema,
    dependencies: z.array(ModuleDependencySchema)
});

export type ModuleDocumentation = z.infer<typeof ModuleDocumentationSchema>;

/**
 * Interface for module-level documentation generator
 */
export interface ModuleGenerator {
    /**
     * Generate module-level documentation
     */
    generateDocumentation(config: ModuleConfig): Promise<ModuleDocumentation>;
} 