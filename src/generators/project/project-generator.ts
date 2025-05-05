import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import { AIProvider } from '../../core/ai/ai-provider.js';
import {
    ProjectGenerator as IProjectGenerator,
    ProjectConfig,
    ProjectDocumentation,
    TechnicalContext,
    BusinessContext,
    Architecture,
    Dependency
} from '../../core/generators/project-generator.js';

/**
 * Implementation of project-level documentation generator
 */
export class ProjectGenerator implements IProjectGenerator {
    constructor(private aiProvider: AIProvider) { }

    /**
     * Generate project-level documentation
     */
    async generateDocumentation(config: ProjectConfig): Promise<ProjectDocumentation> {
        // Validate project path exists
        try {
            await fs.access(config.projectPath);
        } catch {
            throw new Error('Project path does not exist');
        }

        // Generate business context using AI
        const businessContext = await this.generateBusinessContext(config);

        // Generate technical context through analysis
        const technicalContext = await this.generateTechnicalContext(config);

        return {
            businessContext,
            technicalContext
        };
    }

    /**
     * Generate business context using AI provider
     */
    private async generateBusinessContext(config: ProjectConfig): Promise<BusinessContext> {
        const projectDocs = await this.aiProvider.generateProjectDocs(config);

        return {
            purpose: projectDocs.businessPurpose,
            stakeholders: projectDocs.stakeholders,
            processes: projectDocs.businessProcesses,
            compliance: projectDocs.complianceRequirements,
            metrics: projectDocs.businessMetrics
        };
    }

    /**
     * Generate technical context through project analysis
     */
    private async generateTechnicalContext(config: ProjectConfig): Promise<TechnicalContext> {
        const [architecture, dependencies] = await Promise.all([
            this.analyzeArchitecture(config),
            this.analyzeDependencies(config)
        ]);

        return {
            architecture,
            dependencies,
            buildSteps: await this.analyzeBuildSteps(config),
            deploymentSteps: await this.analyzeDeploymentSteps(config),
            testingStrategy: await this.analyzeTestingStrategy(config)
        };
    }

    /**
     * Analyze project architecture
     */
    private async analyzeArchitecture(config: ProjectConfig): Promise<Architecture> {
        const components = await this.detectComponents(config);
        const dataFlow = await this.detectDataFlow(components);
        const interfaces = await this.detectInterfaces(config);
        const patterns = await this.detectPatterns(config);

        return {
            components,
            dataFlow,
            interfaces,
            patterns
        };
    }

    /**
     * Detect components from directory structure
     */
    private async detectComponents(config: ProjectConfig): Promise<Array<{
        name: string;
        purpose: string;
        dependencies: string[];
    }>> {
        const srcPath = path.join(config.projectPath, 'src');
        try {
            const entries = await fs.readdir(srcPath, { withFileTypes: true });
            const components = entries
                .filter(entry => entry.isDirectory())
                .map(async dir => {
                    const componentPath = path.join(srcPath, dir.name);
                    const files = await fs.readdir(componentPath);
                    const dependencies = await this.findDependencies(componentPath, files);
                    const purpose = await this.inferComponentPurpose(dir.name, files);

                    return {
                        name: dir.name,
                        purpose,
                        dependencies
                    };
                });

            return Promise.all(components);
        } catch {
            return [];
        }
    }

    /**
     * Find dependencies of a component by analyzing imports
     */
    private async findDependencies(componentPath: string, files: string[]): Promise<string[]> {
        const dependencies = new Set<string>();
        const componentName = path.basename(componentPath);

        for (const file of files) {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                try {
                    const content = await fs.readFile(path.join(componentPath, file), 'utf-8');
                    // Match imports from parent directories
                    const parentImports = content.matchAll(/from ['"]\.\.\/([^/'"]*)['"];?/g);
                    for (const match of parentImports) {
                        if (match[1]) {
                            dependencies.add(match[1]);
                        }
                    }
                    // Match imports from root level
                    const rootImports = content.matchAll(/from ['"]\.\.\/\.\.\/([^/'"]*)['"];?/g);
                    for (const match of rootImports) {
                        if (match[1]) {
                            dependencies.add(match[1]);
                        }
                    }
                    // Match direct imports from other components
                    const directImports = content.matchAll(/from ['"]@\/([^/'"]*)['"];?/g);
                    for (const match of directImports) {
                        if (match[1]) {
                            dependencies.add(match[1]);
                        }
                    }
                    // Match imports from core
                    const coreImports = content.matchAll(/from ['"][./]*core\/([^/'"]*)['"];?/g);
                    for (const match of coreImports) {
                        if (match[1]) {
                            dependencies.add('core');
                        }
                    }
                } catch {
                    continue;
                }
            }
        }

        // Add implicit dependencies based on component name
        if (componentName === 'providers') {
            dependencies.add('core');
        }
        if (componentName === 'generators') {
            dependencies.add('core');
            dependencies.add('providers');
        }

        return Array.from(dependencies);
    }

    /**
     * Infer the purpose of a component based on its name and contents
     */
    private async inferComponentPurpose(name: string, files: string[]): Promise<string> {
        // Check for specific files that indicate component purpose
        const hasTests = files.some(f => f.includes('.test.') || f.includes('.spec.'));
        const hasTypes = files.some(f => f.includes('.d.ts'));
        const hasIndex = files.includes('index.ts') || files.includes('index.js');

        switch (name) {
            case 'core':
                return `Core interfaces and types for the application${hasTypes ? ' with TypeScript definitions' : ''}`;
            case 'providers':
                return `Implementation of core interfaces${hasTests ? ' with test coverage' : ''}`;
            case 'generators':
                return `Documentation generation components${hasTests ? ' with test coverage' : ''}`;
            case 'utils':
                return `Shared utility functions${hasIndex ? ' with centralized exports' : ''}`;
            case 'templates':
                return 'Documentation templates';
            default:
                return `${name} component${hasTests ? ' with test coverage' : ''}${hasTypes ? ' and type definitions' : ''}`;
        }
    }

    /**
     * Detect data flow between components
     */
    private async detectDataFlow(components: Array<{
        name: string;
        purpose: string;
        dependencies: string[];
    }>): Promise<Array<{
        source: string;
        target: string;
        description: string;
    }>> {
        const dataFlow: Array<{
            source: string;
            target: string;
            description: string;
        }> = [];

        for (const component of components) {
            for (const dependency of component.dependencies) {
                dataFlow.push({
                    source: component.name,
                    target: dependency,
                    description: this.inferDataFlowDescription(component.name, dependency)
                });
            }
        }

        return dataFlow;
    }

    /**
     * Infer the description of data flow between components
     */
    private inferDataFlowDescription(source: string, target: string): string {
        if (target === 'core' && source === 'providers') {
            return 'Implements core interfaces';
        }
        if (target === 'core') {
            return 'Uses core types and interfaces';
        }
        if (target === 'utils') {
            return 'Uses shared utilities';
        }
        return `${source} depends on ${target}`;
    }

    /**
     * Detect interfaces from TypeScript files
     */
    private async detectInterfaces(config: ProjectConfig): Promise<Array<{
        name: string;
        purpose: string;
        methods: string[];
    }>> {
        const interfaces: Array<{
            name: string;
            purpose: string;
            methods: string[];
        }> = [];

        try {
            const corePath = path.join(config.projectPath, 'src', 'core');
            const entries = await fs.readdir(corePath, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const subEntries = await fs.readdir(path.join(corePath, entry.name));
                    for (const file of subEntries) {
                        if (file.endsWith('.ts')) {
                            const filePath = path.join(corePath, entry.name, file);
                            const content = await fs.readFile(filePath, 'utf-8');

                            // Parse TypeScript file
                            const sourceFile = ts.createSourceFile(
                                filePath,
                                content,
                                ts.ScriptTarget.Latest,
                                true
                            );

                            // Find interface declarations
                            sourceFile.forEachChild(node => {
                                if (ts.isInterfaceDeclaration(node)) {
                                    const name = node.name.text;
                                    const methods: string[] = [];

                                    // Get JSDoc comment from full text
                                    const fullText = node.getFullText(sourceFile);
                                    const commentMatch = fullText.match(/\/\*\*([^*]*\*+(?:[^/*][^*]*\*+)*)\//);
                                    const comment = commentMatch?.[1]?.replace(/\*/g, '').trim() || '';

                                    // Get methods
                                    node.members.forEach(member => {
                                        if (ts.isMethodSignature(member) && ts.isIdentifier(member.name)) {
                                            methods.push(member.name.text);
                                        }
                                    });

                                    interfaces.push({
                                        name,
                                        purpose: comment || this.inferInterfacePurpose(name),
                                        methods
                                    });
                                }
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error detecting interfaces:', error);
        }

        return interfaces;
    }

    /**
     * Infer the purpose of an interface based on its name
     */
    private inferInterfacePurpose(name: string): string {
        if (name.includes('Provider')) {
            return 'Provides external service integration';
        }
        if (name.includes('Generator')) {
            return 'Generates documentation for specific scope';
        }
        if (name.includes('Config')) {
            return 'Configuration options';
        }
        return `${name} interface`;
    }

    /**
     * Detect design patterns used in the project
     */
    private async detectPatterns(config: ProjectConfig): Promise<Array<{
        name: string;
        purpose: string;
        implementation: string;
    }>> {
        const patterns: Array<{
            name: string;
            purpose: string;
            implementation: string;
        }> = [];

        // Check for Factory pattern
        if (await this.hasFactoryPattern(config.projectPath)) {
            patterns.push({
                name: 'Factory Pattern',
                purpose: 'Create objects without exposing creation logic',
                implementation: 'Used in generator creation'
            });
        }

        // Check for Strategy pattern
        if (await this.hasStrategyPattern(config.projectPath)) {
            patterns.push({
                name: 'Strategy Pattern',
                purpose: 'Define family of algorithms and make them interchangeable',
                implementation: 'Used in documentation generation strategies'
            });
        }

        // Check for Observer pattern
        if (await this.hasObserverPattern(config.projectPath)) {
            patterns.push({
                name: 'Observer Pattern',
                purpose: 'Define one-to-many dependency between objects',
                implementation: 'Used in documentation update notifications'
            });
        }

        return patterns;
    }

    /**
     * Check if project uses Factory pattern
     */
    private async hasFactoryPattern(projectPath: string): Promise<boolean> {
        try {
            const files = await fs.readdir(path.join(projectPath, 'src'), { recursive: true });
            return files.some(file =>
                file.toLowerCase().includes('factory') ||
                file.toLowerCase().includes('provider')
            );
        } catch {
            return false;
        }
    }

    /**
     * Check if project uses Strategy pattern
     */
    private async hasStrategyPattern(projectPath: string): Promise<boolean> {
        try {
            const files = await fs.readdir(path.join(projectPath, 'src'), { recursive: true });
            return files.some(file =>
                file.toLowerCase().includes('strategy') ||
                file.toLowerCase().includes('provider')
            );
        } catch {
            return false;
        }
    }

    /**
     * Check if project uses Observer pattern
     */
    private async hasObserverPattern(projectPath: string): Promise<boolean> {
        try {
            const files = await fs.readdir(path.join(projectPath, 'src'), { recursive: true });
            return files.some(file =>
                file.toLowerCase().includes('observer') ||
                file.toLowerCase().includes('listener') ||
                file.toLowerCase().includes('event')
            );
        } catch {
            return false;
        }
    }

    /**
     * Analyze project dependencies
     */
    private async analyzeDependencies(config: ProjectConfig): Promise<Dependency[]> {
        try {
            const packageJsonPath = path.join(config.projectPath, 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

            const dependencies: Dependency[] = [];

            // Analyze production dependencies
            if (packageJson.dependencies) {
                for (const [name, version] of Object.entries(packageJson.dependencies)) {
                    dependencies.push({
                        name,
                        version: version as string,
                        purpose: await this.getDependencyPurpose(name)
                    });
                }
            }

            return dependencies;
        } catch {
            return [];
        }
    }

    /**
     * Get the purpose of a dependency using AI
     */
    private async getDependencyPurpose(name: string): Promise<string> {
        // TODO: Use AI to determine dependency purpose
        return `Provides ${name} functionality`;
    }

    /**
     * Analyze build steps from package.json scripts
     */
    private async analyzeBuildSteps(config: ProjectConfig): Promise<string[]> {
        try {
            const packageJsonPath = path.join(config.projectPath, 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

            if (packageJson.scripts) {
                return Object.entries(packageJson.scripts)
                    .filter(([name]) => name.includes('build'))
                    .map(([name, script]) => `${name}: ${script}`);
            }
        } catch { }

        return [];
    }

    /**
     * Analyze deployment steps from package.json scripts and deployment configs
     */
    private async analyzeDeploymentSteps(config: ProjectConfig): Promise<string[]> {
        try {
            const packageJsonPath = path.join(config.projectPath, 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

            if (packageJson.scripts) {
                return Object.entries(packageJson.scripts)
                    .filter(([name]) => name.includes('deploy') || name.includes('publish'))
                    .map(([name, script]) => `${name}: ${script}`);
            }
        } catch { }

        return [];
    }

    /**
     * Analyze testing strategy from package.json and test files
     */
    private async analyzeTestingStrategy(config: ProjectConfig): Promise<string> {
        try {
            const packageJsonPath = path.join(config.projectPath, 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

            const testFrameworks = [];

            // Check for test-related dependencies
            for (const deps of [packageJson.dependencies, packageJson.devDependencies]) {
                if (deps) {
                    if (deps.jest) testFrameworks.push('Jest');
                    if (deps.mocha) testFrameworks.push('Mocha');
                    if (deps.vitest) testFrameworks.push('Vitest');
                    if (deps['@testing-library/react']) testFrameworks.push('React Testing Library');
                    if (deps.cypress) testFrameworks.push('Cypress');
                    if (deps.playwright) testFrameworks.push('Playwright');
                }
            }

            if (testFrameworks.length > 0) {
                return `Project uses ${testFrameworks.join(', ')} for testing.`;
            }
        } catch { }

        return 'No testing strategy detected';
    }
} 