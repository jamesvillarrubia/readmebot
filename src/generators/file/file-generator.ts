import fs from 'fs/promises';
import ts from 'typescript';
import { AIProvider } from '../../core/ai/ai-provider.js';
import {
    FileGenerator as IFileGenerator,
    FileConfig,
    FileDocumentation,
    CodeBlock,
    FileDependency,
    FileBusinessContext,
    FileErrorHandling
} from '../../core/generators/file-generator.js';

/**
 * Implementation of file-level documentation generator
 */
export class FileGenerator implements IFileGenerator {
    constructor(private aiProvider: AIProvider) { }

    /**
     * Generate file-level documentation
     */
    async generateDocumentation(config: FileConfig): Promise<FileDocumentation> {
        // Validate file path exists
        try {
            await fs.access(config.filePath);
        } catch {
            throw new Error('File path does not exist');
        }

        // Generate documentation components in parallel
        const [
            businessContext,
            codeBlocks,
            dependencies,
            errorHandling
        ] = await Promise.all([
            this.generateBusinessContext(config),
            this.analyzeCodeBlocks(config),
            this.analyzeDependencies(config),
            this.analyzeErrorHandling(config)
        ]);

        return {
            businessContext,
            codeBlocks,
            dependencies,
            errorHandling
        };
    }

    /**
     * Generate business context using AI provider
     */
    private async generateBusinessContext(config: FileConfig): Promise<FileBusinessContext> {
        const fileDocs = await this.aiProvider.generateFileDocs({
            fileName: config.fileName,
            filePath: config.filePath
        });

        return {
            purpose: fileDocs.businessPurpose,
            domain: 'File Domain', // TODO: Get from module context
            stakeholders: ['File Users', 'File Maintainers'],
            requirements: [
                {
                    type: 'functional',
                    description: 'Must implement required functionality',
                    priority: 'high'
                },
                {
                    type: 'non-functional',
                    description: 'Must be well-documented',
                    priority: 'medium'
                }
            ],
            constraints: ['Must follow TypeScript best practices']
        };
    }

    /**
     * Analyze code blocks in the file
     */
    private async analyzeCodeBlocks(config: FileConfig): Promise<CodeBlock[]> {
        const content = await fs.readFile(config.filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(
            config.filePath,
            content,
            ts.ScriptTarget.Latest,
            true
        );

        const codeBlocks: CodeBlock[] = [];

        const visitNode = (node: ts.Node) => {
            if (ts.isFunctionDeclaration(node) && node.name) {
                const parameters = node.parameters.map(param => ({
                    name: param.name.getText(sourceFile),
                    type: param.type?.getText(sourceFile) || 'any',
                    description: this.getNodePurpose(param)
                }));

                const returnType = node.type?.getText(sourceFile) || 'void';
                const throws = this.extractThrowsFromComments(node, sourceFile);

                codeBlocks.push({
                    name: node.name.text,
                    type: 'function',
                    description: this.getNodePurpose(node),
                    usage: 'Call this function to perform its operation',
                    parameters,
                    returns: {
                        type: returnType,
                        description: `Returns ${returnType}`
                    },
                    throws
                });
            } else if (ts.isClassDeclaration(node) && node.name) {
                codeBlocks.push({
                    name: node.name.text,
                    type: 'class',
                    description: this.getNodePurpose(node),
                    usage: 'Instantiate this class to use its functionality'
                });
            } else if (ts.isInterfaceDeclaration(node) && node.name) {
                codeBlocks.push({
                    name: node.name.text,
                    type: 'interface',
                    description: this.getNodePurpose(node),
                    usage: 'Implement this interface to provide functionality'
                });
            } else if (ts.isTypeAliasDeclaration(node) && node.name) {
                codeBlocks.push({
                    name: node.name.text,
                    type: 'type',
                    description: this.getNodePurpose(node),
                    usage: 'Use this type to define data structures'
                });
            } else if (ts.isVariableStatement(node)) {
                for (const declaration of node.declarationList.declarations) {
                    if (ts.isIdentifier(declaration.name)) {
                        codeBlocks.push({
                            name: declaration.name.text,
                            type: 'variable',
                            description: this.getNodePurpose(node),
                            usage: 'Use this variable to access its value'
                        });
                    }
                }
            }

            ts.forEachChild(node, visitNode);
        };

        visitNode(sourceFile);
        return codeBlocks;
    }

    /**
     * Analyze file dependencies
     */
    private async analyzeDependencies(config: FileConfig): Promise<FileDependency[]> {
        const content = await fs.readFile(config.filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(
            config.filePath,
            content,
            ts.ScriptTarget.Latest,
            true
        );

        const dependencies = new Map<string, {
            type: 'internal' | 'external';
            purpose: string;
            usageLocations: Set<string>;
        }>();

        const visitNode = (node: ts.Node) => {
            if (ts.isImportDeclaration(node)) {
                const moduleSpecifier = node.moduleSpecifier;
                if (ts.isStringLiteral(moduleSpecifier)) {
                    const source = moduleSpecifier.text;
                    const isExternal = !source.startsWith('.');
                    const name = isExternal ? source.split('/')[0] ?? source : source;
                    if (!name) return;

                    const importClause = node.importClause;
                    let purpose = 'Unknown purpose';

                    if (importClause?.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
                        const imports = importClause.namedBindings.elements
                            .map(element => element.name.text)
                            .join(', ');
                        purpose = `Imports ${imports} for ${isExternal ? 'external functionality' : 'internal module functionality'}`;
                    } else if (importClause?.name) {
                        purpose = `Imports ${importClause.name.text} for ${isExternal ? 'external functionality' : 'internal module functionality'}`;
                    }

                    const dep = dependencies.get(name) || {
                        type: isExternal ? 'external' : 'internal',
                        purpose,
                        usageLocations: new Set<string>()
                    };

                    dep.usageLocations.add(config.fileName);
                    dependencies.set(name, dep);
                }
            }

            ts.forEachChild(node, visitNode);
        };

        visitNode(sourceFile);

        return Array.from(dependencies.entries()).map(([name, info]) => ({
            name,
            type: info.type,
            purpose: info.purpose,
            usageLocations: Array.from(info.usageLocations)
        }));
    }

    /**
     * Analyze error handling in the file
     */
    private async analyzeErrorHandling(config: FileConfig): Promise<FileErrorHandling[]> {
        const content = await fs.readFile(config.filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(
            config.filePath,
            content,
            ts.ScriptTarget.Latest,
            true
        );

        const errorHandling: FileErrorHandling[] = [];

        for (const node of sourceFile.getChildren()) {
            if (ts.isTryStatement(node)) {
                for (const catchClause of node.catchClause ? [node.catchClause] : []) {
                    const errorType = catchClause.variableDeclaration?.type?.getText(sourceFile) || 'Error';
                    errorHandling.push({
                        scenario: `Catch block for ${errorType}`,
                        impact: 'Handles runtime errors',
                        resolution: 'Logs error and continues execution'
                    });
                }
            }
        }

        return errorHandling;
    }

    /**
     * Get the purpose of a node from its JSDoc comment
     */
    private getNodePurpose(node: ts.Node): string {
        const fullText = node.getFullText();
        const commentRanges = ts.getLeadingCommentRanges(fullText, 0);
        if (!commentRanges?.length) return 'No description available';

        const lastComment = commentRanges[commentRanges.length - 1];
        if (!lastComment) return 'No description available';

        const commentText = fullText.slice(lastComment.pos, lastComment.end);
        const cleanComment = commentText
            .replace(/\/\*\*|\*\/|\*/g, '')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('@'))
            .join(' ')
            .trim();

        return cleanComment || 'No description available';
    }

    /**
     * Extract throws information from JSDoc comments
     */
    private extractThrowsFromComments(node: ts.Node, sourceFile: ts.SourceFile): Array<{ type: string; description: string }> {
        const throws: Array<{ type: string; description: string }> = [];
        const fullText = sourceFile.getFullText();
        const nodeStart = node.getFullStart();
        const commentRanges = ts.getLeadingCommentRanges(fullText, nodeStart) || [];

        for (const commentRange of commentRanges) {
            const comment = fullText.slice(commentRange.pos, commentRange.end);
            const throwsMatch = comment.match(/@throws\s+{([^}]+)}\s+(.+)/);
            if (throwsMatch && throwsMatch[1] && throwsMatch[2]) {
                throws.push({
                    type: throwsMatch[1].trim(),
                    description: throwsMatch[2].trim()
                });
            }
        }

        return throws;
    }
} 