"use client";

import { useReWire } from "../ClientApp";
import type { AppView } from "@/types";
import Dashboard from "../dashboard/DashboardView";
import AssessmentHub from "../assessment/AssessmentHub";
import ExerciseHub from "../exercises/ExerciseHub";
import NeuralGraph from "../graph/NeuralGraph";
import { ErrorBoundary } from "../ui/ErrorFallback";

const NAV_ITEMS: { view: AppView; label: string; icon: React.ReactNode }[] = [
  {
    view: "dashboard",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L18 10H16V17H12V12H8V17H4V10H2L10 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    view: "assess",
    label: "Assess",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    view: "exercises",
    label: "Exercise",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    view: "graph",
    label: "Brain",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="8" x2="5" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="8" x2="15" y2="12" stroke="currentColor" strokeWidth="1" />
        <line x1="7" y1="14" x2="13" y2="14" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function AppShell() {
  const { currentView, setCurrentView, syncStatus, lastCID } = useReWire();

  return (
    <div className="min-h-screen flex flex-col relative z-[1]">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <h1 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
            <img src="/logo.jpg" alt="ReWire" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            <span>
              <span style={{ color: 'var(--gold)' }}>Re</span>
              <span style={{ color: 'var(--text-primary)' }}>Wire</span>
            </span>
          </h1>
          <div className="flex items-center gap-3">
            {lastCID && (
              <span
                className="max-w-[80px] truncate"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}
              >
                {lastCID.slice(0, 12)}
              </span>
            )}
            <span
              className="w-2 h-2 shrink-0"
              style={{
                background: syncStatus === "synced"
                  ? 'var(--gold)'
                  : syncStatus === "syncing"
                  ? 'var(--coral)'
                  : syncStatus === "error"
                  ? 'var(--coral)'
                  : 'var(--text-muted)',
                transform: 'rotate(45deg)',
              }}
              role="status"
              aria-label={`Storacha sync: ${syncStatus}`}
            />
          </div>
        </div>
      </header>

      {/* Content — brain map gets full width for impact */}
      {currentView === "graph" ? (
        <main className="flex-1 w-full px-5 py-6 pb-safe relative z-[1]" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ErrorBoundary fallbackMessage="Brain map failed to render">
            <NeuralGraph />
          </ErrorBoundary>
        </main>
      ) : (
        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 pb-safe relative z-[1]">
          {currentView === "dashboard" && <Dashboard />}
          {currentView === "assess" && <ErrorBoundary fallbackMessage="Assessment failed"><AssessmentHub /></ErrorBoundary>}
          {currentView === "exercises" && <ExerciseHub />}
        </main>
      )}

      {/* Logo watermark — bottom left, covers browser extension badges */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{ bottom: '62px', left: '8px' }}
      >
        <img src="/logo.jpg" alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', opacity: 0.9 }} />
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}
        aria-label="Main navigation"
      >
        <div className="max-w-lg mx-auto flex">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                aria-current={isActive ? "page" : undefined}
                className="flex-1 flex flex-col items-center justify-center min-h-[56px] relative"
                style={{
                  color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase' as const,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 150ms',
                }}
              >
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    style={{ width: '20px', height: '2px', background: 'var(--gold)' }}
                  />
                )}
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
