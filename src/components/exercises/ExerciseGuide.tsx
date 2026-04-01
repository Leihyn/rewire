"use client";

import { useState, useEffect, useRef } from "react";
import { useReWire } from "../ClientApp";
import type { Exercise, ExerciseLog } from "@/types";
import { getExerciseParams, adjustDifficulty } from "@/lib/agent/plasticity";

type Phase = "intro" | "active" | "rate" | "done";

export default function ExerciseGuide({
  exercise,
  onBack,
}: {
  exercise: Exercise;
  onBack: () => void;
}) {
  const { memory, addExerciseLog, updateMemory } = useReWire();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentRep, setCurrentRep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exercise.durationSeconds);
  const [painDuring, setPainDuring] = useState(0);
  const [effort, setEffort] = useState(3);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const params = memory
    ? getExerciseParams(memory, exercise.id, exercise.baseDifficulty)
    : null;
  const difficulty = params?.currentDifficulty ?? exercise.baseDifficulty;

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase("rate");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  function handleComplete() {
    if (!memory) return;

    const log: ExerciseLog = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      timestamp: new Date().toISOString(),
      completedReps: currentRep,
      difficultyAtTime: difficulty,
      painDuring,
      perceivedEffort: effort,
    };

    addExerciseLog(log);

    // Update exercise params
    const newParams = adjustDifficulty(
      params ?? {
        currentDifficulty: exercise.baseDifficulty,
        lastPerformed: null,
        streakDays: 0,
        spacingIntervalHours: 4,
        successRate: 0.5,
      },
      effort,
      painDuring
    );

    updateMemory({
      exerciseParams: {
        ...memory.exerciseParams,
        [exercise.id]: newParams,
      },
    });

    setPhase("done");
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  if (phase === "done") {
    return (
      <div className="animate-fade-in text-center py-12">
        <div
          className="text-4xl mb-4"
          style={{ color: "#D4AF37" }}
        >
          &#x21BB;
        </div>
        <h3
          className="text-lg mb-2"
          style={{
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "#f5f0e8",
          }}
        >
          Exercise Complete
        </h3>
        <p
          className="text-sm mb-1"
          style={{
            fontFamily: "var(--font-body, 'Outfit', sans-serif)",
            color: "#a09888",
          }}
        >
          {exercise.name}
        </p>
        <p
          className="text-xs mb-6"
          style={{
            fontFamily: "var(--font-mono, 'Space Mono', monospace)",
            color: "#5a5248",
          }}
        >
          {currentRep} reps at difficulty {difficulty}
        </p>
        <button
          onClick={onBack}
          className="text-sm min-h-[44px] transition-colors duration-150 ease-out"
          style={{
            color: "#D4AF37",
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontWeight: 600,
            background: "none",
            border: "none",
          }}
        >
          Back to Exercises
        </button>
      </div>
    );
  }

  if (phase === "rate") {
    return (
      <div className="animate-fade-in">
        <h2
          className="text-xl mb-6"
          style={{
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "#f5f0e8",
          }}
        >
          How was it?
        </h2>

        <div className="space-y-6">
          <div>
            <label
              className="text-sm mb-2 block"
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                color: "#a09888",
              }}
            >
              Reps Completed:{" "}
              <span style={{ fontFamily: "var(--font-mono, 'Space Mono', monospace)", color: "#f5f0e8" }}>
                {currentRep}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={exercise.repetitions * 2}
              value={currentRep}
              onChange={(e) => setCurrentRep(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#D4AF37" }}
            />
          </div>

          <div>
            <label
              className="text-sm mb-2 block"
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                color: "#a09888",
              }}
            >
              Pain During:{" "}
              <span style={{ fontFamily: "var(--font-mono, 'Space Mono', monospace)", color: "#FF6B6B" }}>
                {painDuring}/10
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={10}
              value={painDuring}
              onChange={(e) => setPainDuring(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#FF6B6B" }}
            />
          </div>

          <div>
            <label
              className="text-sm mb-2 block"
              style={{
                fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                color: "#a09888",
              }}
            >
              Perceived Effort:{" "}
              <span style={{ fontFamily: "var(--font-mono, 'Space Mono', monospace)", color: "#f5f0e8" }}>
                {effort}/5
              </span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((e) => (
                <button
                  key={e}
                  onClick={() => setEffort(e)}
                  className="flex-1 py-3 text-sm transition-all duration-150 ease-out active:scale-[0.98]"
                  style={{
                    background: effort === e ? "#D4AF37" : "#141414",
                    color: effort === e ? "#0a0a0a" : "#a09888",
                    border: effort === e ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.12)",
                    borderRadius: "0px",
                    fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                    fontWeight: 600,
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            <div
              className="flex justify-between mt-1"
              style={{
                fontSize: "10px",
                fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                color: "#5a5248",
              }}
            >
              <span>Easy</span>
              <span>Max effort</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="w-full mt-8 py-3 transition-all duration-150 ease-out active:scale-[0.98]"
          style={{
            background: "#D4AF37",
            color: "#0a0a0a",
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            fontWeight: 600,
            borderRadius: "0px",
            border: "none",
          }}
        >
          Save & Complete
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm mb-4 min-h-[44px] flex items-center transition-colors duration-150 ease-out"
        style={{
          color: "#D4AF37",
          fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
          fontWeight: 600,
          background: "none",
          border: "none",
        }}
      >
        &larr; Back
      </button>

      <h2
        className="text-xl mb-1"
        style={{
          fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "#f5f0e8",
        }}
      >
        {exercise.name}
      </h2>
      <p
        className="text-sm mb-2"
        style={{
          fontFamily: "var(--font-body, 'Outfit', sans-serif)",
          color: "#a09888",
        }}
      >
        {exercise.description}
      </p>
      <div className="flex gap-2 mb-6">
        <span
          className="text-xs px-2 py-1"
          style={{
            background: "#1e1e1e",
            color: "#a09888",
            borderRadius: "0px",
            fontFamily: "var(--font-mono, 'Space Mono', monospace)",
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          Difficulty: {difficulty}/10
        </span>
        <span
          className="text-xs px-2 py-1"
          style={{
            background: "#1e1e1e",
            color: "#a09888",
            borderRadius: "0px",
            fontFamily: "var(--font-mono, 'Space Mono', monospace)",
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          {exercise.repetitions} reps
        </span>
        <span
          className="text-xs px-2 py-1"
          style={{
            background: "#1e1e1e",
            color: "#a09888",
            borderRadius: "0px",
            fontFamily: "var(--font-mono, 'Space Mono', monospace)",
            border: "1px solid rgba(212,175,55,0.12)",
          }}
        >
          {Math.ceil(exercise.durationSeconds / 60)} min
        </span>
      </div>

      {phase === "intro" && (
        <>
          <div
            className="p-4 mb-6"
            style={{
              background: "#141414",
              border: "1px solid rgba(212,175,55,0.12)",
              borderRadius: "0px",
            }}
          >
            <h3
              className="mb-3 text-sm"
              style={{
                fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#5a5248",
              }}
            >
              Instructions
            </h3>
            <ol className="space-y-2">
              {exercise.instructions.map((inst, i) => (
                <li
                  key={i}
                  className="text-sm flex gap-2"
                  style={{
                    fontFamily: "var(--font-body, 'Outfit', sans-serif)",
                    color: "#a09888",
                  }}
                >
                  <span
                    style={{
                      color: "#D4AF37",
                      fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}.
                  </span>
                  {inst}
                </li>
              ))}
            </ol>
          </div>
          <button
            onClick={() => setPhase("active")}
            className="w-full py-3 transition-all duration-150 ease-out active:scale-[0.98]"
            style={{
              background: "#D4AF37",
              color: "#0a0a0a",
              fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
              fontWeight: 600,
              borderRadius: "0px",
              border: "none",
            }}
          >
            Start Exercise
          </button>
        </>
      )}

      {phase === "active" && (
        <div className="text-center">
          {/* Timer */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50" cy="50" r="45"
                fill="none" stroke="#1e1e1e" strokeWidth="4"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none" stroke="#D4AF37" strokeWidth="4"
                strokeDasharray={`${(timeLeft / exercise.durationSeconds) * 283} 283`}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="text-3xl"
                style={{
                  fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                  fontWeight: 700,
                  color: "#f5f0e8",
                }}
              >
                {formatTime(timeLeft)}
              </span>
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#5a5248",
                }}
              >
                remaining
              </span>
            </div>
          </div>

          {/* Rep counter */}
          <div
            className="p-4 mb-6"
            style={{
              background: "#141414",
              border: "1px solid rgba(212,175,55,0.12)",
              borderRadius: "0px",
            }}
          >
            <p
              className="text-xs mb-2"
              style={{
                fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "#5a5248",
              }}
            >
              Tap to count reps
            </p>
            <button
              onClick={() => setCurrentRep((r) => r + 1)}
              aria-label={`Rep counter: ${currentRep}. Tap to add rep.`}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all duration-150 ease-out active:scale-95"
              style={{
                background: "#1e1e1e",
                border: "2px solid rgba(212,175,55,0.5)",
              }}
            >
              <span
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-mono, 'Space Mono', monospace)",
                  fontWeight: 700,
                  color: "#D4AF37",
                }}
              >
                {currentRep}
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              clearInterval(timerRef.current);
              setPhase("rate");
            }}
            className="text-sm transition-colors duration-150 ease-out"
            style={{
              color: "#5a5248",
              fontFamily: "var(--font-body, 'Outfit', sans-serif)",
              background: "none",
              border: "none",
            }}
          >
            End Early
          </button>
        </div>
      )}
    </div>
  );
}
