/**
 * Function-level documentation generator implementation
 * @module generators/function
 */

import ts from 'typescript';
import { AIProvider } from '../../core/ai/ai-provider.js';
import {
    FunctionGenerator as IFunctionGenerator,
    FunctionConfig,
    FunctionDocumentation,
    FunctionParameter,
    FunctionReturn,
    FunctionError,
    FunctionBusinessContext,
    FunctionDependency
} from '../../core/generators/function-generator.js';

/**
 * Implementation of function-level documentation generator
 */
export class FunctionGenerator implements IFunctionGenerator {
    constructor(private aiProvider: AIProvider) { }

    /**
     * Generate function-level documentation
     */
    async generateDocumentation(config: FunctionConfig): Promise<FunctionDocumentation> {
        // Parse the function using TypeScript compiler API
        const sourceFile = ts.createSourceFile(
            config.filePath,
            config.functionBody,
            ts.ScriptTarget.Latest,
            true
        );

        // Extract function details
        const functionDetails = await this.extractFunctionDetails(sourceFile, config);

        // Generate business context using AI
        const businessContext = await this.generateBusinessContext(config);

        // Analyze dependencies
        const dependencies = await this.analyzeDependencies(sourceFile);

        // Generate examples and test cases
        const examples = await this.generateExamples(config, functionDetails);
        const testCases = await this.generateTestCases(config, functionDetails);

        return {
            name: config.functionName,
            description: functionDetails.description,
            parameters: functionDetails.parameters,
            returns: functionDetails.returns,
            errors: functionDetails.errors,
            businessContext,
            dependencies,
            examples,
            testCases
        };
    }

    /**
     * Extract function details from TypeScript AST
     */
    private async extractFunctionDetails(sourceFile: ts.SourceFile, config: FunctionConfig): Promise<{
        description: string;
        parameters: FunctionParameter[];
        returns: FunctionReturn;
        errors: FunctionError[];
        isAsync: boolean;
    }> {
        let description = '';
        const parameters: FunctionParameter[] = [];
        let returns: FunctionReturn = { type: 'void', description: 'No return value' };
        const errors: FunctionError[] = [];
        let isAsync = false;

        // Visit each node in the AST
        const visit = (node: ts.Node) => {
            if (ts.isFunctionDeclaration(node) && node.name?.text === config.functionName) {
                // Get function description from JSDoc
                const fullText = node.getFullText(sourceFile);
                const commentMatch = fullText.match(/\/\*\*([^*]*\*+(?:[^/*][^*]*\*+)*)\//);
                description = commentMatch?.[1]?.replace(/\*/g, '').trim() || 'No description available';

                // Check if function is async
                isAsync = node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword) || false;

                // Extract parameters
                node.parameters.forEach(param => {
                    const paramType = param.type?.getText(sourceFile) || 'any';
                    // Simplify complex types for documentation
                    const simplifiedType = this.simplifyType(paramType);

                    parameters.push({
                        name: param.name.getText(sourceFile),
                        type: simplifiedType,
                        description: this.getParameterDescription(param, fullText),
                        isOptional: param.questionToken !== undefined || param.initializer !== undefined,
                        defaultValue: param.initializer?.getText(sourceFile)
                    });
                });

                // Extract return type
                if (node.type) {
                    const returnType = node.type.getText(sourceFile);
                    const simplifiedReturnType = this.simplifyType(returnType);

                    returns = {
                        type: simplifiedReturnType,
                        description: this.getReturnDescription(fullText)
                    };
                }

                // Extract error information from throws tags
                const throwsMatch = fullText.match(/@throws\s+{([^}]+)}\s+([^\n]+)/g);
                if (throwsMatch) {
                    throwsMatch.forEach(match => {
                        const [, type, description] = match.match(/@throws\s+{([^}]+)}\s+([^\n]+)/) || [];
                        if (type && description) {
                            errors.push({
                                type: type,
                                description: description,
                                handling: 'Handle appropriately based on error type'
                            });
                        }
                    });
                }
            }

            ts.forEachChild(node, visit);
        };

        visit(sourceFile);

        return {
            description,
            parameters,
            returns,
            errors,
            isAsync
        };
    }

    /**
     * Simplify complex TypeScript types for documentation
     */
    private simplifyType(type: string): string {
        // Handle Promise types
        if (type.startsWith('Promise<')) {
            return type;
        }

        // Handle object types
        if (type.includes('{') && type.includes('}')) {
            return 'object';
        }

        // Handle array types
        if (type.endsWith('[]')) {
            return 'array';
        }

        // Handle union types
        if (type.includes('|')) {
            const types = type.split('|');
            return types[0]?.trim() || 'unknown';
        }

        return type;
    }

    /**
     * Generate business context using AI provider
     */
    private async generateBusinessContext(config: FunctionConfig): Promise<FunctionBusinessContext> {
        const functionDocs = await this.aiProvider.generateFunctionDocs({
            functionName: config.functionName,
            filePath: config.filePath,
            functionBody: config.functionBody
        });

        return {
            purpose: functionDocs.businessPurpose,
            rules: functionDocs.businessRules,
            inputContext: functionDocs.inputContext,
            outputContext: functionDocs.outputContext,
            performanceRequirements: functionDocs.performanceRequirements
        };
    }

    /**
     * Analyze function dependencies from AST
     */
    private async analyzeDependencies(sourceFile: ts.SourceFile): Promise<FunctionDependency[]> {
        const dependencies: FunctionDependency[] = [];
        const imports = new Set<string>();

        // Visit each node to collect imports and dependencies
        const visit = (node: ts.Node) => {
            if (ts.isImportDeclaration(node)) {
                const importPath = (node.moduleSpecifier as ts.StringLiteral).text;
                imports.add(importPath);
                dependencies.push({
                    name: importPath,
                    type: 'import',
                    purpose: 'Required dependency'
                });
            } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
                const callName = node.expression.text;
                if (!this.isBuiltInFunction(callName)) {
                    dependencies.push({
                        name: callName,
                        type: 'function call',
                        purpose: 'Function dependency'
                    });
                }
            }

            ts.forEachChild(node, visit);
        };

        visit(sourceFile);

        return dependencies;
    }

    /**
     * Generate code examples using AI
     */
    private async generateExamples(
        config: FunctionConfig,
        functionDetails: { parameters: FunctionParameter[]; returns: FunctionReturn; isAsync: boolean }
    ): Promise<string[]> {
        // Generate basic usage example
        const paramList = functionDetails.parameters
            .map(p => `${p.name}: ${this.generateExampleValue(p.type)}`)
            .join(', ');

        const basicExample = `// Basic usage
${functionDetails.isAsync ? 'const result = await ' : 'const result = '}${config.functionName}(${paramList});`;

        // Generate example with error handling
        const errorExample = `// With error handling
try {
    ${functionDetails.isAsync ? 'const result = await ' : 'const result = '}${config.functionName}(${paramList});
    // Handle success
} catch (error) {
    // Handle error
}`;

        return [basicExample, errorExample];
    }

    /**
     * Generate test cases using AI
     */
    private async generateTestCases(
        config: FunctionConfig,
        functionDetails: { parameters: FunctionParameter[]; returns: FunctionReturn; isAsync: boolean }
    ): Promise<string[]> {
        // Generate basic test case
        const paramList = functionDetails.parameters
            .map(p => `${p.name}: ${this.generateExampleValue(p.type)}`)
            .join(', ');

        const basicTest = `test('should handle basic case', ${functionDetails.isAsync ? 'async ' : ''}() => {
    ${functionDetails.isAsync ? 'const result = await ' : 'const result = '}${config.functionName}(${paramList});
    expect(result).toBeDefined();
});`;

        // Generate error test case
        const errorTest = `test('should handle error case', ${functionDetails.isAsync ? 'async ' : ''}() => {
    const testFn = ${functionDetails.isAsync ? 'async ' : ''}() => ${config.functionName}(${paramList});
    expect(testFn).toThrow();
});`;

        return [basicTest, errorTest];
    }

    /**
     * Get parameter description from JSDoc comment
     */
    private getParameterDescription(param: ts.ParameterDeclaration, fullText: string): string {
        const paramName = param.name.getText();
        const paramMatch = fullText.match(new RegExp(`@param\\s+{[^}]+}\\s+${paramName}\\s+([^\n]+)`));
        return paramMatch?.[1] || 'No description available';
    }

    /**
     * Get return description from JSDoc comment
     */
    private getReturnDescription(fullText: string): string {
        const returnMatch = fullText.match(/@returns?\s+([^\n]+)/);
        return returnMatch?.[1] || 'No description available';
    }

    /**
     * Check if a function is a built-in JavaScript function
     */
    private isBuiltInFunction(name: string): boolean {
        const builtIns = new Set([
            'parseInt', 'parseFloat', 'isNaN', 'isFinite',
            'encodeURI', 'decodeURI', 'encodeURIComponent', 'decodeURIComponent',
            'Array', 'Object', 'String', 'Boolean', 'Number', 'Date', 'Math', 'JSON'
        ]);
        return builtIns.has(name);
    }

    /**
     * Generate example value for a type
     */
    private generateExampleValue(type: string): string {
        switch (type.toLowerCase()) {
            case 'string':
                return '"example"';
            case 'number':
                return '42';
            case 'boolean':
                return 'true';
            case 'array':
                return '[]';
            case 'object':
                return '{}';
            default:
                return 'undefined';
        }
    }
} 