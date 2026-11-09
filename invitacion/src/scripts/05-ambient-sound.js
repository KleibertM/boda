    /* global triggerToast */
    /* =================================================================
       8. SONIDO AMBIENTAL SUAVE (WEB AUDIO API)
       ================================================================= */
    let audioContext = null;
    let isSoundActive = false;
    let melodyTimer = null;
    const soundBtn = document.getElementById('ambient-sound-btn');
    const soundIcon = document.getElementById('sound-icon');

    function ringBell(freq, time, duration) {
      if (!audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.04, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, time + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(time);
      osc.stop(time + duration);
    }

    function startMelodyLoop() {
      const chords = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23, 329.63];
      let step = 0;
      melodyTimer = setInterval(() => {
        if (!isSoundActive || !audioContext) return;
        const now = audioContext.currentTime;
        ringBell(chords[step % chords.length], now, 2.0);
        step++;
      }, 800);
    }

    soundBtn.addEventListener('click', () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      isSoundActive = !isSoundActive;
      if (isSoundActive) {
        soundIcon.className = "fa-solid fa-volume-high text-teal-600";
        triggerToast("Música suave activada");
        startMelodyLoop();
      } else {
        soundIcon.className = "fa-solid fa-volume-xmark text-stone-400";
        clearInterval(melodyTimer);
        triggerToast("Sonido silenciado");
      }
    });
