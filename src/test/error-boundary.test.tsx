/**
 * ErrorBoundary Tests
 *
 * Validates the class-based ErrorBoundary component: normal rendering,
 * error UI with "Something went wrong" / "Try Again", custom fallback,
 * and reset behavior.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Suppress React / ErrorBoundary console.error noise during intentional throws
vi.spyOn(console, 'error').mockImplementation(() => {});

/** Helper that throws on demand so we can toggle error state. */
let shouldThrow = false;
const ThrowOnDemand = () => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Child rendered successfully</div>;
};

describe('ErrorBoundary', () => {
  // Reset the throw flag before each test
  beforeEach(() => {
    shouldThrow = false;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowOnDemand />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Child rendered successfully')).toBeInTheDocument();
  });

  it('shows "Something went wrong" when a child throws', () => {
    shouldThrow = true;

    render(
      <ErrorBoundary>
        <ThrowOnDemand />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows "Try Again" button when an error occurs', () => {
    shouldThrow = true;

    render(
      <ErrorBoundary>
        <ThrowOnDemand />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('shows custom fallback when provided', () => {
    shouldThrow = true;

    render(
      <ErrorBoundary fallback={<div>Custom fallback UI</div>}>
        <ThrowOnDemand />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
    // Default error UI should NOT appear
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('resets error state when Try Again is clicked', () => {
    shouldThrow = true;

    render(
      <ErrorBoundary>
        <ThrowOnDemand />
      </ErrorBoundary>,
    );

    // Error UI is shown
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Stop throwing so the re-render succeeds
    shouldThrow = false;

    fireEvent.click(screen.getByText('Try Again'));

    // After reset, the child should render again
    expect(screen.getByText('Child rendered successfully')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
