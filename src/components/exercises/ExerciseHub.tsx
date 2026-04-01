"use client";

import { useState, useMemo } from "react";
import { useReWire } from "../ClientApp";
import { getRecommendations } from "@/lib/agent/engine";
import { EXERCISES } from "@/data/exercises";
import type { Exercise, ExerciseCategory } from "@/types";
import ExerciseGuide from "./ExerciseGuide";

const CATEGORY_BADGE_STYLES: Record<
  ExerciseCategory,
  { background: string; color: string; border: string }
> = {
  motor: {
    background: "rgba(13,115,119,0.15)",
    color: "#15999e",
    border: "1px solid rgba(13,115,119,0.3)",
  },
  cognitive: {
    background: "rgba(255,107,107,0.15)",
    color: "#FF6B6B",
    border: "1px solid rgba(255,107,107,0.3)",
  },
  sensory: {
    background: "rgba(212,175,55,0.15)",
    color: "#D4AF37",
    border: "1px solid rgba(212,175,55,0.3)",
  },
};

export default function ExerciseHub() {
  const { memory } = useReWire();
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [filter, setFilter] = useState<ExerciseCategory | "all">("all");

  const recommendations = useMemo(
    () => (memory ? getRecommendations(memory) : null),
    [memory]
  );

  if (!memory) return null;

  if (activeExercise) {
    return (
      <ExerciseGuide
        exercise={activeExercise}
        onBack={() => setActiveExercise(null)}
      />
    );
  }

  const filtered =
    filter === "all"
      ? EXERCISES
      : EXERCISES.filter((e) => e.category === filter);

  const recommendedIds = new Set(
    recommendations?.exercises.map((e) => e.id) ?? []
  );

  return (
    <div className="animate-fade-in">
      <h2
        className="text-xl mb-1"
        style={{
          fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "#f5f0e8",
        }}
      >
        Exercises
      </h2>
      <p
        className="text-sm mb-4"
        style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          color: "#a09888",
        }}
      >
        Neuroplasticity-driven rehabilitation exercises
      </p>

      {/* Recommended */}
      {recommendations && recommendations.exercises.length > 0 && (
        <div className="mb-6">
          <h3
            className="mb-2"
            style={{
              fontFamily: "var(--font-mono, 'Space Mono', monospace)",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#5a5248",
            }}
          >
            Recommended for You
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recommendations.exercises.map((ex) => {
              const badge = CATEGORY_BADGE_STYLES[ex.category];
              return (
                <button
                  key={ex.id}
                  onClick={() => setActiveExercise(ex)}
                  className="flex-shrink-0 w-40 p-3 text-left transition-all duration-150 ease-out active:scale-[0.98]"
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    border: "1px solid rgba(212,175,55,0.12)",
                    borderRadius: "0px",
                  }}
                >
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: badge.background,
                      color: badge.color,
                      border: badge.border,
                      fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                    }}
                  >
                    {ex.category}
                  </span>
                  <h4
                    className="text-sm mt-2 leading-tight"
                    style={{
                      fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                      fontWeight: 600,
                      color: "#f5f0e8",
                    }}
                  >
                    {ex.name}
                  </h4>
                  <p
                    className="text-[10px] mt-1"
                    style={{
                      fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                      color: "#5a5248",
                    }}
                  >
                    {Math.ceil(ex.durationSeconds / 60)} min
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(["all", "motor", "cognitive", "sensory"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-4 py-2 text-xs transition-all duration-150 ease-out active:scale-[0.98]"
            style={{
              background: filter === cat ? "#1e1e1e" : "#141414",
              color: filter === cat ? "#f5f0e8" : "#5a5248",
              border: "1px solid rgba(212,175,55,0.12)",
              borderRadius: "0px",
              fontFamily: "var(--font-mono, 'Space Mono', monospace)",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 500,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <div className="space-y-2">
        {filtered.map((ex) => {
          const params = memory.exerciseParams[ex.id];
          const isRecommended = recommendedIds.has(ex.id);
          const badge = CATEGORY_BADGE_STYLES[ex.category];

          return (
            <button
              key={ex.id}
              onClick={() => setActiveExercise(ex)}
              className="w-full p-4 text-left transition-all duration-150 ease-out active:scale-[0.98]"
              style={{
                background: "#141414",
                border: isRecommended
                  ? "1px solid rgba(212,175,55,0.3)"
                  : "1px solid rgba(212,175,55,0.12)",
                borderRadius: "0px",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-sm"
                      style={{
                        fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
                        fontWeight: 600,
                        color: "#f5f0e8",
                      }}
                    >
                      {ex.name}
                    </h3>
                    {isRecommended && (
                      <span
                        className="text-[10px] px-1.5 py-0.5"
                        style={{
                          background: "#D4AF37",
                          color: "#0a0a0a",
                          borderRadius: "0px",
                          fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                          fontWeight: 600,
                        }}
                      >
                        REC
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs line-clamp-1"
                    style={{
                      fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                      color: "#5a5248",
                    }}
                  >
                    {ex.description}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: badge.background,
                      color: badge.color,
                      border: badge.border,
                      fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                    }}
                  >
                    {ex.category}
                  </span>
                  {params && (
                    <p
                      className="text-[10px] mt-1"
                      style={{
                        fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                        color: "#5a5248",
                      }}
                    >
                      Lvl {params.currentDifficulty}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
