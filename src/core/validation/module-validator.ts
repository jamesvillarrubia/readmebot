import { z } from 'zod';
import { ModuleDocumentation, ModuleDocumentationSchema } from '../generators/module-generator.js';
import { AIProvider } from '../ai/ai-provider.js';

/**
 * Validation results for module documentation
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Validator for module-level documentation
 */
export class ModuleValidator {
    constructor(private aiProvider: AIProvider) { }

    /**
     * Validate module documentation against schema and business rules
     */
    async validateDocumentation(docs: ModuleDocumentation): Promise<ValidationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Schema validation
        try {
            ModuleDocumentationSchema.parse(docs);
        } catch (error) {
            if (error instanceof z.ZodError) {
                errors.push(...error.errors.map(e => `${e.path.join('.')}: ${e.message}`));
            } else {
                errors.push('Unknown validation error');
            }
        }

        // Business context validation
        if (!docs.businessContext.domain) {
            errors.push('Business context must include domain');
        }
        if (!docs.businessContext.purpose) {
            errors.push('Business context must include purpose');
        }
        if (docs.businessContext.stakeholders.length === 0) {
            warnings.push('No stakeholders defined in business context');
        }

        // Architecture validation
        if (docs.architecture.components.length === 0) {
            warnings.push('No components defined in architecture');
        }
        if (docs.architecture.patterns.length === 0) {
            warnings.push('No patterns detected in architecture');
        }

        // API validation
        if (docs.api.exports.length === 0) {
            warnings.push('No exports defined in API');
        }

        // Dependency validation
        const externalDeps = docs.dependencies.filter(d => d.type === 'external');
        if (externalDeps.length === 0) {
            warnings.push('No external dependencies detected');
        }

        // AI-assisted validation
        const aiValidation = await this.aiProvider.validateModuleDocs(docs);
        if (aiValidation.errors.length > 0) {
            errors.push(...aiValidation.errors);
        }
        if (aiValidation.warnings.length > 0) {
            warnings.push(...aiValidation.warnings);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Verify documentation completeness
     */
    async verifyCompleteness(docs: ModuleDocumentation): Promise<ValidationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check for missing sections
        if (!docs.businessContext) {
            errors.push('Missing business context section');
        }
        if (!docs.architecture) {
            errors.push('Missing architecture section');
        }
        if (!docs.api) {
            errors.push('Missing API section');
        }
        if (!docs.dependencies) {
            errors.push('Missing dependencies section');
        }

        // Check for empty sections
        if (docs.businessContext && Object.keys(docs.businessContext).length === 0) {
            warnings.push('Business context section is empty');
        }
        if (docs.architecture && Object.keys(docs.architecture).length === 0) {
            warnings.push('Architecture section is empty');
        }
        if (docs.api && Object.keys(docs.api).length === 0) {
            warnings.push('API section is empty');
        }
        if (docs.dependencies && docs.dependencies.length === 0) {
            warnings.push('Dependencies section is empty');
        }

        // AI-assisted completeness check
        const aiCompleteness = await this.aiProvider.verifyModuleDocsCompleteness(docs);
        if (aiCompleteness.errors.length > 0) {
            errors.push(...aiCompleteness.errors);
        }
        if (aiCompleteness.warnings.length > 0) {
            warnings.push(...aiCompleteness.warnings);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
} 