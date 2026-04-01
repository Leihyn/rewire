/**
 * FFT-based tremor analysis for accelerometer data.
 *
 * Clinically relevant frequency bands:
 * - Parkinsonian resting tremor: 4-6 Hz
 * - Essential tremor: 8-12 Hz
 * - Physiological tremor: 8-12 Hz (lower amplitude)
 * - Cerebellar tremor: 3-5 Hz (intention tremor)
 *
 * Implements Cooley-Tukey FFT and power spectral density analysis.
 */

export type TremorSample = { x: number; y: number; z: number; t: number };

export type FrequencyBand = {
  name: string;
  minHz: number;
  maxHz: number;
  power: number;        // power spectral density in this band
  peakFrequency: number; // dominant frequency within band
  peakAmplitude: number;
};

export type TremorAnalysis = {
  rms: number;
  dominantFrequency: number;
  dominantAmplitude: number;
  bands: FrequencyBand[];
  classification: TremorClassification;
  severity: number; // 0-100, 0 = no tremor
  spectralEntropy: number; // 0-1, regularity of tremor
  score: number; // 0-100, stability score (inverse of severity)
  sampleRate: number;
};

export type TremorClassification =
  | "none"
  | "physiological"
  | "parkinsonian"
  | "essential"
  | "cerebellar"
  | "unclassified";

const BANDS: Omit<FrequencyBand, "power" | "peakFrequency" | "peakAmplitude">[] = [
  { name: "Cerebellar", minHz: 3, maxHz: 5 },
  { name: "Parkinsonian", minHz: 4, maxHz: 6 },
  { name: "Essential/Physiological", minHz: 8, maxHz: 12 },
  { name: "High Frequency", minHz: 12, maxHz: 25 },
];

/**
 * Cooley-Tukey radix-2 FFT.
 * Input must be power-of-2 length.
 */
function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  if (n <= 1) return;

  // Bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;

    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }

  // FFT butterfly
  for (let len = 2; len <= n; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (-2 * Math.PI) / len;

    for (let i = 0; i < n; i += len) {
      for (let j = 0; j < halfLen; j++) {
        const wRe = Math.cos(angle * j);
        const wIm = Math.sin(angle * j);
        const idx1 = i + j;
        const idx2 = i + j + halfLen;

        const tRe = wRe * re[idx2] - wIm * im[idx2];
        const tIm = wRe * im[idx2] + wIm * re[idx2];

        re[idx2] = re[idx1] - tRe;
        im[idx2] = im[idx1] - tIm;
        re[idx1] += tRe;
        im[idx1] += tIm;
      }
    }
  }
}

/**
 * Compute power spectral density from accelerometer samples.
 */
function computePSD(
  samples: TremorSample[],
  sampleRate: number
): { frequencies: number[]; power: number[] } {
  // Compute magnitude of acceleration (remove gravity component by high-pass)
  const magnitudes = samples.map((s) =>
    Math.sqrt(s.x ** 2 + s.y ** 2 + s.z ** 2)
  );

  // Remove DC component (mean)
  const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const centered = magnitudes.map((m) => m - mean);

  // Pad to next power of 2
  let n = 1;
  while (n < centered.length) n <<= 1;

  const re = new Float64Array(n);
  const im = new Float64Array(n);

  // Apply Hanning window to reduce spectral leakage
  for (let i = 0; i < centered.length; i++) {
    const window = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (centered.length - 1)));
    re[i] = centered[i] * window;
  }

  fft(re, im);

  // Compute one-sided PSD
  const halfN = n / 2;
  const frequencies: number[] = [];
  const power: number[] = [];

  for (let i = 0; i <= halfN; i++) {
    frequencies.push((i * sampleRate) / n);
    // Power = |FFT|^2 / N, scaled for one-sided
    const p = (re[i] ** 2 + im[i] ** 2) / (n * n);
    power.push(i === 0 || i === halfN ? p : 2 * p);
  }

  return { frequencies, power };
}

/**
 * Analyze frequency bands from PSD.
 */
function analyzeBands(
  frequencies: number[],
  power: number[]
): FrequencyBand[] {
  return BANDS.map((band) => {
    let totalPower = 0;
    let peakPower = 0;
    let peakFreq = 0;

    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] >= band.minHz && frequencies[i] <= band.maxHz) {
        totalPower += power[i];
        if (power[i] > peakPower) {
          peakPower = power[i];
          peakFreq = frequencies[i];
        }
      }
    }

    return {
      ...band,
      power: totalPower,
      peakFrequency: peakFreq,
      peakAmplitude: Math.sqrt(peakPower),
    };
  });
}

/**
 * Spectral entropy: measures regularity of tremor.
 * Low entropy = regular, periodic tremor (pathological)
 * High entropy = irregular, random movement (physiological)
 */
function computeSpectralEntropy(power: number[]): number {
  const totalPower = power.reduce((a, b) => a + b, 0);
  if (totalPower === 0) return 1;

  const normalized = power.map((p) => p / totalPower);
  let entropy = 0;
  for (const p of normalized) {
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  }

  // Normalize by max entropy (log2(N))
  const maxEntropy = Math.log2(power.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 1;
}

/**
 * Classify tremor type based on band analysis.
 */
function classifyTremor(
  bands: FrequencyBand[],
  rms: number,
  spectralEntropy: number
): TremorClassification {
  if (rms < 0.3) return "none";

  const parkinsonian = bands.find((b) => b.name === "Parkinsonian")!;
  const essential = bands.find((b) => b.name === "Essential/Physiological")!;
  const cerebellar = bands.find((b) => b.name === "Cerebellar")!;

  const maxBand = bands.reduce((a, b) => (a.power > b.power ? a : b));

  // Low entropy + high power in specific band = pathological
  if (spectralEntropy < 0.5) {
    if (maxBand.name === "Parkinsonian" && parkinsonian.power > essential.power * 1.5) {
      return "parkinsonian";
    }
    if (maxBand.name === "Essential/Physiological" && essential.power > parkinsonian.power * 1.5) {
      return "essential";
    }
    if (maxBand.name === "Cerebellar" && cerebellar.power > parkinsonian.power) {
      return "cerebellar";
    }
  }

  // High entropy = likely physiological
  if (spectralEntropy > 0.7 && rms < 1.0) {
    return "physiological";
  }

  return "unclassified";
}

/**
 * Main analysis function. Takes raw accelerometer samples and returns
 * full tremor analysis with classification.
 */
export function analyzeTremor(samples: TremorSample[]): TremorAnalysis {
  if (samples.length < 32) {
    return {
      rms: 0,
      dominantFrequency: 0,
      dominantAmplitude: 0,
      bands: BANDS.map((b) => ({ ...b, power: 0, peakFrequency: 0, peakAmplitude: 0 })),
      classification: "none",
      severity: 0,
      spectralEntropy: 1,
      score: 100,
      sampleRate: 0,
    };
  }

  // Estimate sample rate from timestamps
  const durations: number[] = [];
  for (let i = 1; i < samples.length; i++) {
    durations.push(samples[i].t - samples[i - 1].t);
  }
  const avgDt = durations.reduce((a, b) => a + b, 0) / durations.length;
  const sampleRate = 1000 / avgDt; // Hz

  // RMS of acceleration deviation
  const magnitudes = samples.map((s) =>
    Math.sqrt(s.x ** 2 + s.y ** 2 + s.z ** 2)
  );
  const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const rms = Math.sqrt(
    magnitudes.reduce((sum, m) => sum + (m - mean) ** 2, 0) / magnitudes.length
  );

  // PSD
  const { frequencies, power } = computePSD(samples, sampleRate);

  // Band analysis
  const bands = analyzeBands(frequencies, power);

  // Find dominant frequency (ignore DC and very low freq)
  let maxPower = 0;
  let dominantFrequency = 0;
  for (let i = 0; i < frequencies.length; i++) {
    if (frequencies[i] >= 2 && power[i] > maxPower) {
      maxPower = power[i];
      dominantFrequency = frequencies[i];
    }
  }

  // Spectral entropy
  const relevantPower = power.filter((_, i) => frequencies[i] >= 2 && frequencies[i] <= 25);
  const spectralEntropy = computeSpectralEntropy(relevantPower);

  // Classification
  const classification = classifyTremor(bands, rms, spectralEntropy);

  // Severity: 0-100 based on RMS and band power
  const totalBandPower = bands.reduce((s, b) => s + b.power, 0);
  const severity = Math.min(100, Math.round(rms * 20 + totalBandPower * 100));

  // Score: inverse of severity
  const score = Math.max(0, 100 - severity);

  return {
    rms: Math.round(rms * 1000) / 1000,
    dominantFrequency: Math.round(dominantFrequency * 10) / 10,
    dominantAmplitude: Math.sqrt(maxPower),
    bands,
    classification,
    severity,
    spectralEntropy: Math.round(spectralEntropy * 1000) / 1000,
    score,
    sampleRate: Math.round(sampleRate),
  };
}
