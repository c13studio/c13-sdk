# Contributing to C13 SDK

Thank you for your interest in contributing to the C13 SDK! 🎉

## Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/c13-sdk.git
   cd c13-sdk
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Build all packages:**
   ```bash
   pnpm build
   ```

4. **Run tests:**
   ```bash
   pnpm test
   ```

## Project Structure

```
c13-sdk/
├── packages/
│   └── morph/          # Morph blockchain SDK
└── (future packages)
```

## Making Changes

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the appropriate package

3. **Run tests:**
   ```bash
   cd packages/morph
   pnpm test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `test:` - Test changes
   - `chore:` - Maintenance tasks

5. **Push and create a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Use TypeScript for all code
- Follow the existing code style
- Run `pnpm lint` before committing
- Add tests for new features

## Questions?

Open an issue or reach out to the maintainers!

Thank you for contributing! 🙏

