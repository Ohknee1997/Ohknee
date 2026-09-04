import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }


  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('OHKNEE App caught runtime error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0d0f15] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#141824] border border-slate-800 shadow-2xl flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-xl font-bold text-slate-100 mb-2">Display Recovery</h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              The preview encountered a temporary browser rendering hiccup. Click below to refresh the view.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg transition-all cursor-pointer"
            >
              <RefreshCw size={16} />
              Reload Preview
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
