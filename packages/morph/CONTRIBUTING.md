# Contributing to @c13/morph-sdk

Thank you for your interest in contributing to the Morph SDK! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/morph-sdk.git
   cd morph-sdk
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Run tests to ensure everything works:
   ```bash
   pnpm test
   ```

## Development Workflow

### Code Style

We use Prettier and ESLint to maintain consistent code style:

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Testing

- Write tests for all new functionality
- Ensure existing tests pass
- Aim for high test coverage

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Type Checking

Ensure TypeScript compilation passes:

```bash
pnpm type-check
```

## Commit Guidelines

We follow [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add support for custom token contracts
fix: resolve wallet connection timeout issue
docs: update API reference for token transfers
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass and code is properly formatted
5. Update documentation if needed
6. Submit a pull request with a clear description

### Pull Request Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Code is formatted (`pnpm format:check`)
- [ ] No linting errors (`pnpm lint`)
- [ ] TypeScript compiles (`pnpm type-check`)
- [ ] Documentation updated (if applicable)
- [ ] CHANGELOG.md updated (if applicable)

## Project Structure

```
src/
├── chains/          # Blockchain network configurations
├── providers/       # React context providers
├── tokens/          # Token-related functionality
├── utils/           # Utility functions
├── wallets/         # Wallet integration
└── index.ts         # Main export file
```

## Adding New Features

### New Chain Support

1. Add chain configuration in `src/chains/`
2. Export from `src/chains/index.ts`
3. Add tests in `test/chains.spec.ts`
4. Update documentation

### New Wallet Integration

1. Create wallet hook in `src/wallets/`
2. Follow existing patterns for error handling
3. Add comprehensive tests
4. Update provider if needed

### New Token Operations

1. Add functionality to `src/tokens/`
2. Include proper validation
3. Add error handling
4. Write tests and documentation

## Code Quality Standards

- Use TypeScript strict mode
- Follow existing patterns and conventions
- Write clear, self-documenting code
- Include JSDoc comments for public APIs
- Handle errors gracefully
- Validate inputs appropriately

## Questions or Issues?

- Check existing [issues](https://github.com/c13/morph-sdk/issues)
- Start a [discussion](https://github.com/c13/morph-sdk/discussions)
- Contact the maintainers

Thank you for contributing to @c13/morph-sdk!
