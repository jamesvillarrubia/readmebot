/**
 * Integration tests for documentation generation
 * @module documentation/generate-docs.test
 */

import { describe, it, expect } from 'vitest';
import { DefaultDocumentationGenerator } from '../../../src/core/documentation/generator.js';
import { sampleProject } from '../../fixtures/documentation/project.js';
import type { DocumentationConfig } from '../../../src/core/documentation/types.js';

describe('Documentation Generation', () => {
    const generator = new DefaultDocumentationGenerator();

    it('should generate project documentation with default config', async () => {
        const config: DocumentationConfig = generator.getDefaultConfig();
        const docs = await generator.generateProjectDocs(sampleProject, config);

        expect(docs).toBeDefined();
        expect(docs.level).toBe('project');
        expect(docs.content).toContain('# ReadmeBot');
        expect(docs.content).toContain('A CLI tool for generating comprehensive READMEs for TypeScript projects');
        expect(docs.content).toContain('## Modules');
        expect(docs.content).toContain('### core');
        expect(docs.content).toContain('### cli');
        expect(docs.content).toContain('## Configuration');
        expect(docs.content).toContain('### tsconfig.json');
        expect(docs.content).toContain('### package.json');
        expect(docs.content).toContain('## Documentation');
        expect(docs.content).toContain('### README.md');
        expect(docs.content).toContain('### CONTRIBUTING.md');
        expect(docs.metadata.config).toEqual(config);
    });

    it('should generate minimal documentation', async () => {
        const config: DocumentationConfig = {
            level: 'project',
            includeBusinessContext: false,
            includeExamples: false,
            includeApiDocs: false,
            includeImplementationDetails: false,
            maxDepth: 1
        };

        const docs = await generator.generateProjectDocs(sampleProject, config);

        expect(docs).toBeDefined();
        expect(docs.level).toBe('project');
        expect(docs.content).toContain('# ReadmeBot');
        expect(docs.content).toContain('A CLI tool for generating comprehensive READMEs for TypeScript projects');
        expect(docs.content).not.toContain('## Business Context');
        expect(docs.content).toContain('## Modules');
        expect(docs.content).toContain('## Configuration');
        expect(docs.content).toContain('## Documentation');
        expect(docs.metadata.config).toEqual(config);
    });

    it('should validate generated documentation', async () => {
        const config: DocumentationConfig = generator.getDefaultConfig();
        const docs = await generator.generateProjectDocs(sampleProject, config);
        const isValid = await generator.validateDocumentation(docs);

        expect(isValid).toBe(true);
    });

    it('should use available templates', async () => {
        const templates = await generator.getAvailableTemplates();
        expect(templates).toBeDefined();
        expect(templates.default).toBeDefined();
        expect(templates.minimal).toBeDefined();
        expect(templates.detailed).toBeDefined();

        // Verify template content
        expect(templates.default).toContain('{{project.name}}');
        expect(templates.default).toContain('{{project.description}}');
        expect(templates.default).toContain('{{project.version}}');

        expect(templates.minimal).toContain('{{project.name}}');
        expect(templates.minimal).toContain('{{project.description}}');

        expect(templates.detailed).toContain('{{project.name}}');
        expect(templates.detailed).toContain('{{project.description}}');
        expect(templates.detailed).toContain('{{project.version}}');
        expect(templates.detailed).toContain('## Business Context');
        expect(templates.detailed).toContain('## Modules');
        expect(templates.detailed).toContain('## Configuration');
        expect(templates.detailed).toContain('## Documentation');
    });
}); 