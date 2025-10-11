import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRecovering: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private recoveryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isRecovering: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({ error });
    this.attemptRecovery();
  }

  private attemptRecovery = () => {
    this.setState({ isRecovering: true });
    this.recoveryTimer = setTimeout(() => {
      this.setState({ hasError: false, error: null, isRecovering: false });
    }, 3000);
  };

  private reset = () => {
    this.setState({ hasError: false, error: null, isRecovering: false });
  };

  componentWillUnmount() {
    if (this.recoveryTimer) clearTimeout(this.recoveryTimer);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const containerClass = "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 flex items-center justify-center p-4";
    const cardClass = "bg-white rounded-2xl shadow-xl p-8 max-w-md w-full";

    if (this.state.isRecovering) {
      return (
        <div className={containerClass}>
          <div className={`${cardClass} text-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">⚠️ Recovering from an error… Please wait.</h2>
            <p className="text-gray-600">We're automatically fixing the issue. This should only take a moment.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={containerClass}>
        <div className={cardClass}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We encountered an unexpected error. Please try again.</p>
            
            <div className="space-y-3">
              <button onClick={this.reset} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 mr-2" />Try Again
              </button>
              <button onClick={() => window.location.href = '/'} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center">
                <Home className="h-5 w-5 mr-2" />Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">Error Details (Development Only)</summary>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg text-xs font-mono text-gray-700 overflow-auto max-h-40">
                  <div className="mb-2"><strong>Error:</strong> {this.state.error.message}</div>
                  <div className="mb-2"><strong>Stack:</strong><pre className="whitespace-pre-wrap">{this.state.error.stack}</pre></div>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
