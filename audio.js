/* ============================================================
   TARIK TAMBANG QUIZ – audio.js
   Web Audio API Procedural Synthesizer & Sound Effects
   Zero external audio files needed - 100% reliable & instant!
   ============================================================ */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.bgmGain = null;
    
    // Settings loaded from localStorage
    this.musicEnabled = localStorage.getItem('ttq_music') !== 'false'; // default true
    this.sfxEnabled = localStorage.getItem('ttq_sfx') !== 'false';     // default true

    // Note frequencies for cartoon melody
    this.NOTES = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
      C6: 1046.50
    };

    // Upbeat Cartoon BGM Melody (Sequence of [note, duration in beats, octave/instrument type])
    this.bgmMelody = [
      ['C5', 0.5], ['E5', 0.5], ['G5', 0.5], ['E5', 0.5],
      ['A5', 0.5], ['G5', 0.5], ['E5', 1.0],
      ['F5', 0.5], ['A5', 0.5], ['C6', 0.5], ['A5', 0.5],
      ['G5', 0.5], ['F5', 0.5], ['D5', 1.0],
      ['E5', 0.5], ['G5', 0.5], ['C5', 0.5], ['E5', 0.5],
      ['D5', 0.5], ['F5', 0.5], ['B4', 1.0],
      ['C5', 0.5], ['E5', 0.5], ['G5', 0.5], ['C6', 1.0],
      [null, 0.5]
    ];

    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  ensureContext() {
    this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Toggle Music ON/OFF
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('ttq_music', this.musicEnabled);
    if (this.musicEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    this.updateAudioButtons();
    return this.musicEnabled;
  }

  // Toggle SFX ON/OFF
  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('ttq_sfx', this.sfxEnabled);
    if (this.sfxEnabled) {
      this.play('click');
    }
    this.updateAudioButtons();
    return this.sfxEnabled;
  }

  updateAudioButtons() {
    const btnMusic = document.getElementById('btn-toggle-music');
    const btnSfx = document.getElementById('btn-toggle-sfx');
    if (btnMusic) {
      btnMusic.classList.toggle('muted', !this.musicEnabled);
      btnMusic.innerHTML = this.musicEnabled ? '🎵 <span class="audio-label">Musik: ON</span>' : '🔇 <span class="audio-label">Musik: OFF</span>';
    }
    if (btnSfx) {
      btnSfx.classList.toggle('muted', !this.sfxEnabled);
      btnSfx.innerHTML = this.sfxEnabled ? '🔊 <span class="audio-label">Suara: ON</span>' : '🔈 <span class="audio-label">Suara: OFF</span>';
    }
  }

  // Cartoon Polyphonic / Chiptune Tone Generator
  playTone(freq, type = 'sine', duration = 0.2, gainLevel = 0.15, startOffset = 0) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startOffset);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startOffset + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startOffset);
      osc.stop(this.ctx.currentTime + startOffset + duration);
    } catch (e) {
      // Audio context policy safe catch
    }
  }

  // Play Sound Effects
  play(sfxName) {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    switch (sfxName) {
      case 'correct': // "Ting-Tung!" Game Show chime
        // "Ting" (High chime with shimmer)
        this.playTone(880.00, 'sine', 0.18, 0.28, 0.0);   // A5
        this.playTone(1760.00, 'triangle', 0.12, 0.15, 0.0); // Bell shimmer harmonic
        // "Tung" (Higher joyful bell resolution)
        this.playTone(1318.51, 'sine', 0.35, 0.32, 0.15); // E6
        this.playTone(2637.02, 'triangle', 0.22, 0.18, 0.15); // High sparkle
        break;

      case 'wrong': // "Te-Tot!" Game Show buzzer
        // "Te-" (First buzzer tone)
        this.playTone(220.00, 'sawtooth', 0.18, 0.32, 0.0);
        this.playTone(110.00, 'square', 0.18, 0.20, 0.0);
        // "-Tot" (Lower descending buzzer tone)
        this.playTone(146.83, 'sawtooth', 0.38, 0.35, 0.18);
        this.playTone(73.42, 'square', 0.38, 0.22, 0.18);
        break;

      case 'pull': // Dynamic tug-of-war rope whoosh sound
        try {
          const bufferSize = this.ctx.sampleRate * 0.25;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(300, this.ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
          filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.25);
          
          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          noise.start();
          this.playTone(220, 'triangle', 0.2, 0.2, 0.05);
        } catch (e) {}
        break;

      case 'tick': // Countdown timer tick
        this.playTone(880, 'sine', 0.05, 0.1, 0);
        break;

      case 'go': // 5s prep ended -> Answer unlocked!
        this.playTone(440, 'triangle', 0.1, 0.2, 0.0);
        this.playTone(554.37, 'triangle', 0.1, 0.2, 0.08);
        this.playTone(659.25, 'triangle', 0.25, 0.3, 0.16);
        break;

      case 'start': // Game session started
        this.playTone(392.00, 'sine', 0.12, 0.2, 0.0);
        this.playTone(523.25, 'sine', 0.12, 0.2, 0.12);
        this.playTone(659.25, 'sine', 0.25, 0.25, 0.24);
        break;

      case 'click': // UI button click
        this.playTone(600, 'triangle', 0.04, 0.12, 0);
        break;

      case 'victory': // Game complete victory fanfare
        const fan = [
          [523.25, 0.15, 0.0],
          [523.25, 0.15, 0.18],
          [523.25, 0.15, 0.36],
          [659.25, 0.3, 0.54],
          [587.33, 0.15, 0.9],
          [659.25, 0.15, 1.08],
          [783.99, 0.6, 1.26]
        ];
        fan.forEach(([f, d, offset]) => {
          this.playTone(f, 'triangle', d, 0.28, offset);
          this.playTone(f * 0.5, 'sine', d, 0.2, offset);
        });
        break;
    }
  }

  // Background Music Loop (Gentle upbeat cartoon game theme)
  startBGM() {
    if (!this.musicEnabled || this.bgmPlaying) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    this.bgmStep = 0;
    this.playNextBgmNote();
  }

  playNextBgmNote() {
    if (!this.bgmPlaying || !this.musicEnabled || !this.ctx) return;

    const item = this.bgmMelody[this.bgmStep];
    const tempo = 240; // ms per 0.5 beat
    const durationMs = item[1] * tempo;

    if (item[0]) {
      const freq = this.NOTES[item[0]];
      // Play lead marimba/triangle tone
      this.playTone(freq, 'triangle', item[1] * 0.22, 0.07, 0);
      // Play soft bass root
      if (this.bgmStep % 2 === 0) {
        this.playTone(freq * 0.25, 'sine', 0.3, 0.06, 0);
      }
    }

    this.bgmStep = (this.bgmStep + 1) % this.bgmMelody.length;
    this.bgmTimer = setTimeout(() => {
      this.playNextBgmNote();
    }, durationMs);
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// Global Sound Instance
const Sound = new SoundEngine();

// Auto-enable Web Audio Context on first user touch/click
window.addEventListener('click', () => {
  Sound.ensureContext();
  if (Sound.musicEnabled && !Sound.bgmPlaying) {
    Sound.startBGM();
  }
}, { once: true });

window.addEventListener('DOMContentLoaded', () => {
  Sound.updateAudioButtons();
});
