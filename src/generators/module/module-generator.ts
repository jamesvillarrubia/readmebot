import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import { AIProvider } from '../../core/ai/ai-provider.js';
import {
    ModuleGenerator as IModuleGenerator,
    ModuleConfig,
    ModuleDocumentation,
    ModuleAPI,
    ModuleArchitecture,
    ModuleDependency
} from '../../core/generators/module-generator.js';

/**
 * Implementation of module-level documentation generator
 */
export class ModuleGenerator implements IModuleGenerator {
    constructor(private aiProvider: AIProvider) { }

    /**
     * Generate module-level documentation
     */
    async generateDocumentation(config: ModuleConfig): Promise<ModuleDocumentation> {
        // Validate module path exists
        try {
            await fs.access(config.modulePath);
        } catch {
            throw new Error('Module path does not exist');
        }

        // Generate documentation components in parallel
        const [
            businessContext,
            api,
            architecture,
            dependencies
        ] = await Promise.all([
            this.generateBusinessContext(config),
            this.analyzeAPI(config),
            this.analyzeArchitecture(config),
            this.analyzeDependencies(config)
        ]);

        return {
            businessContext,
            api,
            architecture,
            dependencies
        };
    }

    /**
     * Generate business context using AI provider
     */
    private async generateBusinessContext(config: ModuleConfig): Promise<ModuleDocumentation['businessContext']> {
        const docs = await this.aiProvider.generateModuleDocs({
            moduleName: config.moduleName,
            modulePath: config.modulePath
        });

        return {
            domain: docs.businessDomain,
            purpose: docs.businessDomain,
            stakeholders: ['Module Users', 'Module Maintainers'],
            requirements: docs.performanceRequirements.map(req => ({
                type: 'functional',
                description: req,
                priority: 'medium'
            })),
            constraints: ['Must follow TypeScript best practices']
        };
    }

    /**
     * Analyze module API
     */
    private async analyzeAPI(config: ModuleConfig): Promise<ModuleAPI> {
        const files = await this.getModuleFiles(config.modulePath);
        const exports: ModuleAPI['exports'] = [];
        const imports: ModuleAPI['imports'] = [];

        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            const sourceFile = ts.createSourceFile(
                file,
                content,
                ts.ScriptTarget.Latest,
                true
            );

            const visitNode = (node: ts.Node) => {
                if (ts.isExportDeclaration(node) || ts.isExportAssignment(node)) {
                    const exportName = node.getText(sourceFile);
                    exports.push({
                        name: exportName,
                        type: 'variable',
                        description: this.getNodePurpose(node),
                        usage: 'Import this export to use its functionality'
                    });
                } else if (ts.isInterfaceDeclaration(node) && node.name && this.hasExportModifier(node)) {
                    exports.push({
                        name: node.name.text,
                        type: 'interface',
                        description: this.getNodePurpose(node),
                        usage: 'Implement this interface to provide functionality'
                    });
                } else if (ts.isClassDeclaration(node) && node.name && this.hasExportModifier(node)) {
                    exports.push({
                        name: node.name.text,
                        type: 'class',
                        description: this.getNodePurpose(node),
                        usage: 'Instantiate this class to use its functionality'
                    });
                } else if (ts.isTypeAliasDeclaration(node) && node.name && this.hasExportModifier(node)) {
                    exports.push({
                        name: node.name.text,
                        type: 'type',
                        description: this.getNodePurpose(node),
                        usage: 'Use this type to define data structures'
                    });
                } else if (ts.isImportDeclaration(node)) {
                    const moduleSpecifier = node.moduleSpecifier;
                    if (ts.isStringLiteral(moduleSpecifier)) {
                        const source = moduleSpecifier.text;
                        const importClause = node.importClause;
                        if (importClause?.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
                            for (const element of importClause.namedBindings.elements) {
                                imports.push({
                                    name: element.name.text,
                                    source,
                                    purpose: 'Named import'
                                });
                            }
                        } else if (importClause?.name) {
                            imports.push({
                                name: importClause.name.text,
                                source,
                                purpose: 'Default import'
                            });
                        }
                    }
                }

                ts.forEachChild(node, visitNode);
            };

            visitNode(sourceFile);
        }

        return { exports, imports };
    }

    /**
     * Analyze module architecture
     */
    private async analyzeArchitecture(config: ModuleConfig): Promise<ModuleArchitecture> {
        const files = await this.getModuleFiles(config.modulePath);
        const components: ModuleArchitecture['components'] = [];
        const patterns: ModuleArchitecture['patterns'] = [];
        const dataFlow: ModuleArchitecture['dataFlow'] = [];

        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            const sourceFile = ts.createSourceFile(
                file,
                content,
                ts.ScriptTarget.Latest,
                true
            );

            const visitNode = (node: ts.Node) => {
                if (ts.isInterfaceDeclaration(node) && node.name && this.hasExportModifier(node)) {
                    components.push({
                        name: node.name.text,
                        purpose: this.getNodePurpose(node),
                        dependencies: this.getNodeDependencies(node, sourceFile)
                    });

                    // Detect patterns
                    if (node.name.text.includes('Provider')) {
                        patterns.push({
                            name: 'Provider Pattern',
                            purpose: 'Abstract service implementation',
                            implementation: node.name.text
                        });
                    }
                } else if (ts.isClassDeclaration(node) && node.name && this.hasExportModifier(node)) {
                    components.push({
                        name: node.name.text,
                        purpose: this.getNodePurpose(node),
                        dependencies: this.getNodeDependencies(node, sourceFile)
                    });

                    // Analyze data flow from heritage clauses
                    if (node.heritageClauses) {
                        for (const clause of node.heritageClauses) {
                            for (const type of clause.types) {
                                const target = type.expression.getText(sourceFile);
                                dataFlow.push({
                                    source: node.name.text,
                                    target,
                                    description: clause.token === ts.SyntaxKind.ImplementsKeyword
                                        ? 'implements'
                                        : 'extends'
                                });
                            }
                        }
                    }
                }

                ts.forEachChild(node, visitNode);
            };

            visitNode(sourceFile);
        }

        return { components, patterns, dataFlow };
    }

    /**
     * Analyze module dependencies
     */
    private async analyzeDependencies(config: ModuleConfig): Promise<ModuleDependency[]> {
        const files = await this.getModuleFiles(config.modulePath);
        const dependencies = new Map<string, {
            type: 'internal' | 'external';
            purpose: string;
            usageLocations: Set<string>;
        }>();

        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            const sourceFile = ts.createSourceFile(
                file,
                content,
                ts.ScriptTarget.Latest,
                true
            );

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

                        dep.usageLocations.add(path.basename(file));
                        dependencies.set(name, dep);
                    }
                }

                ts.forEachChild(node, visitNode);
            };

            visitNode(sourceFile);
        }

        return Array.from(dependencies.entries()).map(([name, info]) => ({
            name,
            type: info.type,
            purpose: info.purpose,
            usageLocations: Array.from(info.usageLocations)
        }));
    }

    /**
     * Get all TypeScript files in the module directory
     */
    private async getModuleFiles(modulePath: string): Promise<string[]> {
        const files: string[] = [];
        const entries = await fs.readdir(modulePath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(modulePath, entry.name);
            if (entry.isDirectory()) {
                files.push(...await this.getModuleFiles(fullPath));
            } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
                files.push(fullPath);
            }
        }

        return files;
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
     * Check if a node has an export modifier
     */
    private hasExportModifier(node: ts.Node): boolean {
        if (!ts.canHaveModifiers(node)) return false;
        const modifiers = ts.getModifiers(node);
        return modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    }

    /**
     * Get dependencies of a node
     */
    private getNodeDependencies(node: ts.Node, sourceFile: ts.SourceFile): string[] {
        const dependencies = new Set<string>();

        const visitNode = (node: ts.Node) => {
            if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
                const source = node.moduleSpecifier.text;
                const isExternal = !source.startsWith('.');
                if (isExternal) {
                    dependencies.add(source.split('/')[0] ?? source);
                }
            } else if (ts.isHeritageClause(node)) {
                for (const type of node.types) {
                    const text = type.expression.getText(sourceFile);
                    if (text.includes('zod') || text.includes('ts')) {
                        dependencies.add('zod');
                    }
                }
            }

            ts.forEachChild(node, visitNode);
        };

        visitNode(node);
        return Array.from(dependencies);
    }
} 