/**
 * Function-level documentation generator types and interfaces
 * @module generators/function-generator
 */

import { z } from 'zod';

/**
 * Function configuration schema
 */
export const FunctionConfigSchema = z.object({
    /** Function name */
    functionName: z.string(),
    /** File path containing the function */
    filePath: z.string(),
    /** Function source code */
    functionBody: z.string(),
    /** Optional parent module name */
    moduleName: z.string().optional(),
    /** Optional parent file name */
    fileName: z.string().optional()
});

export type FunctionConfig = z.infer<typeof FunctionConfigSchema>;

/**
 * Function parameter documentation schema
 */
export const FunctionParameterSchema = z.object({
    /** Parameter name */
    name: z.string(),
    /** Parameter type */
    type: z.string(),
    /** Parameter description */
    description: z.string(),
    /** Whether parameter is optional */
    isOptional: z.boolean(),
    /** Default value if any */
    defaultValue: z.string().optional()
});

export type FunctionParameter = z.infer<typeof FunctionParameterSchema>;

/**
 * Function return type documentation schema
 */
export const FunctionReturnSchema = z.object({
    /** Return type */
    type: z.string(),
    /** Return value description */
    description: z.string()
});

export type FunctionReturn = z.infer<typeof FunctionReturnSchema>;

/**
 * Function error documentation schema
 */
export const FunctionErrorSchema = z.object({
    /** Error type/name */
    type: z.string(),
    /** Error description */
    description: z.string(),
    /** Error handling strategy */
    handling: z.string()
});

export type FunctionError = z.infer<typeof FunctionErrorSchema>;

/**
 * Function business context schema
 */
export const FunctionBusinessContextSchema = z.object({
    /** Business purpose of the function */
    purpose: z.string(),
    /** Business rules implemented by the function */
    rules: z.array(z.string()),
    /** Input business context */
    inputContext: z.string(),
    /** Output business context */
    outputContext: z.string(),
    /** Performance requirements */
    performanceRequirements: z.array(z.string())
});

export type FunctionBusinessContext = z.infer<typeof FunctionBusinessContextSchema>;

/**
 * Function dependency schema
 */
export const FunctionDependencySchema = z.object({
    /** Dependency name */
    name: z.string(),
    /** Dependency type (import, external call, etc) */
    type: z.string(),
    /** Dependency purpose */
    purpose: z.string()
});

export type FunctionDependency = z.infer<typeof FunctionDependencySchema>;

/**
 * Function documentation schema
 */
export const FunctionDocumentationSchema = z.object({
    /** Function name */
    name: z.string(),
    /** Function description */
    description: z.string(),
    /** Function parameters */
    parameters: z.array(FunctionParameterSchema),
    /** Function return type */
    returns: FunctionReturnSchema,
    /** Function errors */
    errors: z.array(FunctionErrorSchema),
    /** Function business context */
    businessContext: FunctionBusinessContextSchema,
    /** Function dependencies */
    dependencies: z.array(FunctionDependencySchema),
    /** Code examples */
    examples: z.array(z.string()),
    /** Test cases */
    testCases: z.array(z.string())
});

export type FunctionDocumentation = z.infer<typeof FunctionDocumentationSchema>;

/**
 * Interface for function-level documentation generator
 */
export interface FunctionGenerator {
    /**
     * Generate function-level documentation
     * @param config - Function configuration
     * @returns Generated documentation
     */
    generateDocumentation(config: FunctionConfig): Promise<FunctionDocumentation>;
} 