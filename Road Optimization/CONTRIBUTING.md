# Contributing to Road Optimizer

Thank you for your interest in contributing to Road Optimizer! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Issue Guidelines](#issue-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them learn
- **Be collaborative**: Work together towards common goals
- **Be constructive**: Provide helpful feedback and suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- Code editor (VS Code recommended)

### Local Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Road-Optimizer.git
   cd Road-Optimizer
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/naimulhaque214/Road-Optimizer.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔄 Development Process

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch for new features
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

### Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add new route optimization algorithm"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows our style guidelines
- [ ] Self-review of the code completed
- [ ] Comments added to hard-to-understand areas
- [ ] Tests added for new functionality
- [ ] All tests pass locally
- [ ] Documentation updated if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added
- [ ] Documentation updated
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` types when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types and interfaces
- Implement proper error boundaries

### Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use CSS custom properties for theming

### File Structure

```
components/
├── ui/              # Reusable UI components
├── feature/         # Feature-specific components
└── common/          # Common components

services/            # Business logic and API calls
utils/              # Utility functions
types/              # TypeScript type definitions
hooks/              # Custom React hooks
```

### Naming Conventions

- **Components**: PascalCase (`MapComponent.tsx`)
- **Functions**: camelCase (`calculateDistance`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_POINTS`)
- **Files**: kebab-case for utilities, PascalCase for components

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for utility functions
- Test component behavior, not implementation
- Use descriptive test names
- Maintain >80% code coverage

### Integration Tests

- Test user workflows
- Test component interactions
- Mock external dependencies

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐛 Issue Guidelines

### Before Creating an Issue

- Search existing issues first
- Check if it's already fixed in the latest version
- Gather relevant information (browser, OS, steps to reproduce)

### Issue Types

- **🐛 Bug Report**: Something isn't working
- **✨ Feature Request**: New functionality
- **📚 Documentation**: Improvements to docs
- **🔧 Enhancement**: Improvements to existing features

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. iOS]
 - Browser: [e.g. chrome, safari]
 - Version: [e.g. 22]
```

## 🏷️ Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat: add genetic algorithm optimization
fix: resolve map rendering issue on mobile
docs: update installation instructions
style: format code with prettier
refactor: extract route calculation logic
test: add unit tests for genetic algorithm
chore: update dependencies
```

## 🚀 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release PR to `main`
4. Tag release after merge
5. Deploy to production

## 🆘 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Email**: For security issues or private matters

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Given credit in relevant documentation

Thank you for contributing to Road Optimizer! 🚀