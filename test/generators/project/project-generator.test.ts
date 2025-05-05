import { describe, it, expect, beforeEach } from 'vitest';
import { MockAIProvider } from '../../mocks/providers/ai/mock-ai-provider.js';
import { ProjectGenerator } from '../../../src/generators/project/project-generator.js';
import { AIProvider } from '../../../src/core/ai/ai-provider.js';
import path from 'path';

describe('ProjectGenerator', () => {
    let generator: ProjectGenerator;
    let aiProvider: AIProvider;
    const testProjectPath = path.join(__dirname, '../../fixtures/test-project');

    beforeEach(() => {
        aiProvider = new MockAIProvider();
        generator = new ProjectGenerator(aiProvider);
    });

    describe('generateDocumentation', () => {
        it('should generate project-level documentation', async () => {
            const docs = await generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: testProjectPath
            });

            expect(docs).toBeDefined();
            expect(docs.businessContext).toBeDefined();
            expect(docs.businessContext.purpose).toBeDefined();
            expect(docs.businessContext.stakeholders).toBeInstanceOf(Array);
            expect(docs.businessContext.processes).toBeInstanceOf(Array);
            expect(docs.businessContext.compliance).toBeInstanceOf(Array);
            expect(docs.businessContext.metrics).toBeInstanceOf(Array);

            expect(docs.technicalContext).toBeDefined();
            expect(docs.technicalContext.architecture).toBeDefined();
            expect(docs.technicalContext.dependencies).toBeInstanceOf(Array);
            expect(docs.technicalContext.buildSteps).toBeInstanceOf(Array);
            expect(docs.technicalContext.deploymentSteps).toBeInstanceOf(Array);
            expect(docs.technicalContext.testingStrategy).toBeDefined();
        });

        it('should handle missing project path', async () => {
            await expect(generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: '/non/existent/path'
            })).rejects.toThrow('Project path does not exist');
        });

        it('should handle empty project', async () => {
            // Create empty test project directory
            const emptyProjectPath = path.join(__dirname, '../../fixtures/empty-project');

            const docs = await generator.generateDocumentation({
                projectName: 'empty-project',
                projectPath: emptyProjectPath
            });

            expect(docs).toBeDefined();
            expect(docs.businessContext).toBeDefined();
            expect(docs.technicalContext).toBeDefined();
            expect(docs.technicalContext.dependencies).toEqual([]);
            expect(docs.technicalContext.buildSteps).toEqual([]);
        });

        it('should analyze project dependencies', async () => {
            const docs = await generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: testProjectPath
            });

            expect(docs.technicalContext.dependencies).toBeDefined();
            expect(docs.technicalContext.dependencies.length).toBeGreaterThan(0);
            expect(docs.technicalContext.dependencies[0]).toHaveProperty('name');
            expect(docs.technicalContext.dependencies[0]).toHaveProperty('version');
            expect(docs.technicalContext.dependencies[0]).toHaveProperty('purpose');
        });

        it('should analyze project architecture', async () => {
            const docs = await generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: testProjectPath
            });

            expect(docs.technicalContext.architecture).toBeDefined();
            expect(docs.technicalContext.architecture.components).toBeDefined();
            expect(docs.technicalContext.architecture.dataFlow).toBeDefined();
            expect(docs.technicalContext.architecture.interfaces).toBeDefined();
            expect(docs.technicalContext.architecture.patterns).toBeDefined();
        });
    });

    describe('architecture analysis', () => {
        it('should detect components from directory structure', async () => {
            const docs = await generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: testProjectPath
            });

            const { components } = docs.technicalContext.architecture;
            expect(components).toContainEqual(expect.objectContaining({
                name: 'core',
                purpose: expect.any(String),
                dependencies: expect.any(Array)
            }));
            expect(components).toContainEqual(expect.objectContaining({
                name: 'providers',
                purpose: expect.any(String),
                dependencies: expect.any(Array)
            }));
            expect(components).toContainEqual(expect.objectContaining({
                name: 'generators',
                purpose: expect.any(String),
                dependencies: expect.any(Array)
            }));
        });

        it('should detect data flow between components', async () => {
            const docs = await generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: testProjectPath
            });

            const { dataFlow } = docs.technicalContext.architecture;
            expect(dataFlow).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        source: 'providers',
                        target: 'core'
                    }),
                    expect.objectContaining({
                        source: 'generators',
                        target: 'core'
                    })
                ])
            );
        });

        it('should detect interfaces from TypeScript files', async () => {
            const docs = await generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: testProjectPath
            });

            const { interfaces } = docs.technicalContext.architecture;
            const aiProvider = interfaces.find(i => i.name === 'AIProvider');

            expect(aiProvider).toBeDefined();
            expect(aiProvider?.purpose).toContain('AI');
            expect(aiProvider?.methods).toContain('generateProjectDocs');
            expect(aiProvider?.methods).toContain('generateModuleDocs');
            expect(aiProvider?.methods).toContain('generateFileDocs');
            expect(aiProvider?.methods).toContain('generateFunctionDocs');
            expect(aiProvider?.methods).toContain('streamDocs');
        });

        it('should detect design patterns used in the project', async () => {
            const docs = await generator.generateDocumentation({
                projectName: 'test-project',
                projectPath: testProjectPath
            });

            const { patterns } = docs.technicalContext.architecture;
            expect(patterns).toContainEqual(expect.objectContaining({
                name: 'Provider Pattern',
                purpose: expect.stringContaining('interface'),
                implementation: expect.stringContaining('AIProvider')
            }));
            expect(patterns).toContainEqual(expect.objectContaining({
                name: 'Generator Pattern',
                purpose: expect.stringContaining('documentation'),
                implementation: expect.stringContaining('ProjectGenerator')
            }));
        });
    });
}); 