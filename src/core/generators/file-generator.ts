import { z } from 'zod';

/**
 * File configuration for documentation generation
 */
export const FileConfigSchema = z.object({
    fileName: z.string(),
    filePath: z.string(),
    projectPath: z.string()
});

export type FileConfig = z.infer<typeof FileConfigSchema>;

/**
 * File code block documentation
 */
export const CodeBlockSchema = z.object({
    name: z.string(),
    type: z.enum(['function', 'class', 'interface', 'type', 'constant', 'variable']),
    description: z.string(),
    usage: z.string(),
    parameters: z.array(z.object({
        name: z.string(),
        type: z.string(),
        description: z.string()
    })).optional(),
    returns: z.object({
        type: z.string(),
        description: z.string()
    }).optional(),
    throws: z.array(z.object({
        type: z.string(),
        description: z.string()
    })).optional()
});

export type CodeBlock = z.infer<typeof CodeBlockSchema>;

/**
 * File dependencies documentation
 */
export const FileDependencySchema = z.object({
    name: z.string(),
    type: z.enum(['internal', 'external']),
    purpose: z.string(),
    usageLocations: z.array(z.string())
});

export type FileDependency = z.infer<typeof FileDependencySchema>;

/**
 * File business context documentation
 */
export const FileBusinessContextSchema = z.object({
    purpose: z.string(),
    domain: z.string(),
    stakeholders: z.array(z.string()),
    requirements: z.array(z.object({
        type: z.enum(['functional', 'non-functional', 'business', 'technical']),
        description: z.string(),
        priority: z.enum(['low', 'medium', 'high'])
    })),
    constraints: z.array(z.string())
});

export type FileBusinessContext = z.infer<typeof FileBusinessContextSchema>;

/**
 * File error handling documentation
 */
export const FileErrorHandlingSchema = z.object({
    scenario: z.string(),
    impact: z.string(),
    resolution: z.string()
});

export type FileErrorHandling = z.infer<typeof FileErrorHandlingSchema>;

/**
 * Complete file documentation
 */
export const FileDocumentationSchema = z.object({
    businessContext: FileBusinessContextSchema,
    codeBlocks: z.array(CodeBlockSchema),
    dependencies: z.array(FileDependencySchema),
    errorHandling: z.array(FileErrorHandlingSchema)
});

export type FileDocumentation = z.infer<typeof FileDocumentationSchema>;

/**
 * Interface for file-level documentation generator
 */
export interface FileGenerator {
    /**
     * Generate file-level documentation
     */
    generateDocumentation(config: FileConfig): Promise<FileDocumentation>;
} 