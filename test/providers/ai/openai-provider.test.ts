import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OpenAI } from 'openai';
import { OpenAIProvider, OpenAIProviderConfig } from '../../../src/providers/ai/openai-provider.js';
import { AIProviderError } from '../../../src/core/ai/types.js';
import { ModuleDocumentation } from '../../../src/core/ai/ai-provider.js';

// Mock OpenAI client
const mockCreate = vi.hoisted(() => vi.fn());

vi.mock('openai', () => {
    return {
        default: class {
            constructor() {
                return {
                    chat: {
                        completions: {
                            create: mockCreate
                        }
                    }
                };
            }
        },
        OpenAI: class {
            constructor() {
                return {
                    chat: {
                        completions: {
                            create: mockCreate
                        }
                    }
                };
            }
        }
    };
});

describe('OpenAIProvider', () => {
    let provider: OpenAIProvider;
    let mockConfig: OpenAIProviderConfig;

    beforeEach(() => {
        mockConfig = {
            apiKey: 'test-api-key',
            model: 'gpt-4-test',
            temperature: 0.3,
            maxTokens: 2000
        };

        provider = new OpenAIProvider(mockConfig);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('generateProjectDocs', () => {
        it('should generate project documentation', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            businessPurpose: 'Test purpose',
                            stakeholders: ['Stakeholder 1'],
                            businessProcesses: ['Process 1'],
                            complianceRequirements: ['Requirement 1'],
                            businessMetrics: ['Metric 1']
                        })
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const result = await provider.generateProjectDocs({
                projectName: 'Test Project',
                projectPath: '/test/path'
            });

            expect(result.businessPurpose).toBe('Test purpose');
            expect(result.stakeholders).toContain('Stakeholder 1');
            expect(result.businessProcesses).toContain('Process 1');
            expect(result.complianceRequirements).toContain('Requirement 1');
            expect(result.businessMetrics).toContain('Metric 1');
        });

        it('should handle empty response', async () => {
            mockCreate.mockResolvedValueOnce({
                choices: [{ message: { content: null } }]
            });

            await expect(provider.generateProjectDocs({
                projectName: 'Test Project',
                projectPath: '/test/path'
            })).rejects.toThrow(AIProviderError);
        });

        it('should handle API errors', async () => {
            mockCreate.mockRejectedValueOnce(new Error('API Error'));

            await expect(provider.generateProjectDocs({
                projectName: 'Test Project',
                projectPath: '/test/path'
            })).rejects.toThrow(AIProviderError);
        });
    });

    describe('generateModuleDocs', () => {
        it('should generate module documentation', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            businessDomain: 'Test domain',
                            integrationPoints: ['Integration 1'],
                            businessWorkflows: ['Workflow 1'],
                            businessRules: ['Rule 1'],
                            performanceRequirements: ['Requirement 1']
                        })
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const result = await provider.generateModuleDocs({
                moduleName: 'TestModule',
                modulePath: '/test/module'
            });

            expect(result.businessDomain).toBe('Test domain');
            expect(result.integrationPoints).toContain('Integration 1');
            expect(result.businessWorkflows).toContain('Workflow 1');
            expect(result.businessRules).toContain('Rule 1');
            expect(result.performanceRequirements).toContain('Requirement 1');
        });
    });

    describe('generateFileDocs', () => {
        it('should generate file documentation', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            businessPurpose: 'Test purpose',
                            businessRules: ['Rule 1'],
                            integrationRequirements: ['Requirement 1'],
                            errorHandling: ['Error 1'],
                            complianceRequirements: ['Compliance 1']
                        })
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const result = await provider.generateFileDocs({
                fileName: 'test.ts',
                filePath: '/test/file.ts'
            });

            expect(result.businessPurpose).toBe('Test purpose');
            expect(result.businessRules).toContain('Rule 1');
            expect(result.integrationRequirements).toContain('Requirement 1');
            expect(result.errorHandling).toContain('Error 1');
            expect(result.complianceRequirements).toContain('Compliance 1');
        });
    });

    describe('generateFunctionDocs', () => {
        it('should generate function documentation', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            businessPurpose: 'Test purpose',
                            businessRules: ['Rule 1'],
                            inputContext: 'Input context',
                            outputContext: 'Output context',
                            errorScenarios: ['Error 1'],
                            performanceRequirements: ['Requirement 1']
                        })
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const result = await provider.generateFunctionDocs({
                functionName: 'testFunction',
                filePath: '/test/file.ts',
                functionBody: 'function testFunction() {}'
            });

            expect(result.businessPurpose).toBe('Test purpose');
            expect(result.businessRules).toContain('Rule 1');
            expect(result.inputContext).toBe('Input context');
            expect(result.outputContext).toBe('Output context');
            expect(result.errorScenarios).toContain('Error 1');
            expect(result.performanceRequirements).toContain('Requirement 1');
        });
    });

    describe('streamDocs', () => {
        it('should stream documentation chunks', async () => {
            const mockStream = {
                [Symbol.asyncIterator]: async function* () {
                    yield { choices: [{ delta: { content: 'chunk1' } }] };
                    yield { choices: [{ delta: { content: 'chunk2' } }] };
                }
            };

            mockCreate.mockResolvedValueOnce(mockStream);

            const chunks: string[] = [];
            for await (const chunk of provider.streamDocs('test prompt')) {
                chunks.push(chunk);
            }

            expect(chunks).toEqual(['chunk1', 'chunk2']);
        });

        it('should handle streaming errors', async () => {
            mockCreate.mockRejectedValueOnce(new Error('Stream Error'));

            await expect(async () => {
                const chunks: string[] = [];
                for await (const chunk of provider.streamDocs('test prompt')) {
                    chunks.push(chunk);
                }
            }).rejects.toThrow(AIProviderError);
        });
    });

    describe('validateModuleDocs', () => {
        it('should validate module documentation', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            errors: ['Error 1'],
                            warnings: ['Warning 1']
                        })
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const mockDocs = {
                businessDomain: 'test',
                integrationPoints: [{ name: 'test', purpose: 'test', impact: 'test' }],
                businessWorkflows: [{
                    name: 'test',
                    steps: ['step1'],
                    rules: [{ impact: 'test', rule: 'test', description: 'test' }]
                }],
                businessRules: [{ impact: 'test', rule: 'test', description: 'test' }],
                performanceRequirements: [{ name: 'test', description: 'test', target: 'test' }]
            } as ModuleDocumentation;

            const result = await provider.validateModuleDocs(mockDocs);

            expect(result.errors).toContain('Error 1');
            expect(result.warnings).toContain('Warning 1');
        });
    });

    describe('verifyModuleDocsCompleteness', () => {
        it('should verify module documentation completeness', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: JSON.stringify({
                            errors: [],
                            warnings: ['Missing optional section']
                        })
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const mockDocs = {
                businessDomain: 'test',
                integrationPoints: [{ name: 'test', purpose: 'test', impact: 'test' }],
                businessWorkflows: [{
                    name: 'test',
                    steps: ['step1'],
                    rules: [{ impact: 'test', rule: 'test', description: 'test' }]
                }],
                businessRules: [{ impact: 'test', rule: 'test', description: 'test' }],
                performanceRequirements: [{ name: 'test', description: 'test', target: 'test' }]
            } as ModuleDocumentation;

            const result = await provider.verifyModuleDocsCompleteness(mockDocs);

            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toContain('Missing optional section');
        });
    });
}); 