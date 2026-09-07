import { Component } from "react";

// Generic error boundary. React can only catch render/lifecycle errors from a
// class component, so this is the one class left in the codebase.
//
// Used to wrap every <Canvas>. Two very different failures land here:
//   1. three.js can't create a WebGL context, and throws during render.
//   2. Something inside the canvas tree throws — most often a GLTF model that
//      404s or fails to parse. r3f has its own inner boundary that catches
//      those and rethrows them outside <Canvas> (see `if (error) throw error`
//      in CanvasImpl), so they surface here too.
// Without this, either one unmounts the whole <App>.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep it quiet in production — a missing 3D background is not worth a
    // console full of red for a visitor.
    if (import.meta.env.DEV) {
      console.warn("[ErrorBoundary] caught:", error?.message ?? error);
    }
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
