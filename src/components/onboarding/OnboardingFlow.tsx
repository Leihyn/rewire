"use client";

import { useState } from "react";
import { useReWire } from "../ClientApp";
import { createDefaultMemory } from "@/lib/storacha/agent-memory";
import { setOnboardingComplete, setStorachaEmail } from "@/lib/storage";
import type { ConditionType, PatientProfile } from "@/types";
import { CONDITION_LABELS } from "@/types";
import { loginToStoracha, createSpace } from "@/lib/storacha/client";
import { getDefaultGraphState } from "@/data/brain-regions";
import { createDemoMemory } from "@/data/demo-data";

type Step = "welcome" | "profile" | "storacha" | "ready";

export default function OnboardingFlow() {
  const { setMemory, setStorachaConnected } = useReWire();
  const [step, setStep] = useState<Step>("welcome");
  const [name, setName] = useState("");
  const [condition, setCondition] = useState<ConditionType>("stroke");
  const [affectedSide, setAffectedSide] = useState<"left" | "right" | "bilateral">("left");
  const [goals, setGoals] = useState("");
  const [email, setEmail] = useState("");
  const [storachaLoading, setStorachaLoading] = useState(false);
  const [storachaError, setStorachaError] = useState("");
  const [storachaWaiting, setStorachaWaiting] = useState(false);
  const [skippedStoracha, setSkippedStoracha] = useState(false);

  function handleCreateProfile() {
    if (!name.trim()) return;
    setStep("storacha");
  }

  async function handleConnectStoracha() {
    if (!email.trim()) return;
    setStorachaLoading(true);
    setStorachaError("");

    try {
      setStorachaWaiting(true);
      const account = await loginToStoracha(email);
      setStorachaWaiting(false);
      await createSpace(`rewire-${name.toLowerCase().replace(/\s+/g, "-")}`, account);
      setStorachaEmail(email);
      setStorachaConnected(true);
      finishOnboarding();
    } catch (err) {
      setStorachaWaiting(false);
      setStorachaError(
        err instanceof Error ? err.message : "Failed to connect. Try again."
      );
    } finally {
      setStorachaLoading(false);
    }
  }

  function handleSkipStoracha() {
    setSkippedStoracha(true);
    finishOnboarding();
  }

  function finishOnboarding() {
    const profile: PatientProfile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      condition,
      affectedSide,
      onsetDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      goals: goals
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
    };

    const memory = createDefaultMemory(profile);
    memory.graphState = getDefaultGraphState();
    setMemory(memory);
    setOnboardingComplete();
    setStep("ready");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-md">
        {step === "welcome" && (
          <div className="animate-fade-in text-center">
            <div className="mb-8">
              <img src="/logo.jpg" alt="ReWire" style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 16px' }} />
              <h1
                className="text-4xl font-bold mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.5px', color: '#f5f0e8' }}
              >
                <span style={{ color: '#D4AF37' }}>Re</span>
                <span style={{ color: '#f5f0e8' }}>Wire</span>
              </h1>
              <p style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888', fontSize: '14px' }}>
                Neuroplasticity-powered rehabilitation
              </p>
            </div>

            <div className="space-y-4 text-left mb-8">
              <div
                className="p-4"
                style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
              >
                <h3 className="font-medium mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#D4AF37' }}>Track Recovery</h3>
                <p style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888', fontSize: '14px' }}>
                  Record neurological and motor function with guided assessments
                </p>
              </div>
              <div
                className="p-4"
                style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
              >
                <h3 className="font-medium mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#D4AF37' }}>Adaptive Rehab</h3>
                <p style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888', fontSize: '14px' }}>
                  Exercises that adapt to your recovery using neuroplasticity principles
                </p>
              </div>
              <div
                className="p-4"
                style={{ background: '#141414', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '2px' }}
              >
                <h3 className="font-medium mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#D4AF37' }}>Own Your Data</h3>
                <p style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888', fontSize: '14px' }}>
                  Your neural data stored on decentralized Storacha storage you control
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep("profile")}
              className="w-full py-3 active:scale-[0.98]"
              style={{
                background: '#D4AF37',
                color: '#0a0a0a',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                borderRadius: '2px',
                border: 'none',
                transition: 'all 150ms ease-out',
              }}
            >
              Get Started
            </button>
            <button
              onClick={() => {
                const demo = createDemoMemory();
                setMemory(demo);
                setOnboardingComplete();
                window.location.reload();
              }}
              className="w-full py-3 mt-3 min-h-[44px] active:scale-[0.98]"
              style={{
                background: 'transparent',
                color: '#D4AF37',
                fontFamily: 'Space Mono, monospace',
                fontSize: '12px',
                letterSpacing: '1px',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '2px',
                transition: 'all 150ms ease-out',
                cursor: 'pointer',
                textTransform: 'uppercase' as const,
              }}
            >
              Launch Demo Mode
            </button>
          </div>
        )}

        {step === "profile" && (
          <div className="animate-fade-in">
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
            >
              Your Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  className="mb-1 block"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 focus:outline-none"
                  style={{
                    background: '#141414',
                    border: '1px solid rgba(212,175,55,0.12)',
                    borderRadius: '2px',
                    color: '#f5f0e8',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                />
              </div>

              <div>
                <label
                  className="mb-1 block"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
                >
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ConditionType)}
                  className="w-full px-4 py-3 focus:outline-none"
                  style={{
                    background: '#141414',
                    border: '1px solid rgba(212,175,55,0.12)',
                    borderRadius: '2px',
                    color: '#f5f0e8',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                >
                  {Object.entries(CONDITION_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="mb-1 block"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
                >
                  Affected Side
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["left", "right", "bilateral"] as const).map((side) => (
                    <button
                      key={side}
                      onClick={() => setAffectedSide(side)}
                      className="min-h-[44px] py-2.5 text-sm font-medium capitalize"
                      style={{
                        background: affectedSide === side ? '#D4AF37' : '#141414',
                        color: affectedSide === side ? '#0a0a0a' : '#a09888',
                        border: affectedSide === side ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.12)',
                        borderRadius: '2px',
                        fontFamily: 'Space Grotesk, sans-serif',
                        transition: 'all 150ms ease-out',
                      }}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="mb-1 block"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
                >
                  Recovery Goals (comma-separated)
                </label>
                <input
                  type="text"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Improve grip, Walk independently"
                  className="w-full px-4 py-3 focus:outline-none"
                  style={{
                    background: '#141414',
                    border: '1px solid rgba(212,175,55,0.12)',
                    borderRadius: '2px',
                    color: '#f5f0e8',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleCreateProfile}
              disabled={!name.trim()}
              className="w-full mt-6 py-3 active:scale-[0.98]"
              style={{
                background: name.trim() ? '#D4AF37' : '#1e1e1e',
                color: name.trim() ? '#0a0a0a' : '#5a5248',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                borderRadius: '2px',
                border: 'none',
                transition: 'all 150ms ease-out',
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === "storacha" && (
          <div className="animate-fade-in">
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
            >
              Connect Storacha
            </h2>
            <p className="text-sm mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
              Store your rehab data on decentralized storage. Access it from any
              device, and own it forever.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  className="mb-1 block"
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#5a5248' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 focus:outline-none"
                  style={{
                    background: '#141414',
                    border: '1px solid rgba(212,175,55,0.12)',
                    borderRadius: '2px',
                    color: '#f5f0e8',
                    fontFamily: 'Outfit, sans-serif',
                  }}
                />
              </div>

              {storachaError && (
                <p className="text-sm" style={{ color: '#FF6B6B' }}>{storachaError}</p>
              )}

              <button
                onClick={handleConnectStoracha}
                disabled={!email.trim() || storachaLoading}
                className="w-full py-3 active:scale-[0.98]"
                style={{
                  background: email.trim() && !storachaLoading ? '#D4AF37' : '#1e1e1e',
                  color: email.trim() && !storachaLoading ? '#0a0a0a' : '#5a5248',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  borderRadius: '2px',
                  border: 'none',
                  transition: 'all 150ms ease-out',
                }}
              >
                {storachaLoading
                  ? storachaWaiting
                    ? "Check your email..."
                    : "Connecting..."
                  : "Connect & Store"}
              </button>

              {storachaWaiting && (
                <div className="p-3 mt-2" style={{ background: 'var(--gold-dim)', border: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    Verification email sent to <strong>{email}</strong>. Click the link in your inbox to continue. This page will update automatically.
                  </p>
                </div>
              )}

              <button
                onClick={handleSkipStoracha}
                className="w-full min-h-[44px] py-2.5 text-sm"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#5a5248',
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'color 150ms ease-out',
                }}
              >
                Skip for now (local storage only)
              </button>
            </div>
          </div>
        )}

        {step === "ready" && (
          <div className="animate-fade-in text-center">
            <div
              className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(212,175,55,0.15)', borderRadius: '2px' }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" stroke="#D4AF37" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: '-0.5px', color: '#f5f0e8' }}
            >
              You&apos;re Ready
            </h2>
            <p className="text-sm mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#a09888' }}>
              Hi {name}. ReWire is set up
              {skippedStoracha
                ? " with local storage."
                : " with Storacha decentralized storage."}
            </p>
            <p className="text-xs mb-6" style={{ fontFamily: 'Outfit, sans-serif', color: '#5a5248' }}>
              Start with an assessment to establish your baseline.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 active:scale-[0.98]"
              style={{
                background: '#D4AF37',
                color: '#0a0a0a',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                borderRadius: '2px',
                border: 'none',
                transition: 'all 150ms ease-out',
              }}
            >
              Enter ReWire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
