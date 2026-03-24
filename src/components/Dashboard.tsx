"use client";

import { useState, useEffect } from "react";
import { questions, topics } from "@/data/questions";
import { getTopicStats, clearResults, type TopicStats } from "@/lib/storage";
import Quiz from "./Quiz";
import StudyNotes from "./StudyNotes";

const topicColors: Record<string, string> = {
  "Exercise Therapy": "bg-blue-500",
  Electrotherapy: "bg-purple-500",
  Orthopaedics: "bg-amber-500",
  Neuroscience: "bg-pink-500",
  Cardiorespiratory: "bg-red-500",
  Biomechanics: "bg-cyan-500",
  Rehabilitation: "bg-green-500",
  Musculoskeletal: "bg-orange-500",
};

export default function Dashboard() {
  const [view, setView] = useState<"home" | "quiz">("home");
  const [mode, setMode] = useState<"quiz" | "notes">("quiz");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, TopicStats>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getTopicStats(questions));
  }, []);

  const refreshStats = () => setStats(getTopicStats(questions));

  useEffect(() => {
    if (view === "home") refreshStats();
  }, [view]);

  const totalAttempted = Object.values(stats).reduce(
    (sum, s) => sum + s.attempted,
    0
  );
  const totalCorrect = Object.values(stats).reduce(
    (sum, s) => sum + s.correct,
    0
  );
  const overallPct =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  if (view === "quiz") {
    return (
      <Quiz
        questions={questions}
        topicFilter={selectedTopic}
        onBack={() => setView("home")}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">PhysioPrep</h1>
        <p className="text-gray-400">
          {questions.length} questions across {topics.length} topics
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-800/50 border border-gray-700 rounded-xl p-1">
          <button
            onClick={() => setMode("quiz")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "quiz"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Quiz Mode
          </button>
          <button
            onClick={() => setMode("notes")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "notes"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Study Notes
          </button>
        </div>
      </div>

      {mode === "notes" ? (
        <StudyNotes />
      ) : (
        <>
          {/* Overall progress */}
          {mounted && totalAttempted > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Overall Progress</span>
                <span className="text-sm text-gray-500">
                  {totalAttempted}/{questions.length} attempted
                </span>
              </div>
              <div className="flex items-end gap-4">
                <span
                  className={`text-4xl font-bold ${
                    overallPct >= 70
                      ? "text-green-400"
                      : overallPct >= 50
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {overallPct}%
                </span>
                <div className="flex-1 mb-2">
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${(totalAttempted / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick start */}
          <button
            onClick={() => {
              setSelectedTopic(null);
              setView("quiz");
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-semibold text-lg mb-8 transition-colors"
          >
            Quick Quiz &mdash; All Topics
          </button>

          {/* Topics grid */}
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            Study by Topic
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {topics.map((topic) => {
              const s = stats[topic] || { attempted: 0, correct: 0, total: 0 };
              const pct =
                s.attempted > 0
                  ? Math.round((s.correct / s.attempted) * 100)
                  : -1;
              const color = topicColors[topic] || "bg-gray-500";

              return (
                <button
                  key={topic}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setView("quiz");
                  }}
                  className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-4 text-left transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="font-medium group-hover:text-white transition-colors">
                      {topic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{s.total} questions</span>
                    {mounted && pct >= 0 && (
                      <span
                        className={
                          pct >= 70
                            ? "text-green-400"
                            : pct >= 50
                            ? "text-yellow-400"
                            : "text-red-400"
                        }
                      >
                        {pct}% ({s.attempted}/{s.total})
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reset */}
          {mounted && totalAttempted > 0 && (
            <div className="text-center">
              <button
                onClick={() => {
                  if (confirm("Reset all progress? This cannot be undone.")) {
                    clearResults();
                    refreshStats();
                  }
                }}
                className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
              >
                Reset Progress
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
