/**
 * Test fixture for documentation generator
 * @module documentation/project
 */

import type { ProjectStructure } from '../../../src/core/documentation/types.js';

/**
 * Sample project structure for testing documentation generation
 */
export const sampleProject: ProjectStructure = {
    name: 'ReadmeBot',
    description: 'A CLI tool for generating comprehensive READMEs for TypeScript projects',
    version: '1.0.0',
    dependencies: {
        'typescript': '^5.0.0',
        'vitest': '^1.0.0',
        'eslint': '^8.0.0',
        'prettier': '^3.0.0'
    },
    modules: [
        {
            name: 'core',
            description: 'Core functionality for documentation generation',
            files: [
                {
                    path: 'src/core/documentation/types.ts',
                    name: 'types.ts',
                    type: 'ts',
                    size: 1000,
                    content: 'export type DocumentationLevel = "project" | "module" | "file" | "function";',
                    functions: [],
                    classes: [],
                    imports: [],
                    exports: ['DocumentationLevel']
                },
                {
                    path: 'src/core/documentation/generator.ts',
                    name: 'generator.ts',
                    type: 'ts',
                    size: 2000,
                    content: 'export class DefaultDocumentationGenerator implements DocumentationGenerator {}',
                    functions: [],
                    classes: ['DefaultDocumentationGenerator'],
                    imports: [],
                    exports: ['DefaultDocumentationGenerator']
                }
            ],
            dependencies: ['typescript'],
            exports: ['DocumentationLevel', 'DefaultDocumentationGenerator']
        },
        {
            name: 'cli',
            description: 'Command-line interface for the tool',
            files: [
                {
                    path: 'src/cli/index.ts',
                    name: 'index.ts',
                    type: 'ts',
                    size: 500,
                    content: 'export function main() {}',
                    functions: ['main'],
                    classes: [],
                    imports: [],
                    exports: ['main']
                }
            ],
            dependencies: ['core'],
            exports: ['main']
        }
    ],
    configFiles: [
        {
            name: 'tsconfig.json',
            description: 'TypeScript configuration',
            content: JSON.stringify({
                compilerOptions: {
                    target: 'ES2022',
                    module: 'NodeNext',
                    moduleResolution: 'NodeNext',
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true
                }
            }, null, 2)
        },
        {
            name: 'package.json',
            description: 'Project configuration and dependencies',
            content: JSON.stringify({
                name: 'readmebot',
                version: '1.0.0',
                description: 'A CLI tool for generating comprehensive READMEs for TypeScript projects',
                main: 'dist/index.js',
                scripts: {
                    build: 'tsc',
                    test: 'vitest',
                    lint: 'eslint .',
                    format: 'prettier --write .'
                },
                dependencies: {
                    typescript: '^5.0.0'
                },
                devDependencies: {
                    vitest: '^1.0.0',
                    eslint: '^8.0.0',
                    prettier: '^3.0.0'
                }
            }, null, 2)
        }
    ],
    docsFiles: [
        {
            name: 'README.md',
            description: 'Project documentation',
            content: '# ReadmeBot\n\nA CLI tool for generating comprehensive READMEs for TypeScript projects'
        },
        {
            name: 'CONTRIBUTING.md',
            description: 'Contribution guidelines',
            content: '# Contributing\n\nPlease read our contribution guidelines before submitting a pull request.'
        }
    ]
}; 