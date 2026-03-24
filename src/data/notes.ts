export type StudyNote = {
  topic: string;
  title: string;
  content: string;
};

export const studyNotes: StudyNote[] = [
  // === BIOMECHANICS ===
  {
    topic: "Biomechanics",
    title: "Lever Systems",
    content: `**1st Order** (fulcrum in middle) = Balance
- Example: Nodding the head (atlanto-occipital joint)

**2nd Order** (load in middle) = Power/Stability
- Example: Calf raise (ankle joint, load at metatarsals)

**3rd Order** (effort in middle) = Speed/Range
- Most common lever in the human body
- Example: Biceps curl (effort at radial tuberosity, fulcrum at elbow)`,
  },
  {
    topic: "Biomechanics",
    title: "Planes & Axes",
    content: `**Sagittal plane** + Frontal axis = Flexion/Extension
**Frontal plane** + Sagittal axis = Abduction/Adduction
**Transverse plane** + Vertical axis = Rotation

Memory aid: The axis is always perpendicular to the plane of movement.`,
  },
  {
    topic: "Biomechanics",
    title: "Muscle Contractions",
    content: `**Concentric:** Muscle shortens (lifting a weight up)
**Eccentric:** Muscle lengthens under tension (lowering a weight down)
**Isometric:** No length change (holding a weight still)

**Metabolic cost:** Concentric > Isometric > Eccentric
- Eccentric produces more force with less energy expenditure
- Eccentric training is key for tendinopathy rehab`,
  },

  // === EXERCISE THERAPY ===
  {
    topic: "Exercise Therapy",
    title: "Manual Muscle Testing (MMT) Grades",
    content: `| Grade | Description |
|-------|-------------|
| **0** | No contraction (zero) |
| **1** | Trace/flicker only (visible/palpable contraction) |
| **2** | Full ROM with gravity eliminated |
| **3** | Full ROM against gravity |
| **4** | Full ROM against moderate resistance |
| **5** | Full ROM against maximal resistance (normal) |

Key: Grade 3 is the "gravity" threshold. Below 3 = test in gravity-eliminated position.`,
  },
  {
    topic: "Exercise Therapy",
    title: "PRE Techniques",
    content: `**DeLorme (Ascending):**
- Set 1: 50% of 10RM
- Set 2: 75% of 10RM
- Set 3: 100% of 10RM
- Progress weekly

**Oxford / Zinovief (Descending):**
- Set 1: 100% of 10RM
- Set 2: 75% of 10RM
- Set 3: 50% of 10RM

**DAPRE (Daily Adjustable Progressive Resistive Exercise):**
- Based on 6RM
- Adjusts load each session based on reps achieved in working set
- More responsive than DeLorme/Oxford`,
  },
  {
    topic: "Exercise Therapy",
    title: "PNF Techniques",
    content: `Developed by **Kabat & Knott**. Uses diagonal/spiral patterns.

**Rhythmic Initiation:** Passive -> active-assisted -> active. For Parkinsonism, cerebellar ataxia.
**Rhythmic Stabilization:** Alternating isometrics, co-contraction. Builds stability.
**Hold-Relax:** Isometric contraction of tight muscle then relax -> gain ROM. Uses autogenic inhibition.
**Contract-Relax:** Isotonic contraction then relax -> gain ROM.
**Repeated Contraction:** Repeated isotonic contractions to strengthen weak muscles.`,
  },
  {
    topic: "Exercise Therapy",
    title: "End Feels",
    content: `**Normal End Feels:**
- **Hard/Bony:** Bone-on-bone contact. Example: elbow extension (olecranon into fossa)
- **Soft:** Tissue approximation. Example: elbow flexion (muscle bulk), knee flexion
- **Firm/Capsular:** Capsule/ligament stretch. Example: hip rotation, shoulder ER

**Abnormal End Feels:**
- **Springy:** Rebound at end range -> loose body in joint (abnormal!)
- **Leathery:** Thick capsular resistance -> capsular tightness (e.g., frozen shoulder)
- **Empty:** Patient stops due to pain before any mechanical limit is reached`,
  },

  // === REHABILITATION ===
  {
    topic: "Rehabilitation",
    title: "Gait Cycle",
    content: `**Stance phase (60%):** Heel strike -> Foot flat -> Midstance -> Heel off -> Toe off
**Swing phase (40%):** Acceleration -> Mid-swing -> Deceleration

- **Double support** occurs at beginning and end of stance
- **Center of gravity** is highest at midstance
- **Normal cadence:** 70-130 steps/min

**Clinical pearls:**
- Stairs: "Up with good, down with bad"
- **Trendelenburg sign:** Opposite pelvis drops = weak hip abductors on stance side (gluteus medius)`,
  },

  // === NEUROSCIENCE ===
  {
    topic: "Neuroscience",
    title: "UMN vs LMN Lesions",
    content: `| Feature | UMN | LMN |
|---------|-----|-----|
| Tone | Spasticity, hypertonia | Flaccidity, hypotonia |
| Reflexes | Hyperreflexia | Hyporeflexia/areflexia |
| Babinski | Positive (upgoing toe) | Negative |
| Clonus | Present | Absent |
| Fasciculations | Absent | Present |
| Atrophy | Late/disuse | Early/denervation |

UMN = cortex/brainstem/spinal cord lesion. LMN = anterior horn cell/nerve root/peripheral nerve.`,
  },
  {
    topic: "Neuroscience",
    title: "Cranial Nerves (Key Facts)",
    content: `| # | Name | Function |
|---|------|----------|
| I | Olfactory | Smell |
| II | Optic | Vision |
| III, IV, VI | Oculomotor, Trochlear, Abducens | Eye movements |
| V | Trigeminal | Facial sensation, mastication |
| VII | Facial | Facial expression, taste (anterior 2/3 tongue) |
| VIII | Vestibulocochlear | Hearing, balance |
| IX | Glossopharyngeal | Gag reflex (sensory) |
| X | Vagus | Gag reflex (motor), visceral organs |
| XI | Accessory | SCM, trapezius |
| XII | Hypoglossal | Tongue movement |`,
  },
  {
    topic: "Neuroscience",
    title: "Glasgow Coma Scale (GCS)",
    content: `**Eye Opening (E):** max 4
**Verbal Response (V):** max 5
**Motor Response (M):** max 6

**Total = E + V + M = 15 (max)**

- Mild TBI: 13-15
- Moderate TBI: 9-12
- Severe TBI: 3-8
- Intubated patients: record as "1T" for verbal`,
  },

  // === ELECTROTHERAPY ===
  {
    topic: "Electrotherapy",
    title: "Electrotherapy Modalities",
    content: `**TENS:** Pain relief via gate control theory. High-frequency TENS for acute pain.
**IFT:** Base frequency 4000 Hz, beat frequency 0-250 Hz. Deep tissue stimulation.
**Russian Current:** Medium-frequency stimulation for muscle strengthening.
**Faradic:** AC current. **Galvanic:** DC current.

**Thermal Modalities:**
- **SWD:** 27.12 MHz, deep heating
- **MWD:** 2450 MHz, intermediate depth
- **Ultrasound:** 1-3 MHz
  - 1 MHz = deep penetration (~5 cm)
  - 3 MHz = superficial (~1-2 cm)

**Contraindications for US:** Eyes, pregnant uterus, growth plates, malignancy
**Pacemaker** = absolute contraindication for electrical stimulation`,
  },

  // === ORTHOPAEDICS ===
  {
    topic: "Orthopaedics",
    title: "Capsular Patterns",
    content: `**Shoulder:** ER > Abduction > IR
**Hip:** Flexion > IR > Extension > ER (some sources: IR > Flex)
**Knee:** Flexion > Extension

These patterns indicate joint capsule involvement (e.g., arthritis, capsulitis). Non-capsular patterns suggest ligament, meniscus, or loose body issues.`,
  },
  {
    topic: "Orthopaedics",
    title: "Key Ortho Facts",
    content: `**Fractures:**
- Shaft of humerus fracture -> **radial nerve** injury
- **Colles fracture** = dinner fork deformity (distal radius, dorsal displacement)
- **Smith fracture** = reverse Colles (volar displacement)
- **Scaphoid fracture** -> risk of avascular necrosis of proximal pole

**Knee:**
- **ACL rehab** -> emphasize hamstring strengthening (ACL agonist)
- **Meniscus tear** -> locking, Apley's grinding test

**Ankle:**
- Most commonly injured ligament = **anterior talofibular ligament (ATFL)**

**Ligaments:**
- **Spring ligament** = plantar calcaneonavicular
- **Strongest ligament** in body = iliofemoral (Y ligament of Bigelow)`,
  },
  {
    topic: "Orthopaedics",
    title: "Rheumatology Quick Reference",
    content: `**Rheumatoid Arthritis:** 4/7 ACR criteria, persistent synovitis, symmetric
**Psoriatic Arthritis:** Sausage fingers (dactylitis), asymmetric
**OA:** Heberden's nodes (DIP), Bouchard's nodes (PIP)
**Gout:** High uric acid, tophi, 1st MTP joint (podagra)
**SLE:** Butterfly rash, photosensitivity, multi-system
**Scleroderma:** Raynaud's phenomenon, skin thickening`,
  },
  {
    topic: "Orthopaedics",
    title: "Special Tests",
    content: `**Hip:**
- **Thomas test:** Hip flexor tightness (iliopsoas). Modifications for TFL, ITB, rectus femoris
- **Ober's test:** ITB tightness
- **Ely's test:** Rectus femoris tightness
- **Trendelenburg:** Hip abductor weakness (gluteus medius)

**Shoulder:**
- **Drop arm test:** Supraspinatus rupture

**Cervical/Thoracic:**
- **Adson's test:** Thoracic outlet syndrome (scalene compression)

**Lumbar/Nerve:**
- **SLR (Straight Leg Raise):** Sciatic nerve tension / disc herniation (L4-S1)`,
  },
];

export const noteTopics = Array.from(new Set(studyNotes.map((n) => n.topic)));
