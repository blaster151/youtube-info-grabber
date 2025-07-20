# Contributing to YouTube Info Grabber

Thank you for your interest in contributing to YouTube Info Grabber! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Build the extension**: `npm run build`
4. **Run tests**: `npm test`
5. **Load in Chrome**: Go to `chrome://extensions/`, enable Developer mode, and load the `dist` folder

## Development Workflow

### Making Changes

1. Create a feature branch from `master`
2. Make your changes
3. Add tests for new functionality
4. Run the test suite: `npm test`
5. Build the extension: `npm run build`
6. Test the extension manually in Chrome
7. Commit your changes with a descriptive message

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### Testing

- Write unit tests for all new functionality
- Ensure all tests pass before submitting
- Test the extension manually in Chrome
- Consider edge cases and error conditions

### Commit Messages

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(content): add support for playlist duration calculation`
- `fix(background): resolve message handling error`
- `docs(readme): update installation instructions`

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update the README** if adding new features
5. **Submit a pull request** with a clear description

## Testing Guidelines

### Unit Tests
- Test utility functions thoroughly
- Mock Chrome APIs appropriately
- Test both success and error cases
- Use descriptive test names

### Manual Testing
- Test on different YouTube pages
- Verify clipboard functionality
- Check popup interface
- Test with different video/playlist types

## Chrome Extension Best Practices

- Follow Manifest V3 guidelines
- Use appropriate permissions
- Handle errors gracefully
- Provide user feedback
- Respect user privacy

## Questions or Issues?

If you have questions or encounter issues:
1. Check the existing issues
2. Create a new issue with details
3. Join discussions in existing issues

Thank you for contributing! 