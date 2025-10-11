import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Route Error Boundary caught an error:', error, errorInfo);
    this.setState({ error });
  }

  private reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    const containerClass = "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4";
    const cardClass = "bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full";
    const buttonClass = "font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center";

    return (
      <div className={containerClass}>
        <div className={cardClass}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Something went wrong while loading this page. Please try again.</p>
            
            <div className="space-y-3">
              <button onClick={this.reset} className={`w-full bg-purple-600 hover:bg-purple-700 text-white ${buttonClass}`}>
                <RefreshCw className="h-5 w-5 mr-2" />Try Again
              </button>
              <div className="flex space-x-3">
                <button onClick={() => window.history.back()} className={`flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 ${buttonClass}`}>
                  <ArrowLeft className="h-5 w-5 mr-2" />Go Back
                </button>
                <button onClick={() => window.location.href = '/'} className={`flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 ${buttonClass}`}>
                  <Home className="h-5 w-5 mr-2" />Home
                </button>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Error Details (Development Only)</summary>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-40">
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

export default RouteErrorBoundary;
