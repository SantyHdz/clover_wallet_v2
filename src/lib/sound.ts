// Web Audio API Sound Synthesizer for subtle fintech notifications & feedback
// Zero dependencies, zero latency, pure synthesized chime.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Automatically unlock AudioContext on first user interaction in browser
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore
    }
  };

  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}

export type SoundType =
  | 'success'
  | 'create'
  | 'update'
  | 'delete'
  | 'payment'
  | 'contribution'
  | 'info';

/**
 * Plays an audible, pleasant synthesized chime tailored for fintech apps.
 */
export async function playNotificationSound(type: SoundType = 'success', volume = 1) {
  if (typeof window === 'undefined') return;

  // Check user preference for sound
  if (!isSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Ensure context is actively running before queuing tones
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, now);
    masterGain.connect(ctx.destination);

    if (type === 'success' || type === 'create') {
      // Harmonic chime: E5 (659Hz) -> A5 (880Hz) -> C#6 (1108Hz) -> E6 (1318Hz)
      playTone(ctx, masterGain, 659.25, now, 0.16, 'sine');
      playTone(ctx, masterGain, 880.0, now + 0.05, 0.18, 'sine');
      playTone(ctx, masterGain, 1108.73, now + 0.10, 0.22, 'sine');
      playTone(ctx, masterGain, 1318.51, now + 0.15, 0.28, 'sine');
    } else if (type === 'payment' || type === 'contribution') {
      // Bright double coin/cash chime: G5 (784Hz) -> D6 (1174Hz)
      playTone(ctx, masterGain, 783.99, now, 0.14, 'sine');
      playTone(ctx, masterGain, 1174.66, now + 0.06, 0.24, 'sine');
    } else if (type === 'update') {
      // Gentle double tap
      playTone(ctx, masterGain, 880.0, now, 0.12, 'sine');
      playTone(ctx, masterGain, 1046.5, now + 0.07, 0.20, 'sine');
    } else if (type === 'delete') {
      // Crisp descending two-tone: B5 (987Hz) -> F#5 (739Hz) -> D5 (587Hz)
      playTone(ctx, masterGain, 987.77, now, 0.12, 'sine');
      playTone(ctx, masterGain, 739.99, now + 0.05, 0.16, 'sine');
      playTone(ctx, masterGain, 587.33, now + 0.10, 0.24, 'sine');
    } else {
      // Neutral info ping
      playTone(ctx, masterGain, 880.0, now, 0.2, 'sine');
    }
  } catch {
    // Gracefully handle any browser audio restriction
  }
}

function playTone(
  ctx: AudioContext,
  destination: GainNode,
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine'
) {
  try {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);

    // Fast attack and smooth exponential fade out
    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(1.0, startTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  } catch {
    // Handle individual tone errors
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem('clover_sound_disabled') !== 'true';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      localStorage.removeItem('clover_sound_disabled');
    } else {
      localStorage.setItem('clover_sound_disabled', 'true');
    }
  } catch {
    // Ignore localStorage errors
  }
}
