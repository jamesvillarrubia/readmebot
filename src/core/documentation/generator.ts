/**
 * Interface for documentation generators
 * @module documentation/generator
 */

import type { Documentation, DocumentationConfig, ProjectStructure, BusinessContext } from './types.js';

/**
 * Interface for documentation generators
 */
export interface DocumentationGenerator {
    /**
     * Generate documentation for a project
     * @param project - The project structure
     * @param config - The documentation configuration
     * @returns The generated documentation
     */
    generateProjectDocs(project: ProjectStructure, config: DocumentationConfig): Promise<Documentation>;

    /**
     * Analyze the business context of a project
     * @param project - The project structure
     * @returns The analyzed business context
     */
    analyzeBusinessContext(project: ProjectStructure): Promise<BusinessContext>;

    /**
     * Validate the generated documentation
     * @param docs - The generated documentation
     * @returns Whether the documentation is valid
     */
    validateDocumentation(docs: Documentation): Promise<boolean>;

    /**
     * Get the available documentation templates
     * @returns The available templates
     */
    getAvailableTemplates(): Promise<Record<string, string>>;

    /**
     * Get the default configuration
     * @returns The default configuration
     */
    getDefaultConfig(): DocumentationConfig;
}

/**
 * Implementation of the documentation generator
 * @module documentation/generator
 */

/**
 * Default documentation generator implementation
 * @class DefaultDocumentationGenerator
 * @implements {DocumentationGenerator}
 */
export class DefaultDocumentationGenerator implements DocumentationGenerator {
    /**
     * Generate project-level documentation
     * @param project - Project structure to document
     * @param config - Documentation configuration
     * @returns Generated documentation
     */
    async generateProjectDocs(project: ProjectStructure, config: DocumentationConfig): Promise<Documentation> {
        const startTime = Date.now();
        let content = '';

        // Add project overview
        content += `# ${project.name}\n\n`;
        content += `${project.description}\n\n`;
        content += `Version: ${project.version}\n\n`;

        // Add business context if requested
        if (config.includeBusinessContext) {
            const businessContext = await this.analyzeBusinessContext(project);
            content += this.formatBusinessContext(businessContext);
        }

        // Add module documentation
        if (project.modules.length > 0) {
            content += '## Modules\n\n';
            for (const module of project.modules) {
                content += this.formatModule(module);
            }
        }

        // Add configuration documentation
        if (project.configFiles.length > 0) {
            content += '## Configuration\n\n';
            for (const configFile of project.configFiles) {
                content += this.formatConfigFile(configFile);
            }
        }

        // Add documentation files
        if (project.docsFiles.length > 0) {
            content += '## Documentation\n\n';
            for (const docFile of project.docsFiles) {
                content += this.formatDocFile(docFile);
            }
        }

        return {
            level: 'project',
            content,
            metadata: {
                timestamp: new Date().toISOString(),
                duration: Date.now() - startTime,
                config,
                errors: [],
                warnings: []
            }
        };
    }

    /**
     * Analyze business context of a project
     * @param project - Project structure to analyze
     * @returns Business context analysis
     */
    async analyzeBusinessContext(project: ProjectStructure): Promise<BusinessContext> {
        return {
            purpose: `${project.name} is a ${project.description}`,
            audience: project.modules.map(m => m.name),
            features: project.modules.map(m => m.description),
            requirements: [],
            constraints: [],
            integrations: project.configFiles.map(f => f.name),
            rules: []
        };
    }

    /**
     * Validate generated documentation
     * @param docs - Documentation to validate
     * @returns Whether the documentation is valid
     */
    async validateDocumentation(docs: Documentation): Promise<boolean> {
        // Basic validation
        if (!docs.content || docs.content.trim().length === 0) {
            return false;
        }

        // Check required sections
        const requiredSections = ['# ', '## Modules', '## Configuration', '## Documentation'];
        const content = docs.content.toLowerCase();
        return requiredSections.every(section => content.includes(section.toLowerCase()));
    }

    /**
     * Get available documentation templates
     * @returns Map of template names to template content
     */
    async getAvailableTemplates(): Promise<Record<string, string>> {
        // TODO: Load templates from filesystem
        return {
            'default': '# {{project.name}}\n\n{{project.description}}\n\nVersion: {{project.version}}',
            'minimal': '# {{project.name}}\n\n{{project.description}}',
            'detailed': '# {{project.name}}\n\n{{project.description}}\n\nVersion: {{project.version}}\n\n## Business Context\n\n## Modules\n\n## Configuration\n\n## Documentation'
        };
    }

    /**
     * Get default documentation configuration
     * @returns Default configuration
     */
    getDefaultConfig(): DocumentationConfig {
        return {
            level: 'project',
            includeBusinessContext: true,
            includeExamples: true,
            includeApiDocs: true,
            includeImplementationDetails: true,
            maxDepth: 3
        };
    }

    /**
     * Format business context for documentation
     * @param context - Business context to format
     * @returns Formatted business context
     */
    private formatBusinessContext(context: BusinessContext): string {
        let content = '## Business Context\n\n';

        if (context.purpose) {
            content += `### Purpose\n\n${context.purpose}\n\n`;
        }

        if (context.audience.length > 0) {
            content += '### Target Audience\n\n';
            content += context.audience.map(audience => `- ${audience}`).join('\n');
            content += '\n\n';
        }

        if (context.features.length > 0) {
            content += '### Key Features\n\n';
            content += context.features.map(feature => `- ${feature}`).join('\n');
            content += '\n\n';
        }

        if (context.requirements.length > 0) {
            content += '### Business Requirements\n\n';
            content += context.requirements.map(req => `- ${req}`).join('\n');
            content += '\n\n';
        }

        if (context.constraints.length > 0) {
            content += '### Technical Constraints\n\n';
            content += context.constraints.map(constraint => `- ${constraint}`).join('\n');
            content += '\n\n';
        }

        if (context.integrations.length > 0) {
            content += '### Integration Points\n\n';
            content += context.integrations.map(integration => `- ${integration}`).join('\n');
            content += '\n\n';
        }

        if (context.rules.length > 0) {
            content += '### Business Rules\n\n';
            content += context.rules.map(rule => `- ${rule}`).join('\n');
            content += '\n\n';
        }

        return content;
    }

    /**
     * Format module for documentation
     * @param module - Module to format
     * @returns Formatted module
     */
    private formatModule(module: ProjectStructure['modules'][0]): string {
        let content = `### ${module.name}\n\n`;
        if (module.description) {
            content += `${module.description}\n\n`;
        }

        if (module.files.length > 0) {
            content += '#### Files\n\n';
            content += module.files.map(file => `- ${file.name}`).join('\n');
            content += '\n\n';
        }

        if (module.dependencies.length > 0) {
            content += '#### Dependencies\n\n';
            content += module.dependencies.map(dep => `- ${dep}`).join('\n');
            content += '\n\n';
        }

        if (module.exports.length > 0) {
            content += '#### Exports\n\n';
            content += module.exports.map(exp => `- ${exp}`).join('\n');
            content += '\n\n';
        }

        return content;
    }

    /**
     * Format configuration file for documentation
     * @param configFile - Configuration file to format
     * @returns Formatted configuration file
     */
    private formatConfigFile(configFile: ProjectStructure['configFiles'][0]): string {
        let content = `### ${configFile.name}\n\n`;
        if (configFile.description) {
            content += `${configFile.description}\n\n`;
        }

        if (configFile.content) {
            content += '```\n';
            content += configFile.content;
            content += '\n```\n\n';
        }

        return content;
    }

    /**
     * Format documentation file for documentation
     * @param docFile - Documentation file to format
     * @returns Formatted documentation file
     */
    private formatDocFile(docFile: ProjectStructure['docsFiles'][0]): string {
        let content = `### ${docFile.name}\n\n`;
        if (docFile.description) {
            content += `${docFile.description}\n\n`;
        }

        if (docFile.content) {
            content += docFile.content;
            content += '\n\n';
        }

        return content;
    }
} 