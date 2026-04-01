"use client";

const SECTIONS = [
  {
    title: "Your Brain Rewires Itself",
    body: "After injury, your brain doesn\u2019t just heal \u2014 it reorganizes. Surviving neurons form new connections to compensate for damaged ones. This is neuroplasticity. The more a pathway is used, the stronger it becomes.",
    color: "var(--gold)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2L26 14L14 26L2 14Z" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
        <path d="M14 8L20 14L14 20L8 14Z" stroke="var(--gold)" strokeWidth="1" fill="rgba(212,175,55,0.15)" />
      </svg>
    ),
  },
  {
    title: "ReWire Tracks Your Neural Pathways",
    body: "Every assessment activates specific brain regions in our computational model. Grip strength tests activate your motor cortex. Memory tests activate your hippocampus. We use Hebbian learning \u2014 the same math neuroscientists use \u2014 to strengthen connections between co-activated regions.",
    color: "var(--teal-bright)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="8" cy="8" r="3" stroke="var(--teal-bright)" strokeWidth="1.5" />
        <circle cx="20" cy="8" r="3" stroke="var(--teal-bright)" strokeWidth="1.5" />
        <circle cx="14" cy="20" r="3" stroke="var(--teal-bright)" strokeWidth="1.5" />
        <line x1="10.5" y1="9.5" x2="12" y2="17.5" stroke="var(--teal-bright)" strokeWidth="1" />
        <line x1="17.5" y1="9.5" x2="16" y2="17.5" stroke="var(--teal-bright)" strokeWidth="1" />
        <line x1="11" y1="8" x2="17" y2="8" stroke="var(--teal-bright)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    title: "Exercises Target Your Weakest Connections",
    body: "Our agent analyzes your brain map using graph algorithms to find bottleneck nodes and weakest pathways. It recommends exercises that target exactly where your neural network needs the most work. As you practice, Long-Term Potentiation (LTP) consolidates your gains into durable recovery.",
    color: "var(--coral)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 14H24" stroke="var(--coral)" strokeWidth="1.5" />
        <path d="M18 8L24 14L18 20" stroke="var(--coral)" strokeWidth="1.5" fill="none" />
        <circle cx="10" cy="14" r="2" fill="rgba(255,107,107,0.3)" stroke="var(--coral)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    title: "Your Data Stays Yours",
    body: "Your neural recovery data is stored on Storacha \u2014 decentralized storage that you own. No hospital server, no company database. Your cognitive sovereignty is built into the architecture. Share your recovery blueprint with other patients, or keep it private. You control who sees your brain.",
    color: "var(--gold)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="12" width="12" height="10" rx="1" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
        <path d="M11 12V8C11 6.34 12.34 5 14 5C15.66 5 17 6.34 17 8V12" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
        <circle cx="14" cy="17" r="1.5" fill="var(--gold)" />
      </svg>
    ),
  },
];

export default function HowItWorks({ onBack }: { onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="text-sm mb-4 min-h-[44px] flex items-center"
        style={{ background: "none", border: "none", color: "var(--gold)", fontFamily: "var(--font-display)", cursor: "pointer" }}
      >
        &larr; Back
      </button>

      <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase" }}>
        The Science
      </p>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.5px", marginTop: "4px", marginBottom: "24px" }}>
        How ReWire Works
      </h2>

      <div className="space-y-4">
        {SECTIONS.map((section, i) => (
          <div key={i} className="p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5">{section.icon}</div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "16px", color: section.color, marginBottom: "8px" }}>
                  {section.title}
                </h3>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {section.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technical summary */}
      <div className="mt-6 p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>
          Under the Hood
        </p>
        <div className="grid grid-cols-2 gap-3" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)" }}>
          <div>
            <p style={{ color: "var(--gold)", marginBottom: "2px" }}>Hebbian Model</p>
            <p>dW = n * pre * post</p>
          </div>
          <div>
            <p style={{ color: "var(--coral)", marginBottom: "2px" }}>FFT Analysis</p>
            <p>Cooley-Tukey radix-2</p>
          </div>
          <div>
            <p style={{ color: "var(--teal-bright)", marginBottom: "2px" }}>Pose Tracking</p>
            <p>MediaPipe 33-landmark</p>
          </div>
          <div>
            <p style={{ color: "var(--gold)", marginBottom: "2px" }}>Storage</p>
            <p>Storacha IPFS/CID</p>
          </div>
        </div>
      </div>
    </div>
  );
}
