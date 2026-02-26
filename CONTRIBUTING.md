# Contributing to Vet Claim Support

Thank you for your interest in contributing to Vet Claim Support! This guide will help you get started.

## Code of Conduct

This project is dedicated to helping veterans. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10+
- Git

### Local Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vetclaimsupport.git
   cd vetclaimsupport
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:8080 in your browser

### Environment Variables

For Supabase integration (optional), create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode is enabled. All code must pass type checking.
- **React**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes and the existing design system
- **Components**: Follow the shadcn/ui component patterns

### File Structure

```
src/
├── components/     # React components
│   ├── ui/         # shadcn/ui base components
│   └── [feature]/  # Feature-specific components
├── context/        # React Context providers
├── data/           # Static reference data
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries
├── pages/          # Route page components
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: camelCase with `use` prefix (`useMyHook.ts`)
- **Utils**: camelCase (`myUtility.ts`)
- **Types**: PascalCase (`MyType.ts`)
- **CSS classes**: kebab-case in Tailwind

### Component Guidelines

1. **Keep components focused**: One component, one responsibility
2. **Extract hooks**: Complex logic should be in custom hooks
3. **Use TypeScript**: Define prop types for all components
4. **Accessibility**: Follow WCAG guidelines (proper labels, ARIA attributes)

Example component:

```tsx
interface MyComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

export function MyComponent({ title, onAction, className = '' }: MyComponentProps) {
  return (
    <div className={`my-component ${className}`}>
      <h2>{title}</h2>
      {onAction && (
        <button onClick={onAction}>Action</button>
      )}
    </div>
  );
}
```

### Privacy Considerations

This app prioritizes user privacy:

- **No external tracking**: Never add analytics or tracking
- **Local storage only**: Data stays on the user's device
- **No unnecessary requests**: Minimize network calls
- **Clear disclosure**: Be transparent about any data usage

## Making Changes

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

Example: `feature/add-sleep-tracking`

### Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example: `feat: add migraine severity tracking`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
4. Push your branch and create a PR
5. Fill out the PR template
6. Request review

### Quality Gates (CI enforced)

Every push and PR must pass all of these:

```bash
# TypeScript — zero errors
npx tsc --noEmit

# ESLint — zero errors, zero warnings
npx eslint src/ --max-warnings 0

# Tests — 100% pass rate
npx vitest run

# Production build — zero errors
npx vite build

# Security — zero high/critical vulnerabilities
npm audit --audit-level=high
```

CI runs these automatically via GitHub Actions on every push to `main` and on all pull requests.

### PR Checklist

- [ ] All quality gates pass locally
- [ ] TypeScript types are properly defined
- [ ] Tests pass (`npx vitest run`)
- [ ] Build succeeds (`npx vite build`)
- [ ] No console errors or warnings
- [ ] Veteran-facing text uses plain English (no CFR citations, diagnostic codes, or jargon)
- [ ] Mobile-responsive design
- [ ] Accessibility considered (WCAG 2.1 AA)

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

### Writing Tests

- Place test files next to the code they test: `MyComponent.test.tsx`
- Or in the `src/test/` directory for integration tests
- Use descriptive test names

```tsx
describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

## Reporting Issues

### Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/device information
- Screenshots if applicable

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Any relevant examples

## Questions?

- Open an issue for technical questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for helping veterans with their disability claims!
