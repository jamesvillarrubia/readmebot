/**
 * Tests for the documentation generator interface
 * @module documentation/generator.test
 */

import { describe, it, expect } from 'vitest';
import type { DocumentationGenerator, Documentation, DocumentationConfig, ProjectStructure, BusinessContext } from '../../../src/core/documentation/types.js';

describe('DocumentationGenerator', () => {
    it('should have required methods', () => {
        const generator: DocumentationGenerator = {
            generateProjectDocs: async (project: ProjectStructure, config: DocumentationConfig): Promise<Documentation> => {
                return {
                    level: 'project',
                    content: '',
                    metadata: {
                        timestamp: new Date().toISOString(),
                        duration: 0,
                        config,
                        errors: [],
                        warnings: []
                    }
                };
            },
            analyzeBusinessContext: async (project: ProjectStructure): Promise<BusinessContext> => {
                return {
                    purpose: '',
                    audience: [],
                    features: [],
                    requirements: [],
                    constraints: [],
                    integrations: [],
                    rules: []
                };
            },
            validateDocumentation: async (docs: Documentation): Promise<boolean> => {
                return true;
            },
            getAvailableTemplates: async (): Promise<Record<string, string>> => {
                return {};
            },
            getDefaultConfig: (): DocumentationConfig => {
                return {
                    level: 'project',
                    includeBusinessContext: true,
                    includeExamples: true,
                    includeApiDocs: true,
                    includeImplementationDetails: true,
                    maxDepth: 3
                };
            }
        };

        expect(generator).toBeDefined();
        expect(generator.generateProjectDocs).toBeDefined();
        expect(generator.analyzeBusinessContext).toBeDefined();
        expect(generator.validateDocumentation).toBeDefined();
        expect(generator.getAvailableTemplates).toBeDefined();
        expect(generator.getDefaultConfig).toBeDefined();
    });

    it('should generate project documentation', async () => {
        const generator: DocumentationGenerator = {
            generateProjectDocs: async (project: ProjectStructure, config: DocumentationConfig): Promise<Documentation> => {
                return {
                    level: 'project',
                    content: 'Project documentation',
                    metadata: {
                        timestamp: new Date().toISOString(),
                        duration: 0,
                        config,
                        errors: [],
                        warnings: []
                    }
                };
            },
            analyzeBusinessContext: async (project: ProjectStructure): Promise<BusinessContext> => {
                return {
                    purpose: '',
                    audience: [],
                    features: [],
                    requirements: [],
                    constraints: [],
                    integrations: [],
                    rules: []
                };
            },
            validateDocumentation: async (docs: Documentation): Promise<boolean> => {
                return true;
            },
            getAvailableTemplates: async (): Promise<Record<string, string>> => {
                return {};
            },
            getDefaultConfig: (): DocumentationConfig => {
                return {
                    level: 'project',
                    includeBusinessContext: true,
                    includeExamples: true,
                    includeApiDocs: true,
                    includeImplementationDetails: true,
                    maxDepth: 3
                };
            }
        };

        const project: ProjectStructure = {
            name: 'Test Project',
            description: 'A test project',
            version: '1.0.0',
            dependencies: {},
            modules: [],
            configFiles: [],
            docsFiles: []
        };

        const config: DocumentationConfig = {
            level: 'project',
            includeBusinessContext: true,
            includeExamples: true,
            includeApiDocs: true,
            includeImplementationDetails: true,
            maxDepth: 3
        };

        const docs = await generator.generateProjectDocs(project, config);
        expect(docs).toBeDefined();
        expect(docs.level).toBe('project');
        expect(docs.content).toBe('Project documentation');
        expect(docs.metadata.config).toEqual(config);
    });

    it('should analyze business context', async () => {
        const generator: DocumentationGenerator = {
            generateProjectDocs: async (project: ProjectStructure, config: DocumentationConfig): Promise<Documentation> => {
                return {
                    level: 'project',
                    content: '',
                    metadata: {
                        timestamp: new Date().toISOString(),
                        duration: 0,
                        config,
                        errors: [],
                        warnings: []
                    }
                };
            },
            analyzeBusinessContext: async (project: ProjectStructure): Promise<BusinessContext> => {
                return {
                    purpose: 'Test purpose',
                    audience: ['Developers'],
                    features: ['Feature 1', 'Feature 2'],
                    requirements: ['Requirement 1', 'Requirement 2'],
                    constraints: ['Constraint 1', 'Constraint 2'],
                    integrations: ['Integration 1', 'Integration 2'],
                    rules: ['Rule 1', 'Rule 2']
                };
            },
            validateDocumentation: async (docs: Documentation): Promise<boolean> => {
                return true;
            },
            getAvailableTemplates: async (): Promise<Record<string, string>> => {
                return {};
            },
            getDefaultConfig: (): DocumentationConfig => {
                return {
                    level: 'project',
                    includeBusinessContext: true,
                    includeExamples: true,
                    includeApiDocs: true,
                    includeImplementationDetails: true,
                    maxDepth: 3
                };
            }
        };

        const project: ProjectStructure = {
            name: 'Test Project',
            description: 'A test project',
            version: '1.0.0',
            dependencies: {},
            modules: [],
            configFiles: [],
            docsFiles: []
        };

        const context = await generator.analyzeBusinessContext(project);
        expect(context).toBeDefined();
        expect(context.purpose).toBe('Test purpose');
        expect(context.audience).toEqual(['Developers']);
        expect(context.features).toEqual(['Feature 1', 'Feature 2']);
        expect(context.requirements).toEqual(['Requirement 1', 'Requirement 2']);
        expect(context.constraints).toEqual(['Constraint 1', 'Constraint 2']);
        expect(context.integrations).toEqual(['Integration 1', 'Integration 2']);
        expect(context.rules).toEqual(['Rule 1', 'Rule 2']);
    });

    it('should validate documentation', async () => {
        const generator: DocumentationGenerator = {
            generateProjectDocs: async (project: ProjectStructure, config: DocumentationConfig): Promise<Documentation> => {
                return {
                    level: 'project',
                    content: '',
                    metadata: {
                        timestamp: new Date().toISOString(),
                        duration: 0,
                        config,
                        errors: [],
                        warnings: []
                    }
                };
            },
            analyzeBusinessContext: async (project: ProjectStructure): Promise<BusinessContext> => {
                return {
                    purpose: '',
                    audience: [],
                    features: [],
                    requirements: [],
                    constraints: [],
                    integrations: [],
                    rules: []
                };
            },
            validateDocumentation: async (docs: Documentation): Promise<boolean> => {
                return docs.content.length > 0;
            },
            getAvailableTemplates: async (): Promise<Record<string, string>> => {
                return {};
            },
            getDefaultConfig: (): DocumentationConfig => {
                return {
                    level: 'project',
                    includeBusinessContext: true,
                    includeExamples: true,
                    includeApiDocs: true,
                    includeImplementationDetails: true,
                    maxDepth: 3
                };
            }
        };

        const docs: Documentation = {
            level: 'project',
            content: 'Valid documentation',
            metadata: {
                timestamp: new Date().toISOString(),
                duration: 0,
                config: {
                    level: 'project',
                    includeBusinessContext: true,
                    includeExamples: true,
                    includeApiDocs: true,
                    includeImplementationDetails: true,
                    maxDepth: 3
                },
                errors: [],
                warnings: []
            }
        };

        const isValid = await generator.validateDocumentation(docs);
        expect(isValid).toBe(true);
    });
}); 