# ReadmeBot Development Instructions

## Development Philosophy

### Core Principles

- Test-Driven Development (TDD) is mandatory
- Functional programming over classes
- TypeScript strict mode
- ESM modules
- Zero dependencies where possible
- Clear separation of concerns
- Business context first

### Code Style Preferences

- Use descriptive variable names (e.g., `isUserAuthenticated` not `isAuth`)
- Single responsibility principle for functions
- Small, focused components
- Clear error handling
- Proper TypeScript types
- JSDoc comments for public APIs
- Inline comments for complex logic

## Development Environment

### Required Tools

- Node.js >= 20.0.0
- TypeScript 5.x
- VS Code
- Git

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Project Structure

```
src/
  ├── core/           # Core interfaces and types
  │   ├── ai/        # AI provider interfaces
  │   ├── fs/        # File system abstractions
  │   └── config/    # Configuration management
  ├── providers/     # Implementation of core interfaces
  │   ├── ai/        # AI providers (OpenAI, etc.)
  │   └── fs/        # File system implementations
  ├── generators/    # Documentation generators
  │   ├── project/   # Project-level documentation
  │   ├── module/    # Module-level documentation
  │   ├── file/      # File-level documentation
  │   └── function/  # Function-level documentation
  ├── templates/     # Documentation templates
  ├── utils/         # Shared utilities
  └── cli/           # CLI implementation
```

## Implementation Order

### Phase 1: Core Infrastructure

1. [ ] Set up project structure
2. [ ] Configure TypeScript
3. [ ] Set up testing framework (Vitest)
4. [ ] Create core interfaces
5. [ ] Implement mock providers
6. [ ] Set up CI/CD

### Phase 2: Documentation Generators

1. [ ] Project-level generator
2. [ ] Module-level generator
3. [ ] File-level generator
4. [ ] Function-level generator

### Phase 3: AI Integration

1. [ ] OpenAI provider
2. [ ] Business context analysis
3. [ ] Documentation streaming
4. [ ] Validation and verification

### Phase 4: CLI and Integration

1. [ ] CLI implementation
2. [ ] IDE integration
3. [ ] CI/CD integration
4. [ ] Version control integration

## Testing Strategy

### Unit Tests

- Test each component in isolation
- Mock all external dependencies
- Test edge cases and error conditions
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests

- Test component interactions
- Test with real file system
- Test with mock AI provider
- Test error handling
- Test performance

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Development Workflow

1. Write failing test
2. Implement minimum code to pass
3. Refactor
4. Generate documentation
5. Commit changes
6. Push to remote

## Git Workflow

### Branch Naming

- feature/feature-name
- bugfix/bug-name
- refactor/component-name
- docs/documentation-name

### Commit Messages

- Use present tense
- Start with verb
- Be specific
- Reference issue if applicable

## Code Review Checklist

- [ ] Tests pass
- [ ] Code is typed
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] Error handling is proper
- [ ] Performance is considered
- [ ] Security is considered

## Performance Considerations

- Minimize API calls
- Cache results where possible
- Use streaming for large documents
- Optimize file system operations
- Consider memory usage

## Security Considerations

- Never log sensitive data
- Validate all inputs
- Sanitize all outputs
- Use environment variables for secrets
- Follow least privilege principle

## Error Handling

- Use custom error types
- Provide helpful error messages
- Log errors appropriately
- Handle edge cases
- Test error scenarios

## Documentation Standards

### Code Comments

- Use JSDoc for public APIs
- Explain why, not what
- Document complex logic
- Flag technical debt
- Reference related code

### README Updates

- Update with new features
- Document breaking changes
- Add usage examples
- Update configuration options
- Document known issues

## Progress Tracking

### Current Focus

- [ ] Core infrastructure
- [ ] Testing setup
- [ ] Mock providers
- [ ] Documentation generators

### Next Steps

1. [ ] Set up project structure
2. [ ] Configure TypeScript
3. [ ] Set up testing framework
4. [ ] Create core interfaces

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Node.js Documentation](https://nodejs.org/en/docs/)
