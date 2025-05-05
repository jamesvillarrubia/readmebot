import { z } from 'zod';
import { ModuleDocumentation, ModuleDocumentationSchema } from '../ai/ai-provider.js';
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

        // Business domain validation
        if (!docs.businessDomain) {
            errors.push('Business domain must be specified');
        }

        // Integration points validation
        if (docs.integrationPoints.length === 0) {
            warnings.push('No integration points defined');
        }

        // Business workflows validation
        if (docs.businessWorkflows.length === 0) {
            warnings.push('No business workflows defined');
        }

        // Business rules validation
        if (docs.businessRules.length === 0) {
            warnings.push('No business rules defined');
        }

        // Performance requirements validation
        if (docs.performanceRequirements.length === 0) {
            warnings.push('No performance requirements defined');
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
        if (!docs.businessDomain) {
            errors.push('Missing business domain');
        }
        if (!docs.integrationPoints) {
            errors.push('Missing integration points section');
        }
        if (!docs.businessWorkflows) {
            errors.push('Missing business workflows section');
        }
        if (!docs.businessRules) {
            errors.push('Missing business rules section');
        }
        if (!docs.performanceRequirements) {
            errors.push('Missing performance requirements section');
        }

        // Check for empty sections
        if (docs.integrationPoints.length === 0) {
            warnings.push('Integration points section is empty');
        }
        if (docs.businessWorkflows.length === 0) {
            warnings.push('Business workflows section is empty');
        }
        if (docs.businessRules.length === 0) {
            warnings.push('Business rules section is empty');
        }
        if (docs.performanceRequirements.length === 0) {
            warnings.push('Performance requirements section is empty');
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