"use client";

import { Component, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
          <div className="border border-surface-border bg-black/80 backdrop-blur-xl p-8 rounded-lg max-w-md">
            <h2 className="text-xl font-bold uppercase tracking-street text-white mb-4">
              Произошла ошибка
            </h2>
            <p className="text-sm text-muted mb-6">
              Что-то пошло не так. Попробуйте обновить страницу.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full bg-white py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-gray-200 transition-colors rounded"
            >
              Обновить страницу
            </button>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4">
                <summary className="text-xs text-muted cursor-pointer">
                  Технические детали
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}