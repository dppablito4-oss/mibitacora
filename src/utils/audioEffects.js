let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const audioEffects = {
  isMuted: () => {
    return localStorage.getItem('shield_sound_muted') === 'true';
  },
  
  toggleMute: () => {
    const muted = !audioEffects.isMuted();
    localStorage.setItem('shield_sound_muted', String(muted));
    return muted;
  },

  playClick: () => {
    if (audioEffects.isMuted()) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
      console.warn('[Audio] Failed to play click sound:', e);
    }
  },

  playHover: () => {
    if (audioEffects.isMuted()) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Silently fail for hover to avoid spam logs
    }
  },

  playSuccess: () => {
    if (audioEffects.isMuted()) return;
    try {
      const ctx = getAudioContext();
      const playTone = (freq, startOffset, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + startOffset);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + startOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startOffset);
        osc.stop(ctx.currentTime + startOffset + duration + 0.01);
      };

      playTone(523.25, 0, 0.2); // C5
      playTone(659.25, 0.06, 0.2); // E5
      playTone(783.99, 0.12, 0.2); // G5
      playTone(1046.50, 0.18, 0.3); // C6
    } catch (e) {
      console.warn('[Audio] Failed to play success sound:', e);
    }
  },

  playError: () => {
    if (audioEffects.isMuted()) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch (e) {
      console.warn('[Audio] Failed to play error sound:', e);
    }
  },

  playRepulsor: () => {
    if (audioEffects.isMuted()) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // 1. Sonido de carga (Rising oscillator)
      const chargeOsc = ctx.createOscillator();
      const chargeGain = ctx.createGain();
      chargeOsc.type = 'sine';
      chargeOsc.frequency.setValueAtTime(150, now);
      chargeOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.28);
      
      chargeGain.gain.setValueAtTime(0, now);
      chargeGain.gain.linearRampToValueAtTime(0.06, now + 0.1);
      chargeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      
      chargeOsc.connect(chargeGain);
      chargeGain.connect(ctx.destination);
      chargeOsc.start(now);
      chargeOsc.stop(now + 0.28);
      
      // 2. Sonido de disparo (Noise Explosion)
      const bufferSize = ctx.sampleRate * 0.25; // 250ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1.5;
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now + 0.28);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      noiseNode.start(now + 0.28);
      noiseNode.stop(now + 0.55);
    } catch (e) {
      console.warn('[Audio] Failed to play repulsor sound:', e);
    }
  }
};
