// localStorage helpers for progress tracking

export type QuizResult = {
  questionId: number;
  correct: boolean;
  selectedAnswer: number;
  timestamp: number;
};

export type TopicStats = {
  attempted: number;
  correct: number;
  total: number;
};

const STORAGE_KEY = "physio_prep_results";

function isBrowser(): boolean {
  try {
    return typeof window !== "undefined" && typeof document !== "undefined" && typeof window.localStorage?.getItem === "function";
  } catch {
    return false;
  }
}

export function getResults(): QuizResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: QuizResult) {
  if (!isBrowser()) return;
  const results = getResults();
  const idx = results.findIndex((r) => r.questionId === result.questionId);
  if (idx !== -1) {
    results[idx] = result;
  } else {
    results.push(result);
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // storage full or unavailable
  }
}

export function getTopicStats(
  questions: { id: number; topic: string }[]
): Record<string, TopicStats> {
  const results = getResults();
  const resultMap = new Map(results.map((r) => [r.questionId, r]));
  const stats: Record<string, TopicStats> = {};

  for (const q of questions) {
    if (!stats[q.topic]) {
      stats[q.topic] = { attempted: 0, correct: 0, total: 0 };
    }
    stats[q.topic].total++;
    const result = resultMap.get(q.id);
    if (result) {
      stats[q.topic].attempted++;
      if (result.correct) stats[q.topic].correct++;
    }
  }
  return stats;
}

export function clearResults() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // unavailable
  }
}
