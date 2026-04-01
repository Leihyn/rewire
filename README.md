# ReWire

**Neuroplasticity-Powered Neurorehabilitation Platform**

**[Live Demo](https://rewire-neuro.vercel.app)** | **[Demo Video](https://youtu.be/YOUR_VIDEO_ID)**

ReWire computationally models neural recovery for stroke, TBI, and neurodegenerative patients. It tracks neurological function through 7 assessment types, adapts rehabilitation exercises using real neuroplasticity algorithms, visualizes brain pathway recovery as an interactive neural constellation, and stores all patient data on decentralized Storacha storage the patient owns.

Built for the **PL Genesis: Frontiers of Collaboration Hackathon**. Neurotechnology and Brain-Computer Interfaces track.

---

## The Problem

12 million people have a stroke every year (World Stroke Organization, 2025). Survivors face months of rehabilitation with no patient-facing tool that computationally models whether their brain is actually rewiring. Clinical assessments measure function, not neural pathway recovery. Progress is a feeling, not a measurement.

## What ReWire Does

ReWire bridges that gap with five interconnected computational systems:

1. **Hebbian Learning Model**. implements real neuroscience as computable algorithms. When a patient exercises grip strength and then performs a reaction time test, the neural pathways connecting motor cortex to basal ganglia strengthen (ΔW = η × pre × post). Unused connections decay over time. Repeated successful activations trigger Long-Term Potentiation, raising permanent weight floors. Failed activations cause Long-Term Depression at 1.5x the rate. Homeostatic plasticity caps total incoming weight per node to prevent runaway excitation.

2. **FFT Tremor Analysis**. a Cooley-Tukey radix-2 Fast Fourier Transform decomposes raw phone accelerometer data into a power spectral density profile. The system classifies tremor into clinically relevant frequency bands: Parkinsonian resting tremor (4-6 Hz), essential tremor (8-12 Hz), cerebellar intention tremor (3-5 Hz). Spectral entropy distinguishes regular pathological tremor (low entropy) from normal physiological movement (high entropy).

3. **MediaPipe Pose Estimation**. 33-landmark body tracking via webcam computes joint angles, movement velocity, bilateral symmetry, and movement smoothness using the normalized jerk metric (Hogan & Sternad, 2009). Range of motion is tracked across sessions. All processing runs locally in the browser.

4. **Graph-Theoretic Exercise Selection**. the brain map is analyzed using betweenness centrality to identify bottleneck nodes, shortest-path algorithms to find weakest pathways, and connected component detection to spot disconnected clusters. The adaptive agent recommends exercises that target network-critical connections. Difficulty adjusts via progressive overload (increase at >80% success rate) and pain safety (automatic reduction at pain >7/10).

5. **Storacha Persistent Agent Memory**. the entire patient state (profile, assessments, exercise logs, Hebbian model parameters, brain graph, preferences) serializes to JSON and uploads to Storacha decentralized storage. Content-addressed retrieval via CID. The patient owns their data. No central server. Accessible from any device.

---

## Features

### Patient Dashboard
- Recovery score computed from rolling assessment average
- Network resilience percentage from graph analysis
- Agent-generated insights referencing specific Hebbian model states (LTP consolidation, synaptic decay rates)
- Recent activity timeline with color-coded scores

### 7 Assessment Types
| Assessment | Method | Brain Regions Activated |
|---|---|---|
| **Grip Strength** | 1-5 self-report scale | Motor cortex, Premotor, Cerebellum, Basal ganglia |
| **Pain Level** | 0-10 slider (inverse scoring) | Somatosensory cortex, Thalamus, Parietal association |
| **Range of Motion** | 6 joints, degree estimation | Motor cortex, Premotor, SMA, Cerebellum |
| **Reaction Time** | 5-trial tap test with random delay | Prefrontal cortex, Premotor, Basal ganglia, Thalamus |
| **Memory Recall** | Expanding color sequence game | Hippocampus, Prefrontal cortex, Parietal association |
| **Tremor Detection** | FFT frequency analysis (phone) or simulated | Basal ganglia, Cerebellum, Thalamus, Motor cortex |
| **Movement Tracking** | MediaPipe 33-landmark pose estimation (webcam) | Motor cortex, Premotor, SMA, Cerebellum |

Each assessment triggers a Hebbian weight update on the corresponding brain regions, strengthening connections between co-activated nodes.

### 10 Adaptive Exercises
Motor (finger tapping, grip squeeze, wrist rotation, reach-and-grasp, bilateral coordination), Cognitive (sequence recall, dual task, pattern matching), Sensory (texture identification, proprioception training). Each targets a specific brain region and adapts difficulty based on the patient's performance history using spaced repetition intervals inspired by the SM-2 algorithm applied to motor tasks.

### Neural Constellation (Brain Map)
Interactive D3 force-directed graph with 12 brain region nodes and 18 pathway edges. Diamond-shaped nodes sized by strength. Edge color and thickness reflect Hebbian weights: gold for LTP-consolidated connections, coral for active/recovering, muted for pruned. Nodes are draggable, the graph is zoomable, and the cosmic constellation aesthetic uses glow filters and a star-field background pattern.

Below the graph: full network analysis showing resilience percentage, edge connectivity ratio, average path length, weakest pathways (targets for rehab), strongest pathways, and critical bottleneck nodes identified by betweenness centrality.

### Blueprint Sharing (Collective Intelligence)
A patient exports their recovery journey as a "blueprint": exercise parameters, difficulty progression, brain map snapshot, assessment summary, and recovery goals. Personal information is stripped. The blueprint uploads to Storacha and returns a CID. Another patient with the same condition imports the CID and loads the blueprint as a starting template. Peer-to-peer collective intelligence about neural recovery.

### Caregiver Dashboard (Coordination)
A caregiver (family member, community health worker) adds patients by Storacha CID. Side-by-side view of recovery scores, network strength, days since last activity, and attention indicators. Patients with low scores or inactivity are flagged. Multi-patient coordination without a central database.

### How It Works (Science Explainer)
Plain-language explanation of neuroplasticity, Hebbian learning, graph-based exercise selection, and data sovereignty for non-technical judges and patients.

### Demo Mode
One-click loads a pre-populated 6-week stroke recovery journey: Alex Chen, 27 assessments, 18 exercise logs, brain map with visible LTP-consolidated motor pathways and weak language areas (Broca's, Wernicke's), recovery score 70, network resilience 92%.

---

## Technical Architecture

### Stack
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4 + Afrofuturist design system (Space Grotesk, Outfit, Space Mono)
- **Visualization**: D3.js (force-directed neural graph)
- **Pose Estimation**: MediaPipe Tasks Vision (@mediapipe/tasks-vision)
- **Storage**: Storacha (@storacha/client) for decentralized persistent agent memory
- **Signal Processing**: Custom Cooley-Tukey FFT implementation (no external DSP library)

### Computational Models

**Hebbian Learning Engine** (`src/lib/agent/hebbian.ts`)
```
Learning rate (η): 0.15
Decay rate: 0.995 per hour
LTP threshold: 3 consecutive co-activations
LTD multiplier: 1.5x
Pruning threshold: 0.05
Homeostatic target: 3.0 total incoming weight per node
```

**FFT Tremor Analysis** (`src/lib/sensors/tremor-analysis.ts`)
- Cooley-Tukey radix-2 in-place FFT
- Hanning window for spectral leakage reduction
- One-sided power spectral density computation
- 4 frequency bands with peak detection
- Spectral entropy for tremor regularity classification

**Pose Estimation** (`src/lib/sensors/pose-tracking.ts`)
- MediaPipe Pose Landmarker (lite model, GPU-accelerated)
- 6 joint angle extractions (bilateral elbow, shoulder, knee)
- Normalized jerk metric for movement smoothness (Hogan & Sternad, 2009)
- Bilateral symmetry scoring
- Per-session range of motion tracking

**Network Analysis** (`src/lib/agent/hebbian.ts: analyzeNetwork()`)
- Dijkstra-based shortest path with inverse edge weights
- BFS betweenness centrality for bottleneck detection
- Connected component analysis via DFS
- Composite resilience score: 40% connectivity + 40% normalized path length + 20% base, penalized by fragmentation

### Data Model

```typescript
AgentMemory {
  profile: PatientProfile       // name, condition, affected side, goals
  assessments: AssessmentRecord[] // timestamped, normalized 0-100, raw data
  exerciseLogs: ExerciseLog[]   // reps, difficulty, pain, perceived effort
  exerciseParams: Record<id, ExerciseParams> // adaptive state per exercise
  graphState: { nodes: BrainNode[], edges: BrainEdge[] }
  preferences: { duration, voiceGuidance }
  meta: { lastSyncedAt, lastCID, deviceId }
}
```

### Storacha Integration
- Client-side SDK (@storacha/client)
- Email-based login with verification
- Space creation per patient
- Agent memory serialized to JSON, uploaded via `client.uploadFile()`
- Retrieval via IPFS gateway: `https://{cid}.ipfs.w3s.link`
- Debounced sync (2s delay, 3 retry attempts with exponential backoff)
- Local cache in localStorage as CID pointer for cross-device restore
- Session auto-restore on returning users

---

## Project Structure

```
src/
  app/                          # Next.js App Router
    layout.tsx                  # Root layout with fonts
    page.tsx                    # Entry point
    globals.css                 # Afrofuturist design tokens
  components/
    ClientApp.tsx               # Root provider (ReWire context, Hebbian integration)
    layout/AppShell.tsx         # Header, bottom nav, error boundaries
    onboarding/OnboardingFlow.tsx
    dashboard/
      DashboardView.tsx         # Recovery score, network stats, insights
      BlueprintSharing.tsx      # Export/import recovery plans via CID
      CaregiverView.tsx         # Multi-patient coordination
      HowItWorks.tsx            # Science explainer
    assessment/
      AssessmentHub.tsx         # 7 assessment types
      GripStrength.tsx
      PainLevel.tsx
      RangeOfMotion.tsx
      ReactionTest.tsx
      MemoryRecall.tsx
      TremorDetector.tsx        # FFT analysis + desktop simulation
      PoseAssessment.tsx        # MediaPipe webcam tracking
    exercises/
      ExerciseHub.tsx           # Recommended + filtered exercise list
      ExerciseGuide.tsx         # Timer, rep counter, post-exercise rating
    graph/
      NeuralGraph.tsx           # D3 neural constellation
    ui/
      ErrorFallback.tsx         # Error boundary component
  lib/
    agent/
      engine.ts                 # Graph-algorithm exercise recommendation
      hebbian.ts                # Hebbian learning, LTP/LTD, network analysis
      plasticity.ts             # Difficulty adjustment, spaced repetition
    sensors/
      pose-tracking.ts          # MediaPipe wrapper, jerk metric, symmetry
      tremor-analysis.ts        # Cooley-Tukey FFT, frequency classification
    storacha/
      client.ts                 # Storacha SDK wrapper
      agent-memory.ts           # Serialize/deserialize, CID management
      sync.ts                   # Debounced upload with retry
    storage.ts                  # LocalStorage utilities
  types/
    index.ts                    # All TypeScript types
  data/
    brain-regions.ts            # 12 nodes, 18 edges, assessment mappings
    exercises.ts                # 10 rehab exercises with instructions
    demo-data.ts                # Pre-populated 6-week recovery journey
```

---

## Running Locally

```bash
git clone https://github.com/YOUR_USERNAME/rewire.git
cd rewire
npm install
npm run dev
```

Opens at `http://localhost:3456`.

Click **"Launch Demo Mode"** on the welcome screen to load a pre-populated 6-week stroke recovery with full brain map data.

---

## Hackathon Track Alignment

### Neurotechnology and Brain-Computer Interfaces

| Track Requirement | How ReWire Addresses It |
|---|---|
| **Neuro-inspired architectures** | Hebbian learning model with LTP/LTD/homeostatic plasticity. The brain map IS the computational model, not a visualization of external data. |
| **Cognitive sovereignty** | Patient data lives on Storacha. No central server. Patient controls who sees their neural data via CID sharing. |
| **Neural data rights** | Blueprint export strips personal info. Caregiver access is by CID, not database query. Patient can revoke by not sharing CID. |
| **Safe augmentation** | Pain safety reduces exercise intensity automatically. High pain triggers LTD to prevent maladaptive plasticity. Agent warns when pain levels are elevated. |
| **Conceptual rigor** | FFT tremor classification uses real frequency bands from clinical literature. Jerk metric from Hogan & Sternad 2009. Hebbian weight update follows standard neuroscience formulation. |
| **Collective intelligence** | Blueprint sharing enables peer-to-peer recovery intelligence. Caregiver dashboard enables multi-patient coordination. |

### Storacha Sponsor Challenge 1: Persistent Agent Memory

The ReWire adaptive agent stores its complete state on Storacha: patient profile, assessment history, exercise parameters (difficulty, spacing intervals, success rates), Hebbian model state (activation history, LTP counters, weight floors), brain graph (node strengths, edge weights), and preferences. On any device, the agent pulls its memory from Storacha via CID and continues where it left off. The agent genuinely remembers and evolves.

---

## Neuroscience References

- **Hebbian Learning**: Hebb, D.O. (1949). *The Organization of Behavior*. "Neurons that fire together wire together."
- **Long-Term Potentiation**: Bliss, T.V.P. & Collingridge, G.L. (1993). A synaptic model of memory: long-term potentiation in the hippocampus. *Nature*, 361, 31-39.
- **Homeostatic Plasticity**: Turrigiano, G.G. (2008). The self-tuning neuron: synaptic scaling of excitatory synapses. *Cell*, 135(3), 422-435.
- **Movement Smoothness**: Hogan, N. & Sternad, D. (2009). Sensitivity of smoothness measures to movement duration, amplitude, and arrests. *Journal of Motor Behavior*, 41(6), 529-534.
- **Stroke Statistics**: World Stroke Organization Global Stroke Fact Sheet 2025. *International Journal of Stroke*.
- **Neuroplasticity in Rehabilitation**: Kleim, J.A. & Jones, T.A. (2008). Principles of experience-dependent neural plasticity. *Journal of Speech, Language, and Hearing Research*, 51(1), S225-S239.

---

## Design

Afrofuturist neurotech aesthetic. Gold (#D4AF37), coral (#FF6B6B), and deep teal (#0D7377) on near-black (#0A0A0A). African textile-inspired geometric diamond pattern as subtle background texture. Space Grotesk for headings, Outfit for body, Space Mono for data. Sharp corners on cards. Diamond-shaped indicators. Neural constellation with cosmic glow effects.

---

## License

MIT
