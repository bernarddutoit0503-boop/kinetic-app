import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  declare state: State;
  declare props: Props;

  constructor(props: Props) {
    super(props);
    (this as { state: State }).state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Kinetic Error Boundary caught:', error);
  }

  render() {
    if ((this as { state: State }).state.hasError) {
      return (this as { props: Props }).props.fallback ?? (
        <div className="p-8 text-center opacity-60">
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary">SIGNAL LOST</p>
          <p className="font-body text-sm text-on-surface-variant mt-2">This sector failed to initialize.</p>
        </div>
      );
    }
    return (this as { props: Props }).props.children;
  }
}
