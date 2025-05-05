# ReadmeBot

An AI-powered documentation generator that focuses on creating business-context-rich documentation at multiple levels of a codebase. ReadmeBot helps maintain alignment between technical implementation and business requirements by generating documentation that explains the "why" behind the code.

## Why ReadmeBot?

Modern codebases often suffer from a disconnect between technical implementation and business context. This leads to:

- Code that doesn't align with business needs
- Documentation that focuses only on "how" without explaining "why"
- Drift between technical implementation and business requirements
- Misunderstanding of business context by new team members
- Inconsistent handling of business rules across the codebase

ReadmeBot addresses these issues by generating documentation that:

1. Explains the business purpose behind code
2. Documents business rules and constraints
3. Maintains alignment with business requirements
4. Provides context for technical decisions
5. Ensures consistent business terminology

## Features

### Multi-Level Documentation

ReadmeBot generates documentation at four levels:

1. **Project Level**

   - Business purpose and goals
   - Key stakeholders and their needs
   - Core business processes
   - Compliance requirements
   - Business metrics

2. **Module Level**

   - Business domain boundaries
   - Integration points
   - Business workflows
   - Business rules
   - Performance requirements

3. **File Level**

   - Business purpose
   - Business rules
   - Integration requirements
   - Error handling
   - Compliance requirements

4. **Function Level**
   - Business purpose
   - Business rules
   - Input/output context
   - Error scenarios
   - Performance requirements

### AI-Powered Generation

ReadmeBot uses AI to:

- Analyze code and extract business context
- Generate consistent documentation
- Maintain alignment with business requirements
- Update documentation as code changes
- Ensure terminology consistency

### Integration Support

- IDE integration
- CI/CD pipeline integration
- Version control integration
- Custom template support
- Extensible architecture

## Installation

```bash
npm install -g readmebot
```

## Usage

### Basic Usage

```bash
# Generate documentation for a project
readmebot generate --project ./path/to/project

# Generate documentation for a specific file
readmebot generate --file ./path/to/file.ts

# Generate documentation for a specific function
readmebot generate --function ./path/to/file.ts:functionName
```

### Configuration

Create a `.readmebotrc.json` file in your project root:

```json
{
  "ai": {
    "provider": "openai",
    "apiKey": "your-api-key",
    "model": "gpt-4"
  },
  "documentation": {
    "format": "markdown",
    "templates": {
      "project": "./templates/project.md",
      "module": "./templates/module.md",
      "file": "./templates/file.md",
      "function": "./templates/function.md"
    }
  }
}
```

### Custom Templates

You can create custom templates for each documentation level. See the [Templates](#templates) section for examples.

## Templates

### Project Level Template

```markdown
# Project: {projectName}

## Business Purpose

{projectPurpose}

## Key Stakeholders

- {stakeholderName}: {stakeholderRole} - {stakeholderNeeds}

## Core Business Processes

1. {processName}
   - Purpose: {processPurpose}
   - Key Steps: {processSteps}
   - Business Rules: {businessRules}

## Compliance Requirements

- {requirementName}: {requirementDescription}

## Business Metrics

- {metricName}: {metricDescription}
```

### Module Level Template

```markdown
# Module: {moduleName}

## Business Domain

{domainDescription}

## Integration Points

- {integrationName}
  - Purpose: {integrationPurpose}
  - Business Impact: {businessImpact}

## Business Workflows

1. {workflowName}
   - Steps: {workflowSteps}
   - Business Rules: {businessRules}

## Performance Requirements

- {requirementName}: {requirementDescription}
```

### File Level Template

```markdown
/\*\*

- @file {fileName}
-
- Business Purpose: {businessPurpose}
-
- Business Rules:
- - {ruleDescription}
-
- Integration Requirements:
- - {requirementDescription}
-
- Error Handling:
- - {errorScenario}: {businessImpact}
-
- Compliance Requirements:
- - {requirementDescription}
    \*/
```

### Function Level Template

```typescript
/**
 * @function {functionName}
 *
 * Business Purpose: {businessPurpose}
 *
 * Business Rules:
 * - {ruleDescription}
 *
 * Input Context:
 * - {parameterName}: {businessContext}
 *
 * Output Context:
 * - {returnValue}: {businessContext}
 *
 * Error Scenarios:
 * - {errorScenario}: {businessImpact}
 *
 * Performance Requirements:
 * - {requirementDescription}
 */
```

## Function-Level Documentation Generator

The function-level documentation generator analyzes TypeScript functions and generates comprehensive documentation including:

- Function description and purpose
- Parameter documentation with types and descriptions
- Return type documentation
- Error handling documentation
- Business context and rules
- Dependencies and relationships
- Code examples and test cases

### Usage

```typescript
import { FunctionGenerator } from './generators/function';
import { AIProvider } from './core/ai/ai-provider';

// Create an AI provider instance
const aiProvider = new AIProvider({
  // Configure your AI provider
});

// Create a function generator instance
const generator = new FunctionGenerator(aiProvider);

// Generate documentation for a function
const docs = await generator.generateDocumentation({
  functionName: 'myFunction',
  filePath: 'path/to/file.ts',
  functionBody: '// function source code',
});
```

### Documentation Structure

The generated documentation includes:

```typescript
interface FunctionDocumentation {
  // Basic information
  name: string;
  description: string;

  // Parameters
  parameters: Array<{
    name: string;
    type: string;
    description: string;
    isOptional: boolean;
    defaultValue?: string;
  }>;

  // Return type
  returns: {
    type: string;
    description: string;
  };

  // Error handling
  errors: Array<{
    type: string;
    description: string;
    handling: string;
  }>;

  // Business context
  businessContext: {
    purpose: string;
    rules: string[];
    inputContext: string;
    outputContext: string;
    performanceRequirements: string[];
  };

  // Dependencies
  dependencies: Array<{
    name: string;
    type: string;
    purpose: string;
  }>;

  // Examples and tests
  examples: string[];
  testCases: string[];
}
```

### Features

- **TypeScript Support**: Full support for TypeScript type information and JSDoc comments
- **Business Context**: AI-powered analysis of business rules and requirements
- **Dependency Analysis**: Automatic detection of function dependencies
- **Example Generation**: Automatic generation of usage examples
- **Test Case Generation**: Generation of test cases for the function
- **Error Documentation**: Comprehensive documentation of error scenarios and handling

### Integration

The function-level documentation generator integrates with:

- TypeScript Compiler API for accurate code analysis
- AI providers for business context generation
- Project documentation system for consistent documentation

## License

MIT

## Support

- [Documentation](https://readmebot.dev/docs)
- [Issues](https://github.com/yourusername/readmebot/issues)
- [Discussions](https://github.com/yourusername/readmebot/discussions)

## Roadmap

- [ ] IDE integration
- [ ] CI/CD pipeline integration
- [ ] Custom template support
- [ ] Multiple AI provider support
- [ ] Documentation validation
- [ ] Business rule extraction
- [ ] Compliance checking
- [ ] Performance analysis
