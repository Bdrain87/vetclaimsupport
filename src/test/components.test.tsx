import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Mock console.error to prevent test output pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('ErrorBoundary Component', () => {
  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>No error</div>;
  };

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });
});

describe('Loading States', () => {
  it('should show loading indicator during async operations', () => {
    const LoadingComponent = ({ isLoading }: { isLoading: boolean }) => (
      <div>
        {isLoading ? (
          <div data-testid="loading">Loading...</div>
        ) : (
          <div data-testid="content">Content loaded</div>
        )}
      </div>
    );

    const { rerender } = render(<LoadingComponent isLoading={true} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    rerender(<LoadingComponent isLoading={false} />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('should disable buttons during form submission', () => {
    const SubmitButton = ({ isSubmitting }: { isSubmitting: boolean }) => (
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    );

    const { rerender } = render(<SubmitButton isSubmitting={false} />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();

    rerender(<SubmitButton isSubmitting={true} />);
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Submitting...');
  });
});

describe('Form Components', () => {
  it('should validate required fields', () => {
    const validateRequired = (value: string): boolean => {
      return value.trim().length > 0;
    };

    expect(validateRequired('valid')).toBe(true);
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('  ')).toBe(false);
  });

  it('should validate date ranges', () => {
    const validateDateRange = (start: Date, end: Date): boolean => {
      return start <= end;
    };

    const start = new Date('2024-01-01');
    const end = new Date('2024-12-31');
    const invalidEnd = new Date('2023-01-01');

    expect(validateDateRange(start, end)).toBe(true);
    expect(validateDateRange(start, invalidEnd)).toBe(false);
  });
});
