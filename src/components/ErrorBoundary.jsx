import React from 'react';
import logger from '../utils/logger';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logger.error("ErrorBoundary atrapó un error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-red-400 p-10 font-mono">
          <h2 className="text-2xl font-bold mb-4">🚨 Error del Sistema</h2>
          <p className="text-zinc-500 mb-6">Tómale captura y envíasela al developer.</p>
          <pre className="bg-black/60 border border-red-500/30 rounded-xl p-6 text-sm max-w-2xl overflow-x-auto mb-4">
            {this.state.error?.toString()}
          </pre>
          <pre className="text-red-300/60 text-xs max-w-2xl overflow-x-auto mb-6">
            {this.state.info?.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
          >
            RECARGAR
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
