/**
 * Tests for the default documentation generator implementation
 * @module documentation/default-generator.test
 */

import { describe, it, expect } from 'vitest';
import { DefaultDocumentationGenerator } from '../../../src/core/documentation/generator.js';
import type { ProjectStructure, DocumentationConfig, DocumentationLevel } from '../../../src/core/documentation/types.js';

describe('DefaultDocumentationGenerator', () => {
    const generator = new DefaultDocumentationGenerator();

    it('should generate project documentation', async () => {
        const project: ProjectStructure = {
            name: 'Test Project',
            description: 'A test project',
            version: '1.0.0',
            dependencies: {
                'test-dep': '^1.0.0'
            },
            modules: [
                {
                    name: 'test-module',
                    description: 'A test module',
                    files: [
                        {
                            path: 'src/test.ts',
                            name: 'test.ts',
                            type: 'ts',
                            size: 100,
                            content: 'export function test() {}',
                            functions: [],
                            classes: [],
                            imports: [],
                            exports: []
                        }
                    ],
                    dependencies: ['test-dep'],
                    exports: ['test']
                }
            ],
            configFiles: [
                {
                    name: 'tsconfig.json',
                    description: 'TypeScript configuration',
                    content: '{"compilerOptions": {}}'
                }
            ],
            docsFiles: [
                {
                    name: 'README.md',
                    description: 'Project documentation',
                    content: '# Test Project'
                }
            ]
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
        expect(docs.content).toContain('# Test Project');
        expect(docs.content).toContain('## Modules');
        expect(docs.content).toContain('## Configuration');
        expect(docs.content).toContain('## Documentation');
        expect(docs.metadata.config).toEqual(config);
    });

    it('should validate documentation', async () => {
        const validDocs = {
            level: 'project' as DocumentationLevel,
            content: '# Test Project\n\n## Modules\n\n## Configuration\n\n## Documentation',
            metadata: {
                timestamp: new Date().toISOString(),
                duration: 0,
                config: {
                    level: 'project' as DocumentationLevel,
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

        const invalidDocs = {
            level: 'project' as DocumentationLevel,
            content: '',
            metadata: {
                timestamp: new Date().toISOString(),
                duration: 0,
                config: {
                    level: 'project' as DocumentationLevel,
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

        expect(await generator.validateDocumentation(validDocs)).toBe(true);
        expect(await generator.validateDocumentation(invalidDocs)).toBe(false);
    });

    it('should get available templates', async () => {
        const templates = await generator.getAvailableTemplates();
        expect(templates).toBeDefined();
        expect(templates.default).toBeDefined();
        expect(templates.minimal).toBeDefined();
        expect(templates.detailed).toBeDefined();
    });

    it('should get default configuration', () => {
        const config = generator.getDefaultConfig();
        expect(config).toBeDefined();
        expect(config.level).toBe('project');
        expect(config.includeBusinessContext).toBe(true);
        expect(config.includeExamples).toBe(true);
        expect(config.includeApiDocs).toBe(true);
        expect(config.includeImplementationDetails).toBe(true);
        expect(config.maxDepth).toBe(3);
    });
}); 