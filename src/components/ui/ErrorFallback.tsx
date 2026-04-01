"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallbackMessage?: string };
type State = { hasError: boolean; error: string };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 600, color: "var(--coral)", marginBottom: "8px" }}>
            {this.props.fallbackMessage ?? "Something went wrong"}
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
            {this.state.error}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: "" })}
            className="mt-4"
            style={{
              padding: "8px 16px", background: "var(--gold-dim)", border: "1px solid var(--border)",
              color: "var(--gold)", fontFamily: "var(--font-mono)", fontSize: "11px", cursor: "pointer",
              letterSpacing: "1px", textTransform: "uppercase" as const,
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
