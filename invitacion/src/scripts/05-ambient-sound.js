    /* global triggerToast */
    /* =================================================================
       8. REPRODUCCIÓN DE LA CANCIÓN DE FONDO
       ================================================================= */
    const melodyAudioUrl = window.ambientMelodyUrl;
    const ambientAudio = document.getElementById('ambient-audio');
    const soundBtn = document.getElementById('ambient-sound-btn');
    const soundIcon = document.getElementById('sound-icon');

    ambientAudio.src = melodyAudioUrl;

    function updateSoundButton(isPlaying) {
      soundIcon.className = isPlaying
        ? "fa-solid fa-volume-high text-teal-600"
        : "fa-solid fa-volume-xmark text-stone-400";
      soundBtn.setAttribute('aria-pressed', String(isPlaying));
      soundBtn.setAttribute(
        'aria-label',
        isPlaying ? 'Pausar canción de fondo' : 'Reproducir canción de fondo'
      );
    }

    ambientAudio.addEventListener('play', () => updateSoundButton(true));
    ambientAudio.addEventListener('pause', () => updateSoundButton(false));
    ambientAudio.addEventListener('ended', () => updateSoundButton(false));
    ambientAudio.addEventListener('error', () => {
      updateSoundButton(false);
    });

    soundBtn.addEventListener('click', () => {
      document.getElementById('musica').scrollIntoView({ behavior: 'smooth' });

      if (ambientAudio.paused) {
        ambientAudio.play().catch(() => {
          triggerToast('No se pudo reproducir el audio. Verifica que exista el archivo en public/audio.');
        });
      } else {
        ambientAudio.pause();
      }
    });
