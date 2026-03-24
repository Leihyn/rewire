"use client";

import { useState } from "react";
import { studyNotes, noteTopics } from "@/data/notes";

const topicColors: Record<string, string> = {
  Biomechanics: "bg-cyan-500",
  "Exercise Therapy": "bg-blue-500",
  Rehabilitation: "bg-green-500",
  Neuroscience: "bg-pink-500",
  Electrotherapy: "bg-purple-500",
  Orthopaedics: "bg-amber-500",
};

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1]?.match(/^\|[-| ]+\|$/)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headerCells = tableLines[0]
        .split("|")
        .filter((c) => c.trim() !== "");
      const bodyRows = tableLines.slice(2);

      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {headerCells.map((cell, ci) => (
                  <th
                    key={ci}
                    className="text-left py-2 px-3 text-gray-300 font-semibold"
                    dangerouslySetInnerHTML={{ __html: formatInline(cell.trim()) }}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row.split("|").filter((c) => c.trim() !== "");
                return (
                  <tr key={ri} className="border-b border-gray-800/50">
                    {cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className="py-2 px-3 text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: formatInline(cell.trim()),
                        }}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Bullet points
    if (line.match(/^- /)) {
      const bullets: string[] = [];
      while (i < lines.length && lines[i].match(/^- /)) {
        bullets.push(lines[i].replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-2 ml-1">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex gap-2 text-gray-400">
              <span className="text-gray-600 mt-1.5 shrink-0 w-1 h-1 rounded-full bg-gray-600 inline-block" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(b) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="text-gray-400 my-1.5"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
    i++;
  }

  return <>{elements}</>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-200 font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-sm text-blue-300">$1</code>');
}

export default function StudyNotes() {
  const [search, setSearch] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set(noteTopics)
  );

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) {
        next.delete(topic);
      } else {
        next.add(topic);
      }
      return next;
    });
  };

  const collapseAll = () => setExpandedTopics(new Set());
  const expandAll = () => setExpandedTopics(new Set(noteTopics));

  const lowerSearch = search.toLowerCase();
  const filteredNotes = search
    ? studyNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(lowerSearch) ||
          n.content.toLowerCase().includes(lowerSearch) ||
          n.topic.toLowerCase().includes(lowerSearch)
      )
    : studyNotes;

  const filteredTopics = noteTopics.filter((topic) =>
    filteredNotes.some((n) => n.topic === topic)
  );

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
        <svg
          className="absolute left-3 top-3.5 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Expand/Collapse controls */}
      <div className="flex gap-3 mb-6 text-sm">
        <button
          onClick={expandAll}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          Expand all
        </button>
        <span className="text-gray-700">|</span>
        <button
          onClick={collapseAll}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          Collapse all
        </button>
        {search && (
          <span className="text-gray-600 ml-auto">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* Notes by topic */}
      {filteredTopics.map((topic) => {
        const topicNotes = filteredNotes.filter((n) => n.topic === topic);
        const isExpanded = expandedTopics.has(topic);
        const color = topicColors[topic] || "bg-gray-500";

        return (
          <div key={topic} className="mb-4">
            <button
              onClick={() => toggleTopic(topic)}
              className="w-full flex items-center gap-3 py-3 px-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
            >
              <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
              <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                {topic}
              </span>
              <span className="text-gray-600 text-sm">
                ({topicNotes.length})
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 ml-auto transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-2 space-y-2 pl-2">
                {topicNotes.map((note, idx) => (
                  <NoteCard key={`${note.topic}-${idx}`} note={note} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No notes matching &ldquo;{search}&rdquo;
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: { title: string; content: string } }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors text-left"
      >
        <span className="font-medium text-gray-300">{note.title}</span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform shrink-0 ${
            expanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 text-sm leading-relaxed">
          {renderMarkdown(note.content)}
        </div>
      )}
    </div>
  );
}
