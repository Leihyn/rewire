"use client";

import { useState, useCallback, useEffect } from "react";
import { Question } from "@/data/questions";
import { saveResult, getResults } from "@/lib/storage";

type QuizProps = {
  questions: Question[];
  topicFilter: string | null;
  onBack: () => void;
};

export default function Quiz({ questions, topicFilter, onBack }: QuizProps) {
  const filtered = topicFilter
    ? questions.filter((q) => q.topic === topicFilter)
    : questions;

  const [mode, setMode] = useState<"select" | "quiz">("select");
  const [pool, setPool] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = useCallback(
    (type: "all" | "weak" | "unseen") => {
      const results = getResults();
      const resultMap = new Map(results.map((r) => [r.questionId, r]));

      let selected: Question[];
      if (type === "weak") {
        selected = filtered.filter((q) => {
          const r = resultMap.get(q.id);
          return r && !r.correct;
        });
        if (selected.length === 0) selected = filtered; // fallback
      } else if (type === "unseen") {
        selected = filtered.filter((q) => !resultMap.has(q.id));
        if (selected.length === 0) selected = filtered;
      } else {
        selected = [...filtered];
      }

      // Shuffle
      for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }

      setPool(selected);
      setCurrent(0);
      setSelected(null);
      setShowExplanation(false);
      setSessionCorrect(0);
      setSessionTotal(0);
      setFinished(false);
      setMode("quiz");
    },
    [filtered]
  );

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const isCorrect = idx === pool[current].correct;
    setSessionTotal((t) => t + 1);
    if (isCorrect) setSessionCorrect((c) => c + 1);
    saveResult({
      questionId: pool[current].id,
      correct: isCorrect,
      selectedAnswer: idx,
      timestamp: Date.now(),
    });
  };

  const handleNext = () => {
    if (current + 1 >= pool.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setShowExplanation(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (mode !== "quiz" || finished) return;
      if (selected === null) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= pool[current].options.length) {
          handleSelect(num - 1);
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (mode === "select") {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
        >
          <span>&larr;</span> Back to topics
        </button>
        <h2 className="text-2xl font-bold mb-2">
          {topicFilter ?? "All Topics"}
        </h2>
        <p className="text-gray-400 mb-8">{filtered.length} questions available</p>
        <div className="grid gap-4">
          <button
            onClick={() => startQuiz("all")}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-5 text-left transition-all hover:border-blue-500/50"
          >
            <div className="font-semibold text-lg">All Questions</div>
            <div className="text-gray-400 text-sm mt-1">
              Randomized from the full set
            </div>
          </button>
          <button
            onClick={() => startQuiz("unseen")}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-5 text-left transition-all hover:border-green-500/50"
          >
            <div className="font-semibold text-lg">Unseen Questions</div>
            <div className="text-gray-400 text-sm mt-1">
              Questions you haven&apos;t attempted yet
            </div>
          </button>
          <button
            onClick={() => startQuiz("weak")}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-5 text-left transition-all hover:border-orange-500/50"
          >
            <div className="font-semibold text-lg">Weak Areas</div>
            <div className="text-gray-400 text-sm mt-1">
              Questions you got wrong last time
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 mt-8">
          <div className="text-6xl font-bold mb-4">
            <span className={pct >= 70 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}>
              {pct}%
            </span>
          </div>
          <p className="text-xl text-gray-300 mb-2">
            {sessionCorrect} / {sessionTotal} correct
          </p>
          <p className="text-gray-500 mb-8">
            {pct >= 80
              ? "Excellent! You know this material well."
              : pct >= 60
              ? "Good foundation. Review the explanations for questions you missed."
              : "Keep studying. Read the explanations carefully and retry."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => startQuiz("weak")}
              className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retry Weak Questions
            </button>
            <button
              onClick={() => {
                setMode("select");
                setFinished(false);
              }}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = pool[current];

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Progress bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setMode("select")}
          className="text-gray-400 hover:text-white transition-colors"
        >
          &larr;
        </button>
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((current + 1) / pool.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 tabular-nums">
          {current + 1}/{pool.length}
        </span>
        <span className="text-sm text-gray-500">
          {sessionCorrect}/{sessionTotal}
        </span>
      </div>

      {/* Topic badge */}
      <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 mb-4">
        {q.topic}
      </span>

      {/* Question */}
      <h3 className="text-xl font-semibold mb-6 leading-relaxed">
        {q.question}
      </h3>

      {/* Options */}
      <div className="grid gap-3 mb-6">
        {q.options.map((opt, idx) => {
          let classes =
            "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ";
          if (selected === null) {
            classes +=
              "bg-gray-800/50 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 cursor-pointer";
          } else if (idx === q.correct) {
            classes += "bg-green-500/10 border-green-500 text-green-300";
          } else if (idx === selected) {
            classes += "bg-red-500/10 border-red-500 text-red-300";
          } else {
            classes += "bg-gray-800/30 border-gray-800 text-gray-500";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={classes}
            >
              <span className="shrink-0 w-7 h-7 rounded-lg bg-gray-700/50 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="pt-0.5">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={
                selected === q.correct ? "text-green-400" : "text-red-400"
              }
            >
              {selected === q.correct ? "Correct!" : "Incorrect"}
            </span>
            <span className="text-gray-500">
              &mdash; Answer: {String.fromCharCode(65 + q.correct)}
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-medium transition-colors"
        >
          {current + 1 >= pool.length ? "See Results" : "Next Question"}
          <span className="text-blue-300 text-sm ml-2">(Enter)</span>
        </button>
      )}

      {/* Keyboard hint */}
      {selected === null && (
        <p className="text-center text-gray-600 text-sm mt-4">
          Press 1-{q.options.length} to select, or click an option
        </p>
      )}
    </div>
  );
}
