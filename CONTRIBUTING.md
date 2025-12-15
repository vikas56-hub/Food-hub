# Contributing to S.H.I.E.L.D. Food Hub

Thank you for your interest in contributing to S.H.I.E.L.D. Food Hub! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 8+
- Git

### Setup Development Environment
1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm run setup`
4. Start development servers: `npm run dev`

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting and naming conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Use conventional commit format:
```
type(scope): description

Examples:
feat(auth): add password reset functionality
fix(orders): resolve checkout validation issue
docs(readme): update installation instructions
```

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests (when available)
cd client && npm test
```

### Writing Tests
- Write unit tests for new functions
- Add integration tests for API endpoints
- Test both success and error scenarios

## 📝 Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

### PR Review Checklist
- [ ] Code follows project conventions
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
- [ ] Security considerations addressed

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment**: OS, Node.js version, browser
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Error messages** or logs

## 💡 Feature Requests

For new features:
- **Describe the problem** you're trying to solve
- **Propose a solution** with implementation details
- **Consider alternatives** and their trade-offs
- **Discuss impact** on existing functionality

## 🏗 Architecture Guidelines

### Backend (NestJS)
- Use modules to organize related functionality
- Implement proper error handling
- Follow RBAC patterns for new endpoints
- Validate all inputs
- Use Prisma for database operations

### Frontend (Next.js)
- Use TypeScript interfaces for data structures
- Implement proper error boundaries
- Follow the existing component structure
- Use the established design system
- Ensure responsive design

### Database
- Use Prisma migrations for schema changes
- Include proper indexes for performance
- Follow naming conventions
- Add seed data for new entities

## 🔒 Security Guidelines

- Never commit sensitive data (passwords, keys, tokens)
- Validate and sanitize all user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Follow OWASP security guidelines

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Provide constructive feedback

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

Thank you for contributing to S.H.I.E.L.D. Food Hub! 🦸‍♂️