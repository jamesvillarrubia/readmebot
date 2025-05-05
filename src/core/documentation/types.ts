/**
 * Core types and interfaces for documentation generation
 * @module documentation/types
 */

/**
 * Represents the level of documentation to generate
 */
export type DocumentationLevel = 'project' | 'module' | 'file' | 'function';

/**
 * Configuration options for documentation generation
 */
export type DocumentationConfig = {
    /** The level of documentation to generate */
    level: DocumentationLevel;
    /** Whether to include business context analysis */
    includeBusinessContext: boolean;
    /** Whether to include code examples */
    includeExamples: boolean;
    /** Whether to include API documentation */
    includeApiDocs: boolean;
    /** Whether to include implementation details */
    includeImplementationDetails: boolean;
    /** Maximum depth for recursive documentation */
    maxDepth: number;
    /** Custom templates to use */
    templates?: {
        project?: string;
        module?: string;
        file?: string;
        function?: string;
    };
};

/**
 * Represents a project's structure and metadata
 * @interface ProjectStructure
 */
export interface ProjectStructure {
    /** Project name */
    name: string;
    /** Project description */
    description: string;
    /** Project version */
    version: string;
    /** Project dependencies */
    dependencies: Record<string, string>;
    /** Project modules */
    modules: ModuleStructure[];
    /** Project configuration files */
    configFiles: ConfigFileStructure[];
    /** Project documentation files */
    docsFiles: DocFileStructure[];
}

/**
 * Represents a configuration file's structure and metadata
 * @interface ConfigFileStructure
 */
export interface ConfigFileStructure {
    /** File name */
    name: string;
    /** File description */
    description?: string;
    /** File content */
    content?: string;
}

/**
 * Represents a documentation file's structure and metadata
 * @interface DocFileStructure
 */
export interface DocFileStructure {
    /** File name */
    name: string;
    /** File description */
    description?: string;
    /** File content */
    content?: string;
}

/**
 * Represents a module's structure and metadata
 */
export type ModuleStructure = {
    /** Module name */
    name: string;
    /** Module description */
    description: string;
    /** Module files */
    files: FileStructure[];
    /** Module dependencies */
    dependencies: string[];
    /** Module exports */
    exports: string[];
};

/**
 * Represents a file's structure and metadata
 */
export interface FileStructure {
    /** File path */
    path: string;
    /** File name */
    name: string;
    /** File type */
    type: string;
    /** File size in bytes */
    size: number;
    /** File content */
    content: string;
    /** Functions in the file */
    functions: string[];
    /** Classes in the file */
    classes: string[];
    /** Import statements */
    imports: string[];
    /** Export statements */
    exports: string[];
}

/**
 * Represents a function's structure and metadata
 */
export type FunctionStructure = {
    /** Function name */
    name: string;
    /** Function description */
    description: string;
    /** Function parameters */
    parameters: ParameterStructure[];
    /** Function return type */
    returnType: string;
    /** Function visibility */
    visibility: 'public' | 'private' | 'protected';
    /** Function is async */
    isAsync: boolean;
    /** Function is generator */
    isGenerator: boolean;
    /** Function source code */
    source: string;
};

/**
 * Represents a class's structure and metadata
 */
export type ClassStructure = {
    /** Class name */
    name: string;
    /** Class description */
    description: string;
    /** Class properties */
    properties: PropertyStructure[];
    /** Class methods */
    methods: FunctionStructure[];
    /** Class extends */
    extends?: string;
    /** Class implements */
    implements: string[];
    /** Class visibility */
    visibility: 'public' | 'private' | 'protected';
};

/**
 * Represents a parameter's structure and metadata
 */
export type ParameterStructure = {
    /** Parameter name */
    name: string;
    /** Parameter type */
    type: string;
    /** Parameter description */
    description: string;
    /** Parameter is optional */
    isOptional: boolean;
    /** Parameter default value */
    defaultValue?: string;
};

/**
 * Represents a property's structure and metadata
 */
export type PropertyStructure = {
    /** Property name */
    name: string;
    /** Property type */
    type: string;
    /** Property description */
    description: string;
    /** Property is optional */
    isOptional: boolean;
    /** Property default value */
    defaultValue?: string;
    /** Property visibility */
    visibility: 'public' | 'private' | 'protected';
    /** Property is static */
    isStatic: boolean;
    /** Property is readonly */
    isReadonly: boolean;
};

/**
 * Represents the business context of a project
 */
export type BusinessContext = {
    /** Project purpose */
    purpose: string;
    /** Target audience */
    audience: string[];
    /** Key features */
    features: string[];
    /** Business requirements */
    requirements: string[];
    /** Technical constraints */
    constraints: string[];
    /** Integration points */
    integrations: string[];
    /** Business rules */
    rules: string[];
};

/**
 * Represents the generated documentation
 */
export type Documentation = {
    /** Documentation level */
    level: DocumentationLevel;
    /** Documentation content */
    content: string;
    /** Documentation metadata */
    metadata: {
        /** Generation timestamp */
        timestamp: string;
        /** Generation duration */
        duration: number;
        /** Generation configuration */
        config: DocumentationConfig;
        /** Generation errors */
        errors: string[];
        /** Generation warnings */
        warnings: string[];
    };
};

/**
 * Interface for documentation generators
 * @interface DocumentationGenerator
 */
export interface DocumentationGenerator {
    /**
     * Generate project-level documentation
     * @param project - Project structure to document
     * @param config - Documentation configuration
     * @returns Generated documentation
     */
    generateProjectDocs(project: ProjectStructure, config: DocumentationConfig): Promise<Documentation>;

    /**
     * Analyze business context of a project
     * @param project - Project structure to analyze
     * @returns Business context analysis
     */
    analyzeBusinessContext(project: ProjectStructure): Promise<BusinessContext>;

    /**
     * Validate generated documentation
     * @param docs - Documentation to validate
     * @returns Whether the documentation is valid
     */
    validateDocumentation(docs: Documentation): Promise<boolean>;

    /**
     * Get available documentation templates
     * @returns Map of template names to template content
     */
    getAvailableTemplates(): Promise<Record<string, string>>;

    /**
     * Get default documentation configuration
     * @returns Default configuration
     */
    getDefaultConfig(): DocumentationConfig;
} 