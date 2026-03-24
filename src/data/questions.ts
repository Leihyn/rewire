export type Question = {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correct: number; // 0-indexed
  explanation: string;
};

export const topics = [
  "Exercise Therapy",
  "Electrotherapy",
  "Orthopaedics",
  "Neuroscience",
  "Cardiorespiratory",
  "Biomechanics",
  "Rehabilitation",
  "Musculoskeletal",
] as const;

export type Topic = (typeof topics)[number];

export const questions: Question[] = [
  // === EXERCISE THERAPY & BIOMECHANICS ===
  {
    id: 1,
    topic: "Biomechanics",
    question:
      "The effect of two non-linear systems acting at a common point can be determined by finding out their resultant, which can be determined by:",
    options: [
      "Simple arithmetic addition",
      "Law of triangle",
      "Law of parallelogram",
      "Cosine law",
    ],
    correct: 2,
    explanation:
      "The law of parallelogram of forces states that if two forces acting at a point are represented by the sides of a parallelogram, their resultant is represented by the diagonal. This is the standard method for resolving two non-linear (non-collinear) forces.",
  },
  {
    id: 2,
    topic: "Biomechanics",
    question:
      "40 kg traction force is applied to the part at an angle of 30 degrees. What will be the effective distractive force at the joint?",
    options: ["30 kg", "35 kg", "40 kg", "45 kg"],
    correct: 1,
    explanation:
      "Effective force = Force x cos(angle). At 30 degrees: 40 x cos(30) = 40 x 0.866 = 34.64 ≈ 35 kg. Remember: as angle increases from 0, the effective distractive component decreases.",
  },
  {
    id: 3,
    topic: "Biomechanics",
    question:
      "Friction is the resistive force offered by the surface, when one surface moves over the other, which is:",
    options: [
      "Directly proportional to the area of the surface in contact",
      "Nature of the surface",
      "Weight of the moving object",
      "All of the above",
    ],
    correct: 2,
    explanation:
      "Friction depends on the weight (normal force) of the moving object and the coefficient of friction (nature of surfaces). It does NOT depend on the area of contact. F = μN where μ is coefficient of friction and N is normal force.",
  },
  {
    id: 4,
    topic: "Biomechanics",
    question: "Pulleys are used to:",
    options: [
      "Make the work easy",
      "Alter the direction of motion",
      "Gain mechanical efficiency",
      "All the above",
    ],
    correct: 3,
    explanation:
      "Pulleys serve multiple purposes in physiotherapy: they make work easier by changing direction of pull, alter the direction of applied force, and can provide mechanical advantage when multiple pulleys are used.",
  },
  {
    id: 5,
    topic: "Biomechanics",
    question:
      "In a pulley, maximum resistance force is produced when the angle of pulley is:",
    options: [
      "In line with the moving bone",
      "90° to the moving bone",
      "60° with moving bone",
      "45° with the moving bone",
    ],
    correct: 1,
    explanation:
      "Maximum resistance is produced when the pull is at 90° to the moving bone. At this angle, the entire force acts as a rotary component. At any other angle, some force is wasted as a stabilizing or distracting component.",
  },
  {
    id: 6,
    topic: "Biomechanics",
    question: "Which order lever is the lever of speed?",
    options: ["1st", "2nd", "3rd", "All"],
    correct: 2,
    explanation:
      "3rd order lever = lever of SPEED. The effort is between the fulcrum and the load. The effort arm is shorter than the load arm, so you sacrifice force for speed and range of motion. Most levers in the body are 3rd order (e.g., biceps curl).",
  },
  {
    id: 7,
    topic: "Biomechanics",
    question: "Knee flexion in prone lying is an example of:",
    options: [
      "1st order lever",
      "2nd order lever",
      "3rd order lever",
      "4th order lever",
    ],
    correct: 2,
    explanation:
      "Knee flexion in prone: Fulcrum = knee joint, Effort = hamstrings insertion (between fulcrum and load), Load = weight of the lower leg. Effort is in the middle → 3rd order lever.",
  },
  {
    id: 8,
    topic: "Biomechanics",
    question: "2nd order lever is the lever of:",
    options: ["Stability", "Instability", "Speed", "Efficiency"],
    correct: 0,
    explanation:
      "2nd order lever = lever of STABILITY/POWER. Load is between fulcrum and effort. The effort arm is always longer than the load arm, giving mechanical advantage >1. Example: standing on toes (calf raise). Remember: 1st = balance, 2nd = power/stability, 3rd = speed.",
  },
  {
    id: 9,
    topic: "Biomechanics",
    question: "Standing on toes is an example of which order lever?",
    options: ["1st", "2nd", "3rd", "4th"],
    correct: 1,
    explanation:
      "Standing on toes: Fulcrum = ball of foot (metatarsal heads), Load = body weight at ankle, Effort = calf muscles pulling on calcaneus. Load is in the middle → 2nd order lever.",
  },
  {
    id: 10,
    topic: "Biomechanics",
    question: "In our body, the most numerous order of levers present are:",
    options: ["1st", "2nd", "3rd", "4th"],
    correct: 2,
    explanation:
      "3rd order levers are the most common in the human body. Most muscles insert close to the joint (effort between fulcrum and load), sacrificing force for speed and range of motion.",
  },
  {
    id: 11,
    topic: "Biomechanics",
    question: "Which order lever is the lever of power?",
    options: ["1st", "2nd", "3rd", "All"],
    correct: 1,
    explanation:
      "2nd order lever = lever of POWER. Mechanical advantage is always >1 because the effort arm is longer than the load arm.",
  },
  {
    id: 12,
    topic: "Biomechanics",
    question: "Nodding movement of head is the example of which order lever?",
    options: ["1st", "2nd", "3rd", "4th"],
    correct: 0,
    explanation:
      "Nodding: Fulcrum = atlanto-occipital joint (in the middle conceptually - between the weight of the face/front of skull and the posterior neck muscles). This is a classic 1st order lever example, like a seesaw.",
  },
  {
    id: 13,
    topic: "Biomechanics",
    question:
      "The degrees of freedom of the MCP joint of fingers is:",
    options: ["1", "2", "3", "4"],
    correct: 1,
    explanation:
      "The MCP joints of the fingers are condyloid joints with 2 degrees of freedom: flexion/extension and abduction/adduction. (Rotation is not an active movement at MCP.)",
  },
  {
    id: 14,
    topic: "Biomechanics",
    question: "Ankle dorsiflexion/plantarflexion takes place in:",
    options: [
      "Sagittal plane & frontal axis",
      "Frontal plane & sagittal axis",
      "Transverse plane & vertical axis",
      "Coronal plane & horizontal axis",
    ],
    correct: 0,
    explanation:
      "Flexion/extension movements (including DF/PF) occur in the SAGITTAL plane around a FRONTAL (coronal/transverse) axis. Key rule: the plane of movement and axis of rotation are always perpendicular to each other.",
  },
  {
    id: 15,
    topic: "Biomechanics",
    question: "Pronation and supination take place in:",
    options: [
      "Sagittal plane and frontal axis",
      "Frontal plane and sagittal axis",
      "Transverse plane and vertical axis",
      "Coronal plane and horizontal axis",
    ],
    correct: 2,
    explanation:
      "Pronation/supination are rotational movements occurring in the TRANSVERSE (horizontal) plane around a VERTICAL (longitudinal) axis.",
  },
  {
    id: 16,
    topic: "Exercise Therapy",
    question:
      "Mechanically, assistance/resistance is most effective when it acts at:",
    options: ["Acute angle", "Obtuse angle", "Perpendicular", "0 degrees"],
    correct: 2,
    explanation:
      "Force is most effective when applied perpendicular (90°) to the lever arm. At 90°, all of the applied force contributes to rotation (torque = force × perpendicular distance).",
  },
  {
    id: 17,
    topic: "Exercise Therapy",
    question: "Muscle is most efficient in which range?",
    options: ["Outer", "Outer part of middle", "Inner part of middle", "Inner"],
    correct: 1,
    explanation:
      "Muscles are most efficient in the outer part of middle range. This is where the length-tension relationship is optimal - the muscle has enough overlap of actin and myosin filaments to generate maximum force.",
  },
  {
    id: 18,
    topic: "Exercise Therapy",
    question: "Forearm pronation range of motion is limited due to:",
    options: [
      "Bony contact",
      "Soft tissue approximation",
      "Soft tissue tension",
      "Tension of ligament",
    ],
    correct: 0,
    explanation:
      "Forearm pronation is limited by bony contact - the radius crossing over and contacting the ulna. This gives a 'hard' end feel.",
  },
  {
    id: 19,
    topic: "Exercise Therapy",
    question: "Relaxed passive movement is useful for:",
    options: [
      "Muscle strengthening",
      "Improving joint range of motion",
      "Remembrance of pattern of movement",
      "Improving co-ordination",
    ],
    correct: 1,
    explanation:
      "Relaxed passive movement maintains and improves joint ROM by moving the joint through its available range without active muscle contraction. It also helps maintain tissue extensibility and provides sensory input.",
  },
  {
    id: 20,
    topic: "Exercise Therapy",
    question: "Stretching is the:",
    options: [
      "Slow and sustained forced passive movement",
      "Sudden but controlled forced passive movement",
      "Relaxed passive movement",
      "Manipulation",
    ],
    correct: 0,
    explanation:
      "Stretching = slow and sustained forced passive movement applied beyond the available ROM to elongate shortened structures. Manipulation = sudden thrust. Relaxed passive movement stays within available ROM.",
  },
  {
    id: 21,
    topic: "Exercise Therapy",
    question: "Anterior pelvic tilt is produced by:",
    options: [
      "Hip extensors and abdominals",
      "Hip flexors and lumbar extensors",
      "Hip adductors and trunk side flexors",
      "None of the above",
    ],
    correct: 1,
    explanation:
      "Anterior pelvic tilt: hip flexors pull the front of the pelvis DOWN while lumbar extensors pull the back of the pelvis UP. Together they rotate the pelvis forward. Posterior tilt is the opposite: abdominals + hip extensors (glutes/hamstrings).",
  },
  {
    id: 22,
    topic: "Exercise Therapy",
    question: "In normal standing, line of gravity passes ____ the knee joint.",
    options: ["In front of", "Behind", "Through", "Lateral to"],
    correct: 0,
    explanation:
      "In normal standing, the line of gravity passes slightly ANTERIOR (in front of) the knee joint axis. This creates an extension moment, keeping the knee locked in extension without much muscular effort. The ligaments resist hyperextension.",
  },
  {
    id: 23,
    topic: "Exercise Therapy",
    question: "Active fixation can be achieved by:",
    options: [
      "Co-contraction of muscles",
      "Straps",
      "Manual pressure",
      "None of the above",
    ],
    correct: 0,
    explanation:
      "ACTIVE fixation = stabilization through co-contraction of muscles around a joint. PASSIVE fixation = external means like straps, sandbags, manual pressure by the therapist.",
  },
  {
    id: 24,
    topic: "Exercise Therapy",
    question:
      "Muscles are most often used in the middle range during ADLs, so most efficient within this range. Which is correct?",
    options: [
      "Exercise in outer range is used for muscle re-education",
      "Exercise in middle range is used for muscle tone and power",
      "Exercise in inner range is used for training stabilization",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "All statements are correct: Outer range → re-education (working against gravity at end range), Middle range → tone and power (optimal length-tension), Inner range → stabilization (joint protection, holding).",
  },
  {
    id: 25,
    topic: "Exercise Therapy",
    question:
      "Finger walking on the wall to touch a mark is an example of ____ exercise.",
    options: ["Passive", "Subjective free", "Objective free", "Assisted"],
    correct: 1,
    explanation:
      "Subjective free exercise = the patient performs the exercise voluntarily with a specific goal/target. There's no external assistance or resistance - just the patient actively working toward an objective (touching the mark).",
  },
  {
    id: 26,
    topic: "Exercise Therapy",
    question:
      "In which PRE (Progressive Resistive Exercise) does the load remain constant during the training session?",
    options: ["DeLorme", "Watkin", "Zinovief", "McQueen"],
    correct: 0,
    explanation:
      "DeLorme technique: load is CONSTANT throughout the session (3 sets of 10 reps at 50%, 75%, 100% of 10RM - the 10RM itself stays constant). Oxford/Zinovief: starts heavy and decreases (100%, 75%, 50%). The 10RM is reassessed weekly in DeLorme.",
  },
  {
    id: 27,
    topic: "Exercise Therapy",
    question:
      "In DeLorme's PRE, the progression of 10 RM is made once in:",
    options: ["Daily", "Every week", "Every fortnight", "Every month"],
    correct: 1,
    explanation:
      "DeLorme's protocol: reassess and progress the 10RM every WEEK. Sets: 1st set = 10 reps at 50% 10RM, 2nd set = 10 reps at 75% 10RM, 3rd set = 10 reps at 100% 10RM.",
  },
  {
    id: 28,
    topic: "Exercise Therapy",
    question:
      "Low resistance, high repetition exercise is used to improve muscle:",
    options: ["Strength", "Endurance", "Volume", "Co-ordination"],
    correct: 1,
    explanation:
      "Low resistance + high reps = ENDURANCE training. High resistance + low reps = STRENGTH training. This is a fundamental principle of exercise prescription.",
  },
  {
    id: 29,
    topic: "Exercise Therapy",
    question:
      "Example of soft tissue approximation limiting joint range of motion is:",
    options: [
      "Forearm pronation",
      "Hip flexion with knee extension",
      "Ankle DF with knee flexion",
      "Elbow flexion",
    ],
    correct: 3,
    explanation:
      "Elbow flexion is limited by soft tissue approximation - the muscle bulk of the forearm meets the muscle bulk of the upper arm. Forearm pronation = bony contact. Hip flexion with knee extension = muscle tension (hamstrings).",
  },
  {
    id: 30,
    topic: "Exercise Therapy",
    question: "Example of passive insufficiency is:",
    options: [
      "Hip flexion with knee extension",
      "Fingers flexion with wrist extension",
      "Ankle DF with knee flexion",
      "Shoulder external rotation with abduction",
    ],
    correct: 0,
    explanation:
      "Passive insufficiency = a multi-joint muscle being stretched over all joints simultaneously and limiting ROM. Hip flexion with knee extension: the hamstrings (which cross both hip and knee) are stretched maximally, limiting hip flexion. Active insufficiency = a multi-joint muscle shortening over all joints (e.g., trying to make a tight fist with wrist flexed).",
  },
  {
    id: 31,
    topic: "Exercise Therapy",
    question: "End feel of ____ is bony.",
    options: [
      "Knee extension",
      "Elbow extension",
      "Ankle DF",
      "Forearm supination",
    ],
    correct: 1,
    explanation:
      "Elbow extension has a BONY (hard) end feel - the olecranon process locks into the olecranon fossa. Types of end feel: Bony/Hard = bone on bone (elbow extension), Soft = soft tissue approximation (elbow flexion, knee flexion), Firm/Elastic = capsule/ligament stretch (hip rotation), Springy = internal derangement (abnormal).",
  },
  {
    id: 32,
    topic: "Exercise Therapy",
    question: "Forced passive movement is contraindicated for ____ joint.",
    options: ["Hip", "Knee", "Elbow", "Spine"],
    correct: 2,
    explanation:
      "Forced passive movement is contraindicated at the ELBOW due to high risk of myositis ossificans (heterotopic ossification). The elbow is particularly susceptible to this complication after trauma or aggressive mobilization.",
  },
  {
    id: 33,
    topic: "Exercise Therapy",
    question: "Joint mobilization is contraindicated in:",
    options: [
      "Soft tissue tightness",
      "Joint stiffness",
      "Loose body inside the joint",
      "Bursitis",
    ],
    correct: 2,
    explanation:
      "Joint mobilization is contraindicated when there is a loose body inside the joint - the loose body could get trapped during mobilization and cause further damage. It IS indicated for joint stiffness and capsular tightness.",
  },
  {
    id: 34,
    topic: "Exercise Therapy",
    question: "Glenohumeral anterior glide can improve:",
    options: [
      "Extension range",
      "Flexion range",
      "Extension and external rotation",
      "Flexion and internal rotation range",
    ],
    correct: 2,
    explanation:
      "Anterior glide of the humerus on the glenoid improves EXTENSION and EXTERNAL ROTATION. The convex-concave rule: for the convex humeral head moving on the concave glenoid, the glide is opposite to the roll. Posterior glide → improves flexion and internal rotation.",
  },
  {
    id: 35,
    topic: "Exercise Therapy",
    question: "Kaltenborn has described ____ grades of mobilization.",
    options: ["4", "3", "5", "None of the above"],
    correct: 1,
    explanation:
      "Kaltenborn described 3 grades: Grade I = Loosening (small traction, relieves pain), Grade II = Tightening (takes up slack, used for pain relief), Grade III = Stretching (stretches beyond slack, used to increase ROM). Don't confuse with Maitland's 5 grades.",
  },
  {
    id: 36,
    topic: "Exercise Therapy",
    question: "Leathery end feel is characteristic of:",
    options: [
      "Soft tissue tightness",
      "Capsular tightness",
      "Bony obstruction",
      "Internal derangement",
    ],
    correct: 1,
    explanation:
      "Leathery end feel = characteristic of CAPSULAR tightness (e.g., frozen shoulder). The joint feels like stretching leather at end range. It's a firm end feel with minimal give.",
  },
  {
    id: 37,
    topic: "Exercise Therapy",
    question: "The end feel of loose body inside the joint is:",
    options: ["Elastic", "Hard", "Leathery", "Springy rebound"],
    correct: 3,
    explanation:
      "Loose body in joint → SPRINGY REBOUND (boggy) end feel. This is an abnormal end feel where there's a rebound sensation when pushing into the range, indicating a mechanical block that springs back. This is a red flag finding.",
  },
  {
    id: 38,
    topic: "Exercise Therapy",
    question:
      "Choose the correct statement about muscle work:",
    options: [
      "Physiological cost of concentric work is greater than eccentric",
      "Physiological cost of static work is greater than concentric",
      "Physiological cost of eccentric work is greater than concentric",
      "Physiological cost of isometric work is greater than eccentric",
    ],
    correct: 0,
    explanation:
      "Concentric work has HIGHER physiological (metabolic) cost than eccentric work. Eccentric contractions are more efficient - they can generate more force with less energy expenditure. That's why you can lower more weight than you can lift. Order of metabolic cost: Concentric > Isometric > Eccentric.",
  },
  // === PNF ===
  {
    id: 39,
    topic: "Exercise Therapy",
    question: "PNF was developed by:",
    options: [
      "Kabat & Knott",
      "Knot & Voss",
      "Car & Shepherd",
      "Dardiner & Hollis",
    ],
    correct: 0,
    explanation:
      "PNF (Proprioceptive Neuromuscular Facilitation) was developed by Dr. Herman Kabat and Margaret Knott in the 1940s-50s. Dorothy Voss later co-authored the PNF textbook with Knott. Carr & Shepherd developed the Motor Relearning Programme.",
  },
  {
    id: 40,
    topic: "Exercise Therapy",
    question:
      "Which PNF technique is used in cerebellar ataxia?",
    options: [
      "Repeated contraction",
      "Hold & relax",
      "Rhythmic initiation",
      "Rhythmic stabilization",
    ],
    correct: 2,
    explanation:
      "Rhythmic Initiation is used for cerebellar ataxia and Parkinsonism. It starts with passive movement, progresses to active-assisted, then active, then resisted - teaching the patient to initiate and control movement rhythmically.",
  },
  {
    id: 41,
    topic: "Exercise Therapy",
    question: "Rhythmic Initiation technique is used for:",
    options: ["Tightness", "Flaccid paralysis", "Cerebellar ataxia", "Parkinsonism"],
    correct: 3,
    explanation:
      "Rhythmic initiation is particularly useful in Parkinsonism (rigidity, difficulty initiating movement) and cerebellar ataxia. It helps patients who have difficulty starting or sustaining rhythmic movement.",
  },
  {
    id: 42,
    topic: "Exercise Therapy",
    question: "Groove in PNF refers to:",
    options: [
      "Maximum resistance",
      "Diagonal pattern of movement",
      "Repetition",
      "Proprioceptive stimuli",
    ],
    correct: 1,
    explanation:
      "In PNF, 'groove' refers to the optimal diagonal pattern of movement. The therapist guides the patient through the correct diagonal-spiral pattern. PNF uses diagonal patterns because most functional movements are diagonal, not straight plane.",
  },
  {
    id: 43,
    topic: "Exercise Therapy",
    question: "In PNF, elbow flexion is a component of:",
    options: [
      "Flexion-abduction-external rotation",
      "Flexion-adduction-external rotation",
      "Extension-abduction-internal rotation",
      "All of the above",
    ],
    correct: 1,
    explanation:
      "In PNF upper extremity patterns, elbow flexion is a component of the D2 flexion pattern: Flexion-Adduction-External Rotation. Think of the motion of reaching across to scratch your opposite ear.",
  },
  // === GAIT & CRUTCHES ===
  {
    id: 44,
    topic: "Rehabilitation",
    question:
      "Choose the correct progression of ambulation by a pair of axillary crutches:",
    options: [
      "2 point, 3 point, 4 point",
      "4 point, 3 point, 2 point",
      "3 point, 4 point, 2 point",
      "2 point, 4 point, 3 point",
    ],
    correct: 0,
    explanation:
      "Progression: 2-point → 3-point → 4-point. Wait - actually the correct progression is from most stable to least: 4-point (most stable) → 2-point → 3-point → swing-to → swing-through (least stable). But per this book, the answer is 2, 3, 4 point as listed.",
  },
  {
    id: 45,
    topic: "Rehabilitation",
    question:
      "The correct sequence of stair climbing with a pair of axillary crutches is:",
    options: [
      "Crutches, affected leg, sound leg",
      "Affected leg, sound leg, crutches",
      "Sound leg, affected leg, crutches",
      "Crutches, sound leg, affected leg",
    ],
    correct: 2,
    explanation:
      "Going UP stairs: 'Good goes up first.' Sound leg → affected leg → crutches. Going DOWN stairs: 'Bad goes down first.' Crutches → affected leg → sound leg. Remember: 'Up with the good, down with the bad.'",
  },
  {
    id: 46,
    topic: "Rehabilitation",
    question:
      "A person with unilateral hip problem leans to the affected side and uses a walking stick. On which side should the stick be used?",
    options: [
      "Affected side",
      "Sound side",
      "Either side",
      "Single stick is not useful",
    ],
    correct: 1,
    explanation:
      "Walking stick is used on the OPPOSITE (sound) side. This creates a counterbalancing force that reduces the load on the affected hip. The stick and affected leg advance together, redistributing body weight.",
  },
  {
    id: 47,
    topic: "Rehabilitation",
    question:
      "While descending stairs, the therapist must stand:",
    options: [
      "Behind the patient",
      "Behind the patient towards the weaker side",
      "In front of the patient",
      "In front of the patient towards the weaker side",
    ],
    correct: 3,
    explanation:
      "Descending stairs: therapist stands IN FRONT and toward the WEAKER side to catch the patient if they fall forward. Ascending stairs: therapist stands BEHIND and toward the weaker side.",
  },
  {
    id: 48,
    topic: "Rehabilitation",
    question: "Trendelenburg's sign is positive when:",
    options: [
      "Sound side pelvis drops down while standing on affected side",
      "Affected side pelvis drops down while standing on sound side",
      "Sound side pelvis elevates while standing on affected side",
      "None of the above",
    ],
    correct: 0,
    explanation:
      "Positive Trendelenburg: when standing on the AFFECTED leg, the pelvis on the SOUND (opposite) side DROPS. This indicates weakness of the hip abductors (gluteus medius/minimus) on the stance (affected) side - they can't hold the pelvis level.",
  },
  // === SPECIAL TESTS ===
  {
    id: 49,
    topic: "Musculoskeletal",
    question:
      "In Thomas test position, limitation of hip adduction range indicates shortening of:",
    options: ["TFL", "ITB", "Iliopsoas", "Rectus femoris"],
    correct: 0,
    explanation:
      "Thomas test modifications: If hip ADDUCTION is limited → TFL (tensor fasciae latae) is tight. If hip INTERNAL ROTATION is limited → ITB (iliotibial band) is tight. If hip doesn't fully extend → iliopsoas is tight. If knee doesn't flex → rectus femoris is tight.",
  },
  {
    id: 50,
    topic: "Musculoskeletal",
    question:
      "In Thomas test position, limitation of hip internal rotation range indicates shortening of:",
    options: ["TFL", "ITB", "Iliopsoas", "Rectus femoris"],
    correct: 1,
    explanation:
      "ITB tightness limits hip internal rotation in the Thomas test position. The IT band runs along the lateral thigh and when tight, it resists internal rotation of the hip.",
  },
  {
    id: 51,
    topic: "Musculoskeletal",
    question:
      "Sternocleidomastoid tightness is characterized by ____ deformity:",
    options: [
      "Neck side flexion towards affected side with rotation to opposite side",
      "Neck side flexion towards sound side with rotation to affected side",
      "Neck side flexion and rotation towards the affected side",
      "Neck side flexion and rotation towards the sound side",
    ],
    correct: 0,
    explanation:
      "SCM tightness causes torticollis: the head SIDE FLEXES toward the affected side (ipsilateral) and ROTATES toward the opposite side (contralateral). This is because the SCM's action is ipsilateral side flexion + contralateral rotation.",
  },
  {
    id: 52,
    topic: "Musculoskeletal",
    question: "Ober's test is done to detect shortening of:",
    options: ["Iliopsoas", "IT band", "Hamstrings", "Gastro-soleus"],
    correct: 1,
    explanation:
      "Ober's test = IT band (iliotibial band) / TFL tightness. Patient side-lying, top leg abducted and extended, then allowed to drop into adduction. If leg stays abducted → positive for ITB tightness. Thomas test = hip flexor tightness. SLR = hamstring tightness.",
  },
  {
    id: 53,
    topic: "Musculoskeletal",
    question:
      "During elbow flexion in sitting, Triceps:",
    options: [
      "Works concentrically",
      "Works eccentrically",
      "Works statically",
      "Does not work",
    ],
    correct: 3,
    explanation:
      "During elbow flexion in sitting (like a biceps curl), the BICEPS works concentrically while the TRICEPS does NOT work - it's relaxed via reciprocal inhibition. Gravity is assisting the return (extension), so triceps isn't needed as an antagonist brake during the flexion phase.",
  },
  {
    id: 54,
    topic: "Musculoskeletal",
    question:
      "Leg lowering from extended knee position - Quadriceps works:",
    options: [
      "Concentrically",
      "Eccentrically",
      "Statically",
      "Isokinetically",
    ],
    correct: 1,
    explanation:
      "When lowering the leg from an extended position, gravity is pulling the leg down. Quadriceps works ECCENTRICALLY to control the descent (paying out rope). The muscle is active but lengthening. If it relaxed, the leg would drop uncontrolled.",
  },
  {
    id: 55,
    topic: "Exercise Therapy",
    question:
      "Frenkel's exercises are devised to improve co-ordination using sight, sound and touch in case of ataxia due to:",
    options: [
      "Cerebellar lesion",
      "Loss of kinesthetic sensation",
      "Spastic paralysis",
      "Flaccid paralysis",
    ],
    correct: 1,
    explanation:
      "Frenkel's exercises were specifically designed for SENSORY (posterior column) ATAXIA - loss of kinesthetic/proprioceptive sensation, especially in tabes dorsalis. They use visual and auditory compensation. For CEREBELLAR ataxia, use PNF techniques like rhythmic stabilization.",
  },
  {
    id: 56,
    topic: "Exercise Therapy",
    question:
      "Progression of Frenkel's exercises is made by alteration of:",
    options: [
      "Speed - quick to slow",
      "Range - wider to smaller",
      "Complexity of exercises",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "Frenkel's exercises progress by changing ALL of: speed (slow to fast and back), range (wide to narrow), and complexity (simple single-joint to complex multi-joint). The exercises progress from supine → sitting → standing.",
  },
  {
    id: 57,
    topic: "Exercise Therapy",
    question: "For recovering muscles:",
    options: [
      "Concentric exercises are given before eccentric",
      "Eccentric exercises are given before concentric",
      "Concentric and eccentric exercises are given together",
      "Eccentric exercises are given before static",
    ],
    correct: 0,
    explanation:
      "For recovering/weak muscles: start with CONCENTRIC (shortening) exercises first, then progress to eccentric. Concentric contractions are easier to control and less likely to cause damage in a recovering muscle. Eccentric work produces more force but also more muscle damage.",
  },
  // === CARDIORESPIRATORY ===
  {
    id: 58,
    topic: "Cardiorespiratory",
    question: "Normal tidal volume is approximately:",
    options: ["250 ml", "500 ml", "1000 ml", "1500 ml"],
    correct: 1,
    explanation:
      "Tidal Volume (TV) = ~500 ml. This is the amount of air inhaled or exhaled during normal quiet breathing. Key lung volumes to remember: TV=500ml, IRV=3000ml, ERV=1100ml, RV=1200ml, TLC=6000ml, VC=4600ml, FRC=2300ml.",
  },
  {
    id: 59,
    topic: "Cardiorespiratory",
    question: "Normal respiratory rate in adults is:",
    options: [
      "8-12 breaths/min",
      "12-20 breaths/min",
      "20-30 breaths/min",
      "30-40 breaths/min",
    ],
    correct: 1,
    explanation:
      "Normal adult respiratory rate = 12-20 breaths/min. <12 = bradypnea. >20 = tachypnea. Newborn = 30-60/min. Remember: respiratory rate is one of the most sensitive early indicators of patient deterioration.",
  },
  {
    id: 60,
    topic: "Cardiorespiratory",
    question: "Normal resting heart rate in adults is:",
    options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "80-120 bpm"],
    correct: 1,
    explanation:
      "Normal resting HR = 60-100 bpm. <60 = bradycardia (can be normal in athletes). >100 = tachycardia. Normal BP: 120/80 mmHg. Normal SpO2: 95-100%.",
  },
  {
    id: 61,
    topic: "Cardiorespiratory",
    question: "Postural drainage for the right middle lobe requires the patient to be in:",
    options: [
      "Supine with right side elevated",
      "Left side lying, 1/4 turn back, foot of bed elevated",
      "Prone with pillow under abdomen",
      "Sitting upright leaning forward",
    ],
    correct: 1,
    explanation:
      "Right middle lobe: patient lies on LEFT side, 1/4 turn back, with foot of bed elevated ~15 degrees. Gravity helps drain the right middle lobe segments toward the trachea. Each lobe position uses gravity to drain specific segments.",
  },
  {
    id: 62,
    topic: "Cardiorespiratory",
    question: "Central cyanosis is seen in:",
    options: [
      "Tongue and lips",
      "Fingertips and nail beds",
      "Earlobes only",
      "Palms and soles",
    ],
    correct: 0,
    explanation:
      "CENTRAL cyanosis = tongue, lips, mucous membranes (indicates systemic hypoxemia - low O2 in arterial blood). PERIPHERAL cyanosis = fingertips, nail beds, earlobes (can be due to poor local circulation/cold). Central cyanosis is more clinically significant.",
  },
  // === NEUROSCIENCE ===
  {
    id: 63,
    topic: "Neuroscience",
    question: "Upper motor neuron lesion is characterized by:",
    options: [
      "Flaccidity, hypotonia, areflexia",
      "Spasticity, hypertonia, hyperreflexia",
      "Fasciculations and fibrillations",
      "Muscle atrophy early on",
    ],
    correct: 1,
    explanation:
      "UMN lesion: Spasticity, Hypertonia, Hyperreflexia, Positive Babinski, NO fasciculations, late/mild atrophy (disuse). LMN lesion: Flaccidity, Hypotonia, Areflexia/Hyporeflexia, Fasciculations, Early severe atrophy, Negative Babinski.",
  },
  {
    id: 64,
    topic: "Neuroscience",
    question: "Glasgow Coma Scale maximum score is:",
    options: ["12", "15", "10", "8"],
    correct: 1,
    explanation:
      "GCS maximum = 15 (fully conscious). Eye opening: 4, Verbal response: 5, Motor response: 6. Total = 4+5+6 = 15. Minimum = 3 (deep coma). GCS ≤8 = severe brain injury, intubation usually needed.",
  },
  {
    id: 65,
    topic: "Neuroscience",
    question: "Modified Ashworth Scale for grading spasticity has how many grades?",
    options: ["4", "5", "6", "3"],
    correct: 2,
    explanation:
      "Modified Ashworth Scale has 6 grades: 0 (no increase in tone), 1 (slight catch), 1+ (slight increase through <½ ROM), 2 (marked increase through most ROM), 3 (considerable increase, passive movement difficult), 4 (rigid). The original Ashworth had 5 grades (no 1+).",
  },
  {
    id: 66,
    topic: "Neuroscience",
    question: "Which cranial nerve is tested by the gag reflex?",
    options: [
      "VII (Facial)",
      "IX (Glossopharyngeal) and X (Vagus)",
      "XI (Accessory)",
      "XII (Hypoglossal)",
    ],
    correct: 1,
    explanation:
      "Gag reflex: Sensory (afferent) = CN IX (Glossopharyngeal), Motor (efferent) = CN X (Vagus). Both nerves are tested together. CN XII = tongue movements. CN VII = facial expression, taste anterior 2/3.",
  },
  {
    id: 67,
    topic: "Neuroscience",
    question: "Babinski sign positive indicates:",
    options: [
      "Lower motor neuron lesion",
      "Upper motor neuron lesion",
      "Cerebellar lesion",
      "Peripheral nerve injury",
    ],
    correct: 1,
    explanation:
      "Positive Babinski (great toe dorsiflexion + fanning of other toes when sole is stroked) = UMN lesion. It's normal in infants up to ~2 years (immature corticospinal tract). In adults, it always indicates UMN pathology.",
  },
  // === ELECTROTHERAPY ===
  {
    id: 68,
    topic: "Electrotherapy",
    question: "Ultrasound therapy is contraindicated over:",
    options: [
      "Muscle belly",
      "Tendon sheath",
      "Eyes and pregnant uterus",
      "Chronic wounds",
    ],
    correct: 2,
    explanation:
      "Ultrasound contraindications: Eyes, pregnant uterus, testes, heart, brain, growth plates in children, malignancy, DVT, active infection, metal implants (relative). It's used therapeutically on muscles, tendons, and chronic wounds.",
  },
  {
    id: 69,
    topic: "Electrotherapy",
    question: "The frequency of therapeutic ultrasound is:",
    options: [
      "0.5-1 MHz",
      "1-3 MHz",
      "3-5 MHz",
      "5-10 MHz",
    ],
    correct: 1,
    explanation:
      "Therapeutic ultrasound: 1-3 MHz. 1 MHz = deeper penetration (up to 5cm), used for deep tissues. 3 MHz = superficial penetration (1-2cm), used for superficial structures. Diagnostic ultrasound uses higher frequencies (3-15 MHz).",
  },
  {
    id: 70,
    topic: "Electrotherapy",
    question: "Short Wave Diathermy (SWD) frequency is:",
    options: ["13.56 MHz", "27.12 MHz", "40.68 MHz", "2450 MHz"],
    correct: 1,
    explanation:
      "SWD frequency = 27.12 MHz (wavelength = 11.06 meters). This is the most commonly used frequency. Microwave diathermy = 2450 MHz. These are ISM (Industrial, Scientific, Medical) band frequencies allocated for medical use.",
  },
  {
    id: 71,
    topic: "Electrotherapy",
    question: "TENS is primarily used for:",
    options: [
      "Muscle strengthening",
      "Pain relief",
      "Wound healing",
      "Reducing edema",
    ],
    correct: 1,
    explanation:
      "TENS (Transcutaneous Electrical Nerve Stimulation) is primarily used for PAIN RELIEF. It works via the Gate Control Theory (high frequency TENS) and endorphin release (low frequency/acupuncture-like TENS). It does NOT strengthen muscles - that's NMES.",
  },
  {
    id: 72,
    topic: "Electrotherapy",
    question: "Interferential therapy uses a base frequency of:",
    options: ["1000 Hz", "2000 Hz", "4000 Hz", "5000 Hz"],
    correct: 2,
    explanation:
      "Interferential therapy (IFT) uses two medium-frequency currents of around 4000 Hz that cross and interfere with each other to produce a beat frequency (AMF) of 0-250 Hz. The medium frequency allows deeper penetration with less skin resistance than low-frequency currents.",
  },
  // === EXERCISE THERAPY (continued) ===
  {
    id: 73,
    topic: "Exercise Therapy",
    question: "Water temperature in hydrotherapy unit is maintained at:",
    options: ["27-35°C", "22-42°C", "32-35°C", "None of the above"],
    correct: 0,
    explanation:
      "The standard hydrotherapy pool temperature is 27-35°C. Warm water (33-35°C) is used for relaxation and pain relief, while cooler temperatures (27-30°C) suit vigorous exercise. Temperatures above 37°C risk hypotension and fatigue.",
  },
  {
    id: 74,
    topic: "Exercise Therapy",
    question:
      "Upward movement of a body part in water is assisted by:",
    options: ["Gravity", "Buoyancy", "Hydrostatic pressure", "Water current"],
    correct: 1,
    explanation:
      "Buoyancy is the upward thrust exerted by water on an immersed body (Archimedes' principle). It assists upward movements, resists downward movements, and supports the body's weight. This makes buoyancy-assisted exercises ideal for weak muscles.",
  },
  {
    id: 75,
    topic: "Exercise Therapy",
    question:
      "Which property of water helps a patient with lower extremity weakness to stand in a pool?",
    options: [
      "Buoyancy",
      "Temperature",
      "Hydrostatic pressure",
      "Specific gravity",
    ],
    correct: 2,
    explanation:
      "Hydrostatic pressure acts equally on all surfaces of the immersed body (Pascal's law), providing circumferential support that helps stabilize the lower extremities. This external compression assists venous return and supports weak limbs, enabling patients to stand who otherwise could not on land.",
  },
  {
    id: 76,
    topic: "Exercise Therapy",
    question: "Mitchell relaxation technique is based on:",
    options: [
      "Reciprocal innervation",
      "Autogenic inhibition",
      "Cue controlled relaxation",
      "Release only technique",
    ],
    correct: 0,
    explanation:
      "Mitchell's relaxation technique uses the principle of reciprocal innervation (Sherrington's law). By actively contracting the muscle opposite to the tense one, the tense muscle reflexly relaxes. For example, to relax shoulder elevators, the patient actively depresses the shoulders.",
  },
  {
    id: 77,
    topic: "Exercise Therapy",
    question: "Valsalva Maneuver should be avoided for:",
    options: [
      "Hypertension patients",
      "Geriatric patients",
      "Abdominal surgery patients",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "The Valsalva maneuver (forced expiration against a closed glottis) dangerously raises intrathoracic and intra-abdominal pressure. It must be avoided in hypertension (blood pressure spike), geriatric patients (cardiovascular risk), and post-abdominal surgery (stress on the incision). Patients should be taught to breathe out during exertion.",
  },
  {
    id: 78,
    topic: "Exercise Therapy",
    question: "Delayed Onset Muscle Soreness (DOMS) peaks at:",
    options: ["1-2 days", "2-3 days", "1 week", "None of the above"],
    correct: 0,
    explanation:
      "DOMS typically peaks at 24-48 hours (1-2 days) after unaccustomed exercise, particularly eccentric exercise. It results from microtrauma to muscle fibers and the subsequent inflammatory response. DOMS resolves within 5-7 days and should not be confused with acute muscle strain.",
  },
  {
    id: 79,
    topic: "Exercise Therapy",
    question:
      "The most important variable for muscle force generation is:",
    options: ["Load", "Duration", "Sets", "Frequency"],
    correct: 0,
    explanation:
      "Load (resistance/intensity) is the single most important variable for generating muscle force and strength gains. The overload principle states that muscles must be challenged beyond their current capacity. While duration, sets, and frequency matter, without adequate load, strength gains will not occur.",
  },
  {
    id: 80,
    topic: "Exercise Therapy",
    question:
      "Minimum duration of an exercise programme to gain significant strength is:",
    options: ["3 weeks", "6 weeks", "10 weeks", "12 weeks"],
    correct: 1,
    explanation:
      "A minimum of 6 weeks is needed for measurable strength gains. Initial gains in the first 2-3 weeks are primarily neural adaptations (improved motor unit recruitment and firing rate). True muscle hypertrophy requires at least 6-8 weeks of consistent progressive training.",
  },
  {
    id: 81,
    topic: "Exercise Therapy",
    question:
      "Progression of exercises after musculoskeletal injury follows the order:",
    options: [
      "Isometric → Eccentric → Concentric",
      "Isometric → Concentric → Concentric & Eccentric",
      "Concentric → Eccentric → Concentric & Eccentric",
      "Isometric → Concentric → Eccentric",
    ],
    correct: 0,
    explanation:
      "After MSK injury, the safest progression is: Isometric (no joint movement, safe early on) → Eccentric (controlled lengthening, builds tendon strength) → Concentric (active shortening through range). Isometrics are started first because they can be performed without stressing healing tissues through range.",
  },
  {
    id: 82,
    topic: "Exercise Therapy",
    question: "In slow sustained stretching, what fires?",
    options: [
      "GTO fires, causing inhibition",
      "Muscle spindle fires",
      "Monosynaptic stretch reflex fires",
      "None of the above",
    ],
    correct: 0,
    explanation:
      "In slow sustained stretching, the Golgi Tendon Organ (GTO) fires when tension builds in the tendon, triggering autogenic inhibition - the muscle reflexly relaxes. This is why slow stretching is effective and safe. Quick stretching activates muscle spindles instead, causing a protective contraction (stretch reflex) that opposes the stretch.",
  },
  {
    id: 83,
    topic: "Exercise Therapy",
    question:
      "Optimal hold time for isometric contractions is:",
    options: ["6 seconds", "10 seconds", "12 seconds", "12 seconds"],
    correct: 0,
    explanation:
      "The optimal hold time for isometric contractions is 6 seconds. Research by Hettinger and Muller showed that a 6-second maximal isometric hold is sufficient to stimulate strength gains. Longer holds add fatigue without proportional benefit. The standard protocol is 6-second hold with brief rest between repetitions.",
  },
  {
    id: 84,
    topic: "Exercise Therapy",
    question: "Hopping, skipping, and jumping are forms of:",
    options: [
      "Eccentric exercises",
      "Plyometric exercises",
      "Concentric followed by eccentric",
      "None of the above",
    ],
    correct: 1,
    explanation:
      "Plyometrics involve a rapid eccentric contraction immediately followed by a powerful concentric contraction (stretch-shortening cycle). Hopping, skipping, and jumping use stored elastic energy from the eccentric phase to produce explosive concentric force. They are used in advanced rehabilitation and sports training.",
  },
  {
    id: 85,
    topic: "Exercise Therapy",
    question:
      "Double support phase is present at ____ phase of stance:",
    options: [
      "Beginning only",
      "End only",
      "Beginning and end",
      "Mid stance",
    ],
    correct: 2,
    explanation:
      "Double support (both feet on ground) occurs at the BEGINNING of stance (initial contact/loading response, when the other foot is about to leave) and at the END of stance (pre-swing/terminal stance, when the other foot has just contacted). Mid stance is a single-support phase. Double support disappears in running.",
  },
  {
    id: 86,
    topic: "Exercise Therapy",
    question:
      "The center of gravity is displaced to its highest level during ____ phase:",
    options: ["Foot flat", "Mid stance", "Double support", "Mid swing"],
    correct: 1,
    explanation:
      "The center of gravity (COG) reaches its HIGHEST point during mid stance, when the body vaults over the stance limb like an inverted pendulum. It is at its LOWEST during double support. This vertical oscillation of about 5cm is a key determinant of gait efficiency.",
  },
  {
    id: 87,
    topic: "Exercise Therapy",
    question: "Cadence in normal locomotion is:",
    options: [
      "70-90 steps/min",
      "90-110 steps/min",
      "90-130 steps/min",
      "70-130 steps/min",
    ],
    correct: 3,
    explanation:
      "Normal cadence ranges from 70-130 steps per minute, varying with age, height, and gender. Average adult cadence is approximately 100-120 steps/min. Women tend to have a slightly higher cadence than men. Cadence naturally decreases with aging.",
  },
  {
    id: 88,
    topic: "Exercise Therapy",
    question: "At heel strike, the dorsiflexors act:",
    options: [
      "Eccentrically",
      "Concentrically",
      "Plantarflexors eccentrically",
      "Plantarflexors concentrically",
    ],
    correct: 0,
    explanation:
      "At heel strike (initial contact), the dorsiflexors (tibialis anterior) contract ECCENTRICALLY to control the lowering of the foot to the ground (preventing foot slap). Without this eccentric control, the forefoot would slap the ground abruptly. This is the loading response deceleration mechanism.",
  },
  {
    id: 89,
    topic: "Exercise Therapy",
    question:
      "____ muscle acts as a decelerator in normal locomotion:",
    options: ["Iliopsoas", "Gastro-soleus", "Hamstrings", "Quadriceps"],
    correct: 2,
    explanation:
      "The hamstrings act as primary decelerators during terminal swing phase, eccentrically contracting to slow the forward swing of the leg and control knee extension before heel strike. Without hamstring deceleration, the knee would snap into hyperextension. This is why hamstring strains often occur during sprinting.",
  },
  {
    id: 90,
    topic: "Exercise Therapy",
    question:
      "Hip abductor weakness causes lateral trunk bending which shifts:",
    options: [
      "Improves walking efficacy",
      "Shifts the weight line closer to the hip joint",
      "Causes apparent weight loss",
      "Creates forward momentum",
    ],
    correct: 1,
    explanation:
      "In hip abductor weakness (Trendelenburg gait), the patient leans the trunk over the affected hip (compensated Trendelenburg/gluteus medius lurch). This shifts the body's weight line closer to the hip joint center, reducing the demand on weak abductors by shortening the moment arm of body weight.",
  },
  {
    id: 91,
    topic: "Exercise Therapy",
    question:
      "____ massage manipulation is used for sensory stimulation:",
    options: ["Stroking", "Effleurage", "Kneading", "Friction"],
    correct: 0,
    explanation:
      "Stroking is a light, superficial massage technique primarily used for sensory stimulation and reflexive effects. It stimulates cutaneous nerve endings and can be sedative (slow stroking) or stimulatory (quick stroking). Effleurage is deeper and promotes circulation; kneading works on deeper tissues; friction targets adhesions.",
  },
  {
    id: 92,
    topic: "Exercise Therapy",
    question: "Which is NOT a tapotement technique?",
    options: ["Clapping", "Beating", "Pounding", "Petrissage"],
    correct: 3,
    explanation:
      "Petrissage (kneading, wringing, picking up) is NOT tapotement - it is a separate massage category involving compression and release of soft tissue. Tapotement (percussion) techniques include clapping/cupping, beating, pounding, hacking, and tapping. Tapotement stimulates circulation and can facilitate or inhibit muscle tone depending on duration.",
  },
  // === ELECTROTHERAPY ===
  {
    id: 93,
    topic: "Electrotherapy",
    question:
      "International color code for active/neutral/earth wires is:",
    options: [
      "Red-brown / Black-blue / Yellow-green",
      "Black-blue / Red-brown / Yellow-green",
      "Yellow-green / Red-brown / Black-blue",
      "Red-brown / Yellow-green / Black-blue",
    ],
    correct: 0,
    explanation:
      "The international wiring color code: Live/Active = Red (old) or Brown (new), Neutral = Black (old) or Blue (new), Earth = Yellow-green (unchanged). Knowing wire identification is essential for safe equipment handling and electrical safety in the physiotherapy department.",
  },
  {
    id: 94,
    topic: "Electrotherapy",
    question:
      "To reduce skin resistance before electrical stimulation, one should:",
    options: [
      "Wash skin with soap and water",
      "Massage the area",
      "Soak the area",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "All methods help reduce skin impedance: washing removes oils and dead skin, massage increases local blood flow and reduces resistance, and soaking hydrates the skin (dry skin has very high resistance). Lower skin resistance ensures more effective and comfortable current delivery.",
  },
  {
    id: 95,
    topic: "Electrotherapy",
    question: "Burns in electrotherapy are due to:",
    options: [
      "Overdose of current",
      "Inability to dissipate heat",
      "Loss of sensation",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "Electrotherapy burns can result from all these factors: overdose delivers excessive energy, inability to dissipate heat (poor circulation, scar tissue, metal implants) causes focal heating, and loss of sensation means the patient cannot report discomfort early. This is why sensation testing before treatment is mandatory.",
  },
  {
    id: 96,
    topic: "Electrotherapy",
    question:
      "The change in action potential needed to trigger depolarization is:",
    options: ["5-10 mV", "10-15 mV", "15-20 mV", ">25 mV"],
    correct: 1,
    explanation:
      "A membrane potential change of 10-15 mV from the resting potential (-70 mV) is needed to reach threshold (approximately -55 mV) and trigger depolarization. Once threshold is reached, the all-or-none principle applies and a full action potential is generated regardless of stimulus strength.",
  },
  {
    id: 97,
    topic: "Electrotherapy",
    question: "Low frequency current is defined as up to:",
    options: ["1000 Hz", "50 Hz", "100 Hz", "None of the above"],
    correct: 0,
    explanation:
      "Low frequency current = up to 1000 Hz (1 kHz). Medium frequency = 1000-100,000 Hz (1-100 kHz). High frequency = above 100,000 Hz (>100 kHz). Low frequency currents (like TENS, faradic) directly stimulate nerves and muscles. High frequency currents produce thermal effects.",
  },
  {
    id: 98,
    topic: "Electrotherapy",
    question: "Russian current is classified as:",
    options: [
      "Low frequency",
      "Medium frequency",
      "High frequency",
      "None of the above",
    ],
    correct: 1,
    explanation:
      "Russian current is a medium frequency current (2500 Hz sinusoidal AC, delivered in 50 bursts per second). Developed by Kots for muscle strengthening in Soviet athletes. Medium frequency currents penetrate deeper with less skin discomfort than low frequency currents.",
  },
  {
    id: 99,
    topic: "Electrotherapy",
    question: "Faradic current is:",
    options: [
      "Alternating current",
      "Direct current",
      "Interrupted current",
      "Modified current",
    ],
    correct: 0,
    explanation:
      "Faradic current is an alternating current (AC) with a pulse duration of 0.1-1 ms and frequency of 50-100 Hz. It is a surged, short-duration current used to stimulate innervated muscles. Because it is AC, it avoids the chemical (polar) effects seen with DC.",
  },
  {
    id: 100,
    topic: "Electrotherapy",
    question: "Galvanic current is:",
    options: [
      "Alternating current",
      "Direct current",
      "Interrupted current",
      "Modified current",
    ],
    correct: 1,
    explanation:
      "Galvanic current is a continuous, unidirectional direct current (DC). It produces chemical effects at the electrodes (acid under anode, alkali under cathode) and is used for iontophoresis, wound healing, and testing the reaction of degeneration in denervated muscles.",
  },
  {
    id: 101,
    topic: "Electrotherapy",
    question:
      "Absolute contraindication for electrical stimulation is:",
    options: [
      "Cardiac pacemaker",
      "Insensitive skin",
      "Unconscious patient",
      "Ischemic heart disease",
    ],
    correct: 0,
    explanation:
      "A cardiac pacemaker is an ABSOLUTE contraindication for electrical stimulation because the external current can interfere with pacemaker function, causing life-threatening arrhythmias. Insensitive skin and unconscious patients are relative contraindications (can be treated with extra caution). Ischemic heart is a precaution, not absolute.",
  },
  {
    id: 102,
    topic: "Electrotherapy",
    question: "Pulses of TENS are usually:",
    options: [
      "Uniphasic",
      "Biphasic",
      "Biphasic even charge",
      "Biphasic even charge, equal or unequal amplitude",
    ],
    correct: 3,
    explanation:
      "TENS typically uses biphasic pulses with even (balanced) charge to avoid the chemical irritation that occurs with unbalanced waveforms. The phases can have equal or unequal amplitudes, as long as the net charge is zero. This prevents ion accumulation under the electrodes and reduces skin irritation.",
  },
  {
    id: 103,
    topic: "Electrotherapy",
    question: "Non-myelinated nerve fiber is:",
    options: ["A-alpha", "A-beta", "A-gamma", "C fiber"],
    correct: 3,
    explanation:
      "C fibers are the only non-myelinated (unmyelinated) nerve fibers. They conduct slowly (0.5-2 m/s) and carry dull, aching pain and temperature. A-alpha (proprioception, motor), A-beta (touch, pressure), and A-gamma (muscle spindle motor) are all myelinated with faster conduction velocities.",
  },
  {
    id: 104,
    topic: "Electrotherapy",
    question: "Optimal frequency for muscle contraction is:",
    options: ["10-20 Hz", "20-30 Hz", "30-40 Hz", "40-60 Hz"],
    correct: 2,
    explanation:
      "The optimal frequency for a tetanic (smooth, fused) muscle contraction is 30-40 Hz. Below 20 Hz produces visible twitches (unfused tetanus). Above 50 Hz adds no additional force but increases fatigue. Clinical NMES protocols typically use 30-50 Hz for effective muscle training.",
  },
  {
    id: 105,
    topic: "Electrotherapy",
    question:
      "Better electrotherapy modality for stress incontinence is:",
    options: ["TENS", "Faradic current", "Interferential therapy", "IDC"],
    correct: 2,
    explanation:
      "Interferential therapy (IFT) is preferred for stress urinary incontinence because its medium frequency carrier (4000 Hz) penetrates deeply to reach the pelvic floor muscles with less discomfort. IFT effectively stimulates pelvic floor contractions and improves muscle awareness, complementing pelvic floor exercise programs.",
  },
  {
    id: 106,
    topic: "Electrotherapy",
    question: "Rheobase in denervated muscle:",
    options: [
      "Remains unchanged",
      "Increases",
      "Decreases",
      "First increases then decreases",
    ],
    correct: 1,
    explanation:
      "In denervated muscle, rheobase INCREASES because the muscle can no longer be stimulated through its nerve. Direct muscle stimulation requires higher current intensity than nerve stimulation. Chronaxie also increases significantly in denervation, which is the basis of the strength-duration curve test for detecting denervation.",
  },
  {
    id: 107,
    topic: "Electrotherapy",
    question: "Rheobase is defined as:",
    options: [
      "Maximum tolerable current at long duration",
      "Minimum current for impulse at short duration",
      "Minimum current intensity to produce an impulse at long (infinite) duration",
      "None of the above",
    ],
    correct: 2,
    explanation:
      "Rheobase is the minimum current intensity needed to stimulate a nerve or muscle when the pulse duration is infinitely long. Chronaxie is the pulse duration needed to stimulate at twice the rheobase intensity. These values are clinically important for plotting strength-duration curves and detecting denervation.",
  },
  {
    id: 108,
    topic: "Electrotherapy",
    question:
      "High frequency current applied to the body produces:",
    options: [
      "Motor stimulation",
      "Sensory stimulation",
      "Heat",
      "None of the above",
    ],
    correct: 2,
    explanation:
      "High frequency currents (>100 kHz) produce HEAT in body tissues, not nerve or muscle stimulation. At high frequencies, the alternation is too rapid for nerve depolarization. This is the basis of diathermy (SWD, MWD). Low frequency currents stimulate nerves and muscles; high frequency currents produce thermal effects.",
  },
  {
    id: 109,
    topic: "Electrotherapy",
    question: "Which is NOT a deep heating modality?",
    options: [
      "Ultrasound",
      "Short Wave Diathermy",
      "Microwave Diathermy",
      "Hot Pack",
    ],
    correct: 3,
    explanation:
      "Hot pack (hydrocollator pack) is a SUPERFICIAL heating modality - it heats only the skin and subcutaneous tissue (up to 1-2 cm depth). Deep heating modalities include ultrasound (up to 5 cm), SWD, and MWD, which can heat tissues at 3-5 cm depth including muscle and joint structures.",
  },
  {
    id: 110,
    topic: "Electrotherapy",
    question:
      "The tissue that accumulates maximum heat with condenser field method of SWD is:",
    options: ["Skin", "Subcutaneous fat", "Muscle", "Blood"],
    correct: 1,
    explanation:
      "With the condenser (capacitor) field method of SWD, subcutaneous FAT heats the most because fat has low water content and therefore low conductivity, causing resistance heating. This is a disadvantage when targeting deeper muscles. The cable/induction coil method heats muscle more effectively because it induces eddy currents in highly conductive tissues.",
  },
  {
    id: 111,
    topic: "Electrotherapy",
    question:
      "The tissue heated most with the cable (induction coil) method of SWD is:",
    options: ["Periosteum", "Blood", "Bone", "Muscle"],
    correct: 3,
    explanation:
      "The cable/induction coil method of SWD produces a strong magnetic field that generates eddy currents preferentially in tissues with high electrolyte content and conductivity - primarily MUSCLE. This makes the cable method better for heating deep muscles, while the condenser method unfortunately heats fat more.",
  },
  {
    id: 112,
    topic: "Electrotherapy",
    question: "The therapeutic frequency of SWD is:",
    options: ["27.12 KHz", "27.12 MHz", "27.12 GHz", "None of the above"],
    correct: 1,
    explanation:
      "SWD operates at 27.12 MHz (megahertz), with a wavelength of 11.06 meters. This is a radio frequency allocated by international agreement for medical use (ISM band). KHz would be too low (audio range) and GHz would be microwave range. The other permitted frequencies are 13.56 MHz and 40.68 MHz.",
  },
  {
    id: 113,
    topic: "Electrotherapy",
    question:
      "Movement of drug through the skin under ultrasound influence is called:",
    options: [
      "Iontophoresis",
      "Phonophoresis",
      "Both iontophoresis and phonophoresis",
      "None of the above",
    ],
    correct: 1,
    explanation:
      "Phonophoresis (sonophoresis) uses ultrasound energy to drive topical medications through the skin. Iontophoresis uses direct electrical current (galvanic) to drive ionized drugs through the skin. The key distinction: phonophoresis = ultrasound-driven; iontophoresis = electrically-driven drug delivery.",
  },
  {
    id: 114,
    topic: "Electrotherapy",
    question: "Pulsed ultrasound treatment is primarily given for:",
    options: [
      "Thermal effect",
      "Non-thermal (mechanical) effect",
      "Achieving higher intensities safely",
      "Chronic conditions",
    ],
    correct: 1,
    explanation:
      "Pulsed ultrasound is used primarily for NON-THERMAL (mechanical) effects including cavitation, acoustic streaming, and micromassage. The off periods allow heat dissipation, making it safe for acute conditions. Continuous ultrasound is used when thermal effects are desired (chronic conditions).",
  },
  {
    id: 115,
    topic: "Electrotherapy",
    question:
      "Pulsed ultrasound with pulse length 2ms and interval 8ms has a duty cycle of:",
    options: ["25%", "20%", "10%", "None of the above"],
    correct: 1,
    explanation:
      "Duty cycle = pulse ON time / (ON time + OFF time) x 100. Here: 2ms / (2ms + 8ms) x 100 = 2/10 x 100 = 20%. The duty cycle determines the average power output. A 20% duty cycle means the transducer is active only 1/5 of the treatment time, minimizing thermal build-up.",
  },
  {
    id: 116,
    topic: "Electrotherapy",
    question: "Neonatal jaundice is treated by:",
    options: [
      "Red light",
      "Blue light (phototherapy)",
      "Infrared radiation",
      "Yellow light",
    ],
    correct: 1,
    explanation:
      "Neonatal jaundice is treated with BLUE light phototherapy (wavelength 420-470 nm). Blue light converts unconjugated bilirubin in the skin into water-soluble photoisomers that can be excreted without liver conjugation. This is one of the few phototherapy applications in physiotherapy/medical practice.",
  },
  {
    id: 117,
    topic: "Electrotherapy",
    question: "Spasticity can be reduced by:",
    options: ["Heating", "Cooling", "Short wave diathermy", "TENS"],
    correct: 1,
    explanation:
      "COOLING (cryotherapy) reduces spasticity by decreasing nerve conduction velocity, reducing muscle spindle sensitivity, and decreasing gamma motor neuron activity. Cold application (ice packs, cold baths) for 15-20 minutes can provide a therapeutic window of reduced tone lasting 1-2 hours for exercise and functional training.",
  },
  // === ORTHOPAEDICS ===
  {
    id: 118,
    topic: "Orthopaedics",
    question: "The term 'Orthopaedic' originally means:",
    options: [
      "Correcting/preventing deformities in children",
      "Management of fractures and dislocations",
      "Diseases of the trunk and limbs",
      "Disorders of bones, joints, muscles and ligaments",
    ],
    correct: 0,
    explanation:
      "Orthopaedic derives from Greek: 'orthos' (straight/correct) and 'paidos' (child). Nicolas Andry coined the term in 1741, originally meaning the correction and prevention of deformities in children. The scope has since expanded to cover all musculoskeletal conditions across all ages.",
  },
  {
    id: 119,
    topic: "Orthopaedics",
    question: "Greenstick fracture is seen in:",
    options: ["Adults", "Children", "Any age", "Elderly"],
    correct: 1,
    explanation:
      "Greenstick fractures occur exclusively in CHILDREN because their bones are more pliable and have a thicker periosteum. The bone bends and cracks on the tension side but does not break completely, like bending a green twig. Adults' more brittle bones fracture completely.",
  },
  {
    id: 120,
    topic: "Orthopaedics",
    question: "Rickets is due to deficiency of:",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    correct: 3,
    explanation:
      "Rickets is caused by Vitamin D deficiency in children, resulting in defective mineralization of growing bones. It leads to soft, deformed bones (bow legs, knock knees, rickety rosary). In adults, the same deficiency causes osteomalacia. Vitamin D is essential for calcium and phosphorus absorption.",
  },
  {
    id: 121,
    topic: "Orthopaedics",
    question: "The neck-shaft angle of the humerus is approximately:",
    options: ["45 degrees", "60 degrees", "90 degrees", "120 degrees"],
    correct: 3,
    explanation:
      "The neck-shaft angle of the humerus is approximately 120-130 degrees. This angle is clinically important when assessing fracture displacement and planning surgical fixation of proximal humerus fractures. An altered neck-shaft angle (varus or valgus) affects shoulder biomechanics and function.",
  },
  {
    id: 122,
    topic: "Orthopaedics",
    question: "The close-packed position of the shoulder (glenohumeral joint) is:",
    options: [
      "Abduction and external rotation",
      "Flexion and external rotation",
      "Horizontal abduction and external rotation",
      "None of the above",
    ],
    correct: 0,
    explanation:
      "The close-packed position of the glenohumeral joint is full abduction and external rotation. In this position, the capsule and ligaments are maximally taut, joint surfaces are maximally congruent, and the joint is most stable. This is also the position of greatest vulnerability to dislocation if forced beyond normal range.",
  },
  {
    id: 123,
    topic: "Orthopaedics",
    question: "The capsular pattern of the shoulder joint is:",
    options: [
      "Lateral rotation most restricted",
      "Rotation and flexion equally restricted",
      "External rotation and abduction most restricted",
      "Decreased external rotation only",
    ],
    correct: 2,
    explanation:
      "The capsular pattern of the shoulder is: External Rotation most limited > Abduction > Internal Rotation (ER > Abd > IR). This pattern is characteristic of capsular inflammation (e.g., frozen shoulder/adhesive capsulitis). A non-capsular pattern suggests a non-capsular lesion like a loose body or ligament sprain.",
  },
  {
    id: 124,
    topic: "Orthopaedics",
    question:
      "The commonest structure impinged in shoulder impingement syndrome is:",
    options: [
      "Infraspinatus tendon",
      "Supraspinatus tendon",
      "Long head of biceps",
      "Subacromial bursa",
    ],
    correct: 1,
    explanation:
      "The supraspinatus tendon is the most commonly impinged structure because it passes through the narrow subacromial space beneath the acromion. Its critical zone (1 cm proximal to insertion) is relatively avascular, making it susceptible to degeneration and tears. Neer's impingement test and Hawkins-Kennedy test assess this.",
  },
  {
    id: 125,
    topic: "Orthopaedics",
    question: "A positive drop arm test indicates:",
    options: [
      "Weakness of deltoid",
      "Rupture of supraspinatus tendon",
      "Positive painful arc",
      "None of the above",
    ],
    correct: 1,
    explanation:
      "The drop arm test: the arm is passively abducted to 90 degrees then the patient tries to slowly lower it. If the arm drops suddenly, it indicates a complete ROTATOR CUFF (supraspinatus) TEAR. The supraspinatus cannot control the eccentric lowering. A partial tear may show a painful arc between 60-120 degrees but maintains control.",
  },
  {
    id: 126,
    topic: "Orthopaedics",
    question:
      "Fracture of the shaft of humerus is commonly associated with injury to:",
    options: [
      "Axillary nerve",
      "Radial nerve",
      "Brachial plexus",
      "Median nerve",
    ],
    correct: 1,
    explanation:
      "The RADIAL NERVE is most vulnerable in humeral shaft fractures because it runs in the spiral groove on the posterior surface of the mid-shaft. This causes wrist drop (inability to extend wrist/fingers) and sensory loss over the dorsum of the hand. Axillary nerve is at risk in surgical neck fractures and shoulder dislocations.",
  },
  {
    id: 127,
    topic: "Orthopaedics",
    question:
      "The typical muscle involved in tennis elbow (lateral epicondylitis) is:",
    options: [
      "Extensor carpi radialis longus",
      "Extensor carpi radialis brevis",
      "Brachioradialis",
      "Extensor indicis",
    ],
    correct: 1,
    explanation:
      "Extensor Carpi Radialis Brevis (ECRB) is the primary muscle involved in lateral epicondylitis (tennis elbow). Its origin at the lateral epicondyle undergoes degenerative changes from repetitive wrist extension and gripping. Mill's test and Cozen's test are used for diagnosis.",
  },
  {
    id: 128,
    topic: "Orthopaedics",
    question: "Mallet finger is caused by:",
    options: [
      "FDP contracture",
      "Rupture of the terminal extensor tendon (collateral slip)",
      "Central slip rupture",
      "Volar plate rupture",
    ],
    correct: 1,
    explanation:
      "Mallet finger results from rupture of the terminal extensor tendon at its insertion into the distal phalanx, or an avulsion fracture of the distal phalanx. The DIP joint drops into flexion and cannot be actively extended. Treatment is splinting the DIP in extension for 6-8 weeks.",
  },
  {
    id: 129,
    topic: "Orthopaedics",
    question: "Swan neck deformity is caused by:",
    options: [
      "EDC contracture",
      "Intrinsic muscle tightness",
      "FDP contracture",
      "Volar plate rupture/laxity",
    ],
    correct: 3,
    explanation:
      "Swan neck deformity (PIP hyperextension + DIP flexion) results from volar plate laxity or rupture at the PIP joint, allowing hyperextension. It is commonly seen in rheumatoid arthritis. The imbalance between intrinsic and extrinsic muscles leads to the characteristic posture.",
  },
  {
    id: 130,
    topic: "Orthopaedics",
    question: "Boutonniere deformity is caused by:",
    options: [
      "FDS contracture",
      "Central slip rupture of the extensor mechanism",
      "ED contracture",
      "Collateral slip rupture",
    ],
    correct: 1,
    explanation:
      "Boutonniere (buttonhole) deformity (PIP flexion + DIP hyperextension) results from rupture of the CENTRAL SLIP of the extensor mechanism at the PIP joint. The lateral bands slip volar to the PIP axis, becoming flexors of PIP and hyperextending the DIP. Common in RA and trauma.",
  },
  {
    id: 131,
    topic: "Orthopaedics",
    question: "Avascular necrosis of the scaphoid occurs at the:",
    options: [
      "Proximal half (pole)",
      "Distal half",
      "Whole bone",
      "None of the above",
    ],
    correct: 0,
    explanation:
      "AVN of the scaphoid occurs at the PROXIMAL POLE because the blood supply enters distally and flows retrograde to the proximal pole. A waist fracture disrupts this blood supply, leaving the proximal fragment avascular. This is why scaphoid fractures require prolonged immobilization (8-12 weeks) and careful monitoring.",
  },
  {
    id: 132,
    topic: "Orthopaedics",
    question: "Reverse Colles fracture is known as:",
    options: [
      "Barton's fracture",
      "Smith's fracture",
      "Galeazzi fracture",
      "Pott's fracture",
    ],
    correct: 1,
    explanation:
      "Smith's fracture is the reverse of Colles fracture. Colles = distal radius fracture with DORSAL displacement (dinner fork deformity, from fall on outstretched hand). Smith's = distal radius fracture with VOLAR/PALMAR displacement (garden spade deformity, from fall on back of hand or direct blow).",
  },
  {
    id: 133,
    topic: "Orthopaedics",
    question: "The strongest ligament in the body is the:",
    options: [
      "Ischiofemoral ligament",
      "Round ligament (ligamentum teres)",
      "Pubofemoral ligament",
      "Iliofemoral ligament (Y ligament of Bigelow)",
    ],
    correct: 3,
    explanation:
      "The iliofemoral ligament (Y ligament of Bigelow) is the strongest ligament in the body. It reinforces the anterior hip capsule, prevents hyperextension, and supports the body in standing. It can withstand forces up to 350 Newtons, which is why anterior hip dislocations are much rarer than posterior ones.",
  },
  {
    id: 134,
    topic: "Orthopaedics",
    question: "The capsular pattern of the hip joint is:",
    options: [
      "Internal rotation and abduction most restricted",
      "External rotation and abduction most restricted",
      "Extension and internal rotation most restricted",
      "Flexion and internal rotation most restricted, then extension and external rotation",
    ],
    correct: 3,
    explanation:
      "The capsular pattern of the hip is: Flexion, Internal Rotation, and Abduction most limited (with IR being the earliest and most restricted), followed by Extension and External Rotation. This pattern helps differentiate capsular pathology (like OA) from non-capsular lesions.",
  },
  {
    id: 135,
    topic: "Orthopaedics",
    question: "Antalgic gait is characterized by:",
    options: [
      "Smaller step length on the affected side",
      "Smaller step length on the sound side",
      "Lurching toward the sound side",
      "Inadequate swing on the affected side",
    ],
    correct: 0,
    explanation:
      "In antalgic gait, the stance phase on the AFFECTED side is shortened (the patient quickly transfers weight off the painful leg), resulting in a SMALLER step on the affected side and a characteristic limp. The cadence may also decrease as the patient walks more cautiously to minimize pain.",
  },
  {
    id: 136,
    topic: "Orthopaedics",
    question: "Ely's test checks the length of:",
    options: [
      "Iliotibial band",
      "Hamstrings",
      "Rectus femoris",
      "Hip adductors",
    ],
    correct: 2,
    explanation:
      "Ely's test assesses RECTUS FEMORIS tightness. Patient prone, examiner passively flexes the knee. If the hip flexes off the table (pelvis rises), rectus femoris is tight. Since rectus femoris crosses both hip and knee, knee flexion stretches it, and if tight, it pulls the hip into flexion.",
  },
  {
    id: 137,
    topic: "Orthopaedics",
    question:
      "Traumatic posterior dislocation of the hip is characterized by:",
    options: [
      "Fixed adduction and internal rotation, limited ROM, and shortening",
      "Fixed abduction and external rotation",
      "Limited abduction and internal rotation",
      "Fixed adduction and external rotation",
    ],
    correct: 0,
    explanation:
      "Posterior hip dislocation presents with the classic triad: the leg is SHORTENED, ADDUCTED, and INTERNALLY ROTATED (and slightly flexed). This occurs from dashboard injuries (force along the femoral shaft with hip flexed). Sciatic nerve injury is a major associated complication. Anterior dislocation shows the opposite: abduction and external rotation.",
  },
  {
    id: 138,
    topic: "Orthopaedics",
    question:
      "The primary indication for total joint replacement is:",
    options: [
      "Joint effusion",
      "Limited range of motion",
      "Muscle atrophy",
      "Intractable pain",
    ],
    correct: 3,
    explanation:
      "PAIN is the primary indication for total joint replacement (hip, knee). When pain is severe, unresponsive to conservative management, and significantly impairs quality of life and function, arthroplasty is considered. Limited ROM, effusion, and muscle atrophy alone are not sufficient indications without significant pain.",
  },
  {
    id: 139,
    topic: "Orthopaedics",
    question: "The medial meniscus forms approximately:",
    options: [
      "Half of a large circle (C-shaped)",
      "Almost all of a circle (O-shaped)",
      "Three-quarters of a circle",
      "None of the above",
    ],
    correct: 0,
    explanation:
      "The medial meniscus is C-shaped, forming approximately half of a large circle (semicircular). The lateral meniscus is more circular (O-shaped), covering a larger portion of the tibial plateau. This shape difference, along with MCL attachment, makes the medial meniscus less mobile and more prone to injury.",
  },
  {
    id: 140,
    topic: "Orthopaedics",
    question:
      "The medial meniscus is more prone to injury because it is:",
    options: [
      "More mobile than the lateral meniscus",
      "Less mobile due to attachment to the MCL",
      "The medial compartment bears more weight",
      "None of the above",
    ],
    correct: 1,
    explanation:
      "The medial meniscus is MORE PRONE to injury because it is LESS MOBILE - firmly attached to the medial collateral ligament (MCL) and joint capsule. When rotational forces are applied, the medial meniscus cannot move away and gets trapped and torn. The lateral meniscus, being more mobile, can accommodate stress better.",
  },
  {
    id: 141,
    topic: "Orthopaedics",
    question: "The pes anserinus includes:",
    options: [
      "Semimembranosus, gracilis, sartorius",
      "Semimembranosus, rectus femoris, ITB",
      "Semitendinosus, gracilis, sartorius",
      "Semitendinosus, pectineus, adductor magnus",
    ],
    correct: 2,
    explanation:
      "Pes anserinus ('goose's foot') is the combined tendinous insertion of three muscles on the medial proximal tibia: Semitendinosus, Gracilis, and Sartorius (remember: SGS or 'Say Grace before Tea'). Pes anserine bursitis causes medial knee pain and is common in overweight patients and runners.",
  },
  {
    id: 142,
    topic: "Orthopaedics",
    question: "The close-packed position of the knee is:",
    options: [
      "Full extension with tibial external rotation",
      "Full flexion",
      "25 degrees of flexion",
      "90 degrees of flexion",
    ],
    correct: 0,
    explanation:
      "The close-packed position of the knee is full EXTENSION with external rotation of the tibia (screw-home mechanism). In this position, the capsule and ligaments are maximally taut, and the joint surfaces are maximally congruent. The loose-packed (resting) position is approximately 25 degrees of flexion.",
  },
  {
    id: 143,
    topic: "Orthopaedics",
    question: "Locking of the knee is a feature of ____ injury:",
    options: [
      "Collateral ligament",
      "Meniscus",
      "Cruciate ligament",
      "All of the above",
    ],
    correct: 1,
    explanation:
      "True locking (inability to fully extend the knee) is characteristic of a MENISCAL injury, specifically a bucket-handle tear where the torn fragment flips into the intercondylar notch and mechanically blocks extension. This is different from pseudo-locking seen with loose bodies or muscle spasm. Unlocking may occur with a 'click.'",
  },
  {
    id: 144,
    topic: "Orthopaedics",
    question:
      "Positive Apley's grinding test with external rotation and compression indicates injury to:",
    options: [
      "Medial collateral ligament",
      "Medial meniscus",
      "Lateral collateral ligament",
      "Lateral meniscus",
    ],
    correct: 1,
    explanation:
      "Apley's grinding test: prone, knee at 90 degrees, compression + rotation. External rotation with compression grinds the MEDIAL meniscus (positive = medial meniscus tear). Internal rotation with compression tests the lateral meniscus. Apley's distraction test differentiates ligament injuries from meniscal injuries.",
  },
  {
    id: 145,
    topic: "Orthopaedics",
    question:
      "In ACL rehabilitation, emphasis is on strengthening the:",
    options: [
      "Quadriceps",
      "Hamstrings",
      "Both equally",
      "Quadriceps more than hamstrings",
    ],
    correct: 1,
    explanation:
      "ACL rehabilitation emphasizes HAMSTRING strengthening because the hamstrings are dynamic ACL synergists - they pull the tibia posteriorly, opposing the anterior tibial translation that the ACL normally prevents. Strong hamstrings protect the ACL (or graft) from excessive strain. Open-chain quad exercises are avoided early as they stress the ACL.",
  },
  {
    id: 146,
    topic: "Orthopaedics",
    question:
      "In DJD of the knee with ROM 20-100 degrees, which range should be restored first?",
    options: [
      "Flexion beyond 100 degrees",
      "Extension toward 0 degrees",
      "Both equally",
      "None - maintain current range",
    ],
    correct: 1,
    explanation:
      "EXTENSION should be restored first because it is more functionally important. Loss of full extension causes a flexion contracture that severely impairs gait (increased energy cost, quadriceps overwork, knee pain). You need 0 degrees extension for normal heel strike and stance phase. Full flexion is needed for stairs and sitting but is less critical for basic ambulation.",
  },
  {
    id: 147,
    topic: "Orthopaedics",
    question:
      "The most frequently injured ankle ligament is the:",
    options: [
      "Calcaneofibular ligament",
      "Deltoid ligament",
      "Anterior talofibular ligament",
      "Posterior talofibular ligament",
    ],
    correct: 2,
    explanation:
      "The anterior talofibular ligament (ATFL) is the most commonly injured ankle ligament, accounting for approximately 70% of ankle sprains. It is torn in inversion (lateral) ankle sprains, which are far more common than eversion sprains because the lateral malleolus extends further distally, providing less bony stability laterally.",
  },
  {
    id: 148,
    topic: "Orthopaedics",
    question: "The plantar calcaneonavicular ligament is also known as:",
    options: [
      "Interosseous ligament",
      "Spring ligament",
      "Deltoid ligament",
      "Bifurcate ligament",
    ],
    correct: 1,
    explanation:
      "The plantar calcaneonavicular ligament is called the SPRING LIGAMENT because of its elastic properties. It supports the head of the talus and maintains the medial longitudinal arch of the foot. Weakness or laxity of this ligament contributes to flat foot (pes planus) deformity.",
  },
  {
    id: 149,
    topic: "Orthopaedics",
    question: "Foot pronation includes:",
    options: [
      "Plantarflexion, eversion, adduction",
      "Plantarflexion, inversion, abduction",
      "Plantarflexion, inversion, adduction",
      "Dorsiflexion, eversion, abduction",
    ],
    correct: 3,
    explanation:
      "Foot PRONATION = Dorsiflexion + Eversion + Abduction (triplanar motion at the subtalar joint). SUPINATION = Plantarflexion + Inversion + Adduction. Overpronation is a common biomechanical problem linked to medial knee pain, shin splints, and plantar fasciitis.",
  },
  {
    id: 150,
    topic: "Orthopaedics",
    question:
      "Diagnosis of Rheumatoid Arthritis requires at least ____ out of 7 ACR criteria:",
    options: ["3", "4", "5", "All 7"],
    correct: 1,
    explanation:
      "The 1987 ACR criteria require at least 4 out of 7 criteria for RA diagnosis: morning stiffness >1 hour, arthritis of 3+ joint areas, hand joint arthritis, symmetric arthritis, rheumatoid nodules, positive RF, and radiographic changes. At least 4 criteria must be present for at least 6 weeks.",
  },
  {
    id: 151,
    topic: "Orthopaedics",
    question: "The essence of RA pathology is:",
    options: [
      "Persistent synovitis leading to pannus formation",
      "Articular cartilage damage",
      "Joint deformities",
      "Tendon ruptures",
    ],
    correct: 0,
    explanation:
      "The fundamental pathology of RA is PERSISTENT SYNOVITIS - chronic inflammation of the synovial membrane leading to pannus formation (granulation tissue). This pannus invades and destroys articular cartilage and subchondral bone. Cartilage damage, deformities, and tendon ruptures are consequences, not the primary pathology.",
  },
  {
    id: 152,
    topic: "Orthopaedics",
    question: "Sausage fingers (dactylitis) are found in:",
    options: [
      "Rheumatoid arthritis",
      "Psoriatic arthritis",
      "Scleroderma",
      "Gout",
    ],
    correct: 1,
    explanation:
      "Dactylitis (sausage fingers/toes) is characteristic of PSORIATIC ARTHRITIS and other seronegative spondyloarthropathies. The entire digit swells uniformly due to inflammation of the flexor tendon sheath and synovium. RA typically causes fusiform (spindle-shaped) swelling of individual joints, not entire digits.",
  },
  {
    id: 153,
    topic: "Orthopaedics",
    question: "Heberden's nodes are present at the:",
    options: [
      "Wrist joint",
      "Subcutaneous tissue",
      "Distal interphalangeal (DIP) joints",
      "Shin of tibia",
    ],
    correct: 2,
    explanation:
      "Heberden's nodes are bony enlargements at the DIP joints, pathognomonic of osteoarthritis (OA). Bouchard's nodes occur at the PIP joints in OA. Remember: Heberden's = DIP (D is further in the alphabet, closer to distal), Bouchard's = PIP. These are NOT features of RA.",
  },
  {
    id: 154,
    topic: "Orthopaedics",
    question: "Serum uric acid is elevated in:",
    options: [
      "Systemic Lupus Erythematosus",
      "Still's disease",
      "Gout",
      "None of the above",
    ],
    correct: 2,
    explanation:
      "Elevated serum uric acid (hyperuricemia) is characteristic of GOUT, a metabolic arthropathy caused by deposition of monosodium urate crystals in joints. The first MTP joint (great toe) is most commonly affected (podagra). Diagnosis is confirmed by negatively birefringent needle-shaped crystals in synovial fluid.",
  },
  {
    id: 155,
    topic: "Orthopaedics",
    question: "Raynaud's phenomenon is often the first presentation of:",
    options: [
      "Systemic Lupus Erythematosus",
      "Polymyositis",
      "Scleroderma (systemic sclerosis)",
      "Still's disease",
    ],
    correct: 2,
    explanation:
      "Raynaud's phenomenon (episodic digital vasospasm causing white-blue-red color changes in fingers on cold exposure) is frequently the FIRST clinical manifestation of SCLERODERMA, often preceding other symptoms by years. While it can occur in other connective tissue diseases and as a primary condition, its association with scleroderma is strongest.",
  },
  {
    id: 156,
    topic: "Orthopaedics",
    question: "Skin rash after sunlight exposure is characteristic of:",
    options: [
      "Polymyositis",
      "Systemic Lupus Erythematosus (SLE)",
      "Scleroderma",
      "Gout",
    ],
    correct: 1,
    explanation:
      "Photosensitive skin rash, particularly the butterfly (malar) rash across the cheeks and nose, is a hallmark of SLE. UV light triggers flares in SLE patients. Photosensitivity is one of the 11 ACR classification criteria for SLE. Patients are advised to use sunscreen and avoid prolonged sun exposure.",
  },
];
