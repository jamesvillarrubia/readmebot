import { z } from 'zod';

// Project configuration schema
export const ProjectConfigSchema = z.object({
    projectName: z.string(),
    projectPath: z.string(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

// Module information schema
export const ModuleInfoSchema = z.object({
    moduleName: z.string(),
    modulePath: z.string(),
});

export type ModuleInfo = z.infer<typeof ModuleInfoSchema>;

// File information schema
export const FileInfoSchema = z.object({
    fileName: z.string(),
    filePath: z.string(),
});

export type FileInfo = z.infer<typeof FileInfoSchema>;

// Function information schema
export const FunctionInfoSchema = z.object({
    functionName: z.string(),
    filePath: z.string(),
    functionBody: z.string(),
});

export type FunctionInfo = z.infer<typeof FunctionInfoSchema>;

// Documentation schemas
export const BusinessRuleSchema = z.object({
    rule: z.string(),
    description: z.string(),
    impact: z.string(),
});

export const StakeholderSchema = z.object({
    name: z.string(),
    role: z.string(),
    needs: z.string(),
});

export const BusinessProcessSchema = z.object({
    name: z.string(),
    purpose: z.string(),
    steps: z.array(z.string()),
    rules: z.array(BusinessRuleSchema),
});

export const ComplianceRequirementSchema = z.object({
    name: z.string(),
    description: z.string(),
    impact: z.string(),
});

export const BusinessMetricSchema = z.object({
    name: z.string(),
    description: z.string(),
    target: z.string(),
});

export const IntegrationPointSchema = z.object({
    name: z.string(),
    purpose: z.string(),
    impact: z.string(),
});

export const BusinessWorkflowSchema = z.object({
    name: z.string(),
    steps: z.array(z.string()),
    rules: z.array(BusinessRuleSchema),
});

export const PerformanceRequirementSchema = z.object({
    name: z.string(),
    description: z.string(),
    target: z.string(),
});

export const ErrorHandlingSchema = z.object({
    scenario: z.string(),
    impact: z.string(),
    resolution: z.string(),
});

export const BusinessContextSchema = z.object({
    name: z.string(),
    description: z.string(),
    constraints: z.array(z.string()),
});

// Project documentation schema
export const ProjectDocumentationSchema = z.object({
    businessPurpose: z.string(),
    stakeholders: z.array(StakeholderSchema),
    businessProcesses: z.array(BusinessProcessSchema),
    complianceRequirements: z.array(ComplianceRequirementSchema),
    businessMetrics: z.array(BusinessMetricSchema),
});

export type ProjectDocumentation = z.infer<typeof ProjectDocumentationSchema>;

// Module documentation schema
export const ModuleDocumentationSchema = z.object({
    businessDomain: z.string(),
    integrationPoints: z.array(IntegrationPointSchema),
    businessWorkflows: z.array(BusinessWorkflowSchema),
    businessRules: z.array(BusinessRuleSchema),
    performanceRequirements: z.array(PerformanceRequirementSchema),
});

export type ModuleDocumentation = z.infer<typeof ModuleDocumentationSchema>;

// File documentation schema
export const FileDocumentationSchema = z.object({
    businessPurpose: z.string(),
    businessRules: z.array(BusinessRuleSchema),
    integrationRequirements: z.array(IntegrationPointSchema),
    errorHandling: z.array(ErrorHandlingSchema),
    complianceRequirements: z.array(ComplianceRequirementSchema),
});

export type FileDocumentation = z.infer<typeof FileDocumentationSchema>;

// Function documentation schema
export const FunctionDocumentationSchema = z.object({
    businessPurpose: z.string(),
    businessRules: z.array(BusinessRuleSchema),
    inputContext: BusinessContextSchema,
    outputContext: BusinessContextSchema,
    errorScenarios: z.array(ErrorHandlingSchema),
    performanceRequirements: z.array(PerformanceRequirementSchema),
});

export type FunctionDocumentation = z.infer<typeof FunctionDocumentationSchema>;

/**
 * Interface for AI providers that generate documentation
 */
export interface AIProvider {
    /**
     * Generate project-level documentation
     * @param config Project configuration
     * @returns Project documentation
     */
    generateProjectDocs(config: ProjectConfig): Promise<ProjectDocumentation>;

    /**
     * Generate module-level documentation
     * @param module Module information
     * @returns Module documentation
     */
    generateModuleDocs(module: ModuleInfo): Promise<ModuleDocumentation>;

    /**
     * Generate file-level documentation
     * @param file File information
     * @returns File documentation
     */
    generateFileDocs(file: FileInfo): Promise<FileDocumentation>;

    /**
     * Generate function-level documentation
     * @param func Function information
     * @returns Function documentation
     */
    generateFunctionDocs(func: FunctionInfo): Promise<FunctionDocumentation>;

    /**
     * Stream documentation generation
     * @param prompt Documentation generation prompt
     * @returns Async iterator of documentation chunks
     */
    streamDocs(prompt: string): AsyncIterable<string>;
} 