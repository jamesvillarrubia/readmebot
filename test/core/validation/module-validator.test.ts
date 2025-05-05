import { describe, it, expect, beforeEach } from 'vitest';
import { MockAIProvider } from '../../mocks/providers/ai/mock-ai-provider.js';
import { ModuleValidator } from '../../../src/core/validation/module-validator.js';
import { ModuleDocumentation } from '../../../src/core/generators/module-generator.js';

describe('ModuleValidator', () => {
    let validator: ModuleValidator;
    let mockAIProvider: MockAIProvider;

    beforeEach(() => {
        mockAIProvider = new MockAIProvider();
        validator = new ModuleValidator(mockAIProvider);
    });

    describe('validateDocumentation', () => {
        it('should validate complete documentation', async () => {
            const docs: ModuleDocumentation = {
                businessContext: {
                    domain: 'Test Domain',
                    purpose: 'Test Purpose',
                    stakeholders: ['Test Stakeholder'],
                    requirements: [],
                    constraints: []
                },
                architecture: {
                    components: [{
                        name: 'TestComponent',
                        purpose: 'Test Purpose',
                        dependencies: []
                    }],
                    patterns: [{
                        name: 'TestPattern',
                        purpose: 'Test Purpose',
                        implementation: 'Test Implementation'
                    }],
                    dataFlow: []
                },
                api: {
                    exports: [{
                        name: 'testExport',
                        type: 'function',
                        description: 'Test Description',
                        usage: 'Test Usage'
                    }],
                    imports: []
                },
                dependencies: [{
                    name: 'test-dep',
                    type: 'external',
                    purpose: 'Test Purpose',
                    usageLocations: ['test.ts']
                }]
            };

            const result = await validator.validateDocumentation(docs);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toHaveLength(0);
        });

        it('should detect missing required fields', async () => {
            const docs: ModuleDocumentation = {
                businessContext: {
                    domain: '',
                    purpose: '',
                    stakeholders: [],
                    requirements: [],
                    constraints: []
                },
                architecture: {
                    components: [],
                    patterns: [],
                    dataFlow: []
                },
                api: {
                    exports: [],
                    imports: []
                },
                dependencies: []
            };

            const result = await validator.validateDocumentation(docs);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Business context must include domain');
            expect(result.errors).toContain('Business context must include purpose');
            expect(result.warnings).toContain('No stakeholders defined in business context');
            expect(result.warnings).toContain('No components defined in architecture');
            expect(result.warnings).toContain('No patterns detected in architecture');
            expect(result.warnings).toContain('No exports defined in API');
            expect(result.warnings).toContain('No external dependencies detected');
        });
    });

    describe('verifyCompleteness', () => {
        it('should verify complete documentation', async () => {
            const docs: ModuleDocumentation = {
                businessContext: {
                    domain: 'Test Domain',
                    purpose: 'Test Purpose',
                    stakeholders: ['Test Stakeholder'],
                    requirements: [],
                    constraints: []
                },
                architecture: {
                    components: [{
                        name: 'TestComponent',
                        purpose: 'Test Purpose',
                        dependencies: []
                    }],
                    patterns: [{
                        name: 'TestPattern',
                        purpose: 'Test Purpose',
                        implementation: 'Test Implementation'
                    }],
                    dataFlow: []
                },
                api: {
                    exports: [{
                        name: 'testExport',
                        type: 'function',
                        description: 'Test Description',
                        usage: 'Test Usage'
                    }],
                    imports: []
                },
                dependencies: [{
                    name: 'test-dep',
                    type: 'external',
                    purpose: 'Test Purpose',
                    usageLocations: ['test.ts']
                }]
            };

            const result = await validator.verifyCompleteness(docs);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toHaveLength(0);
        });

        it('should detect missing sections', async () => {
            const docs = {} as ModuleDocumentation;

            const result = await validator.verifyCompleteness(docs);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Missing business context section');
            expect(result.errors).toContain('Missing architecture section');
            expect(result.errors).toContain('Missing API section');
            expect(result.errors).toContain('Missing dependencies section');
        });

        it('should detect empty sections', async () => {
            const docs: ModuleDocumentation = {
                businessContext: {
                    domain: '',
                    purpose: '',
                    stakeholders: [],
                    requirements: [],
                    constraints: []
                },
                architecture: {
                    components: [],
                    patterns: [],
                    dataFlow: []
                },
                api: {
                    exports: [],
                    imports: []
                },
                dependencies: []
            };

            const result = await validator.verifyCompleteness(docs);
            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('Business context section is empty');
            expect(result.warnings).toContain('Architecture section is empty');
            expect(result.warnings).toContain('API section is empty');
            expect(result.warnings).toContain('Dependencies section is empty');
        });
    });
}); 