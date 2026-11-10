    /* global triggerToast, sanitizeText */
    /* =================================================================
       7. PLAYLIST COMPARTIDA DE LOS INVITADOS
       ================================================================= */
    const playlistApiUrl = window.GOOGLE_SCRIPT_URL;
    let playlistSongs = [];
    let playlistSyncErrorShown = false;

    function renderSongs(list = playlistSongs) {
      const container = document.getElementById('guest-songs-container');
      const badge = document.getElementById('playlist-count-badge');
      const toggleButton = document.getElementById('toggle-guest-songs');
      container.innerHTML = "";
      badge.innerText = `${list.length} sugerencias`;
      toggleButton.hidden = list.length <= 2;

      list.forEach(item => {
        const div = document.createElement('div');
        div.className = "text-xs p-2 rounded-lg bg-teal-50/70 border border-teal-100 flex items-center justify-between";
        div.innerHTML = `
          <div class="truncate">
            <span class="font-semibold text-stone-800">${sanitizeText(item.song)}</span>
            <span class="text-[10px] text-stone-500"> - ${sanitizeText(item.artist)}</span>
          </div>
          <span class="text-[10px] text-teal-800 font-medium bg-white px-2 py-0.5 rounded-full shadow-2xs">${sanitizeText(item.name)}</span>
        `;
        container.appendChild(div);
      });
    }

    function loadSharedSongs() {
      return new Promise((resolve, reject) => {
        const callbackName = `playlistCallback${Date.now()}${Math.random().toString(36).slice(2)}`;
        const script = document.createElement('script');
        const cleanup = () => {
          delete window[callbackName];
          script.remove();
        };
        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error('Tiempo agotado al consultar la playlist.'));
        }, 10000);

        window[callbackName] = response => {
          clearTimeout(timeout);
          cleanup();
          if (!response || !Array.isArray(response.songs)) {
            reject(new Error(response?.error || 'Respuesta inválida al consultar la playlist.'));
            return;
          }
          resolve(response.songs);
        };
        script.onerror = () => {
          clearTimeout(timeout);
          cleanup();
          reject(new Error('No se pudo consultar la playlist compartida.'));
        };
        script.src = `${playlistApiUrl}?action=playlist&callback=${callbackName}&_=${Date.now()}`;
        document.head.appendChild(script);
      });
    }

    function countMatchingSongs(songs, song) {
      return songs.filter(item =>
        item.name === song.name &&
        item.song === song.song &&
        item.artist === song.artist
      ).length;
    }

    async function addSharedSong(song) {
      const previousSongs = await loadSharedSongs();
      await fetch(playlistApiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          tipo: 'playlist',
          cancion: song.song,
          artista: song.artist,
          nombre: song.name,
        }),
      });

      for (let attempt = 0; attempt < 6; attempt++) {
        const songs = await loadSharedSongs();
        if (countMatchingSongs(songs, song) > countMatchingSongs(previousSongs, song)) {
          return songs;
        }
        await new Promise(resolve => setTimeout(resolve, 750));
      }

      throw new Error('La sugerencia no apareció en la segunda hoja.');
    }

    function refreshSharedSongs() {
      loadSharedSongs()
        .then(songs => {
          playlistSongs = songs;
          playlistSyncErrorShown = false;
          renderSongs();
        })
        .catch(error => {
          console.error(error);
          if (!playlistSyncErrorShown) {
            triggerToast('No se pudo actualizar la playlist compartida.');
            playlistSyncErrorShown = true;
          }
        });
    }

    refreshSharedSongs();
    setInterval(() => {
      if (!document.hidden) refreshSharedSongs();
    }, 15000);

    document.getElementById('toggle-guest-songs').addEventListener('click', function() {
      const container = document.getElementById('guest-songs-container');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!isExpanded));
      container.classList.toggle('max-h-24', isExpanded);
      container.classList.toggle('max-h-none', !isExpanded);
      container.classList.toggle('overflow-hidden', isExpanded);
      container.classList.toggle('overflow-visible', !isExpanded);
      this.innerText = isExpanded ? 'Ver todas las sugerencias' : 'Mostrar menos';
    });

    document.getElementById('playlist-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const recommender = document.getElementById('recommender-name').value.trim();
      const title = document.getElementById('song-name').value.trim();
      const artist = document.getElementById('artist-name').value.trim();

      if (!recommender || !title || !artist) return;

      const submitButton = this.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      try {
        const song = { name: recommender, song: title, artist };
        playlistSongs = await addSharedSong(song);
        renderSongs();
        triggerToast(`¡Tema agregado por ${recommender}!`);
        this.reset();
        document.getElementById('now-playing-label').innerText = `♫ Recomendación: ${title} (${artist})`;
      } catch (error) {
        console.error(error);
        triggerToast('No se pudo guardar en la playlist compartida. Intenta nuevamente.');
      } finally {
        submitButton.disabled = false;
      }
    });

    function previewSong(track) {
      document.getElementById('now-playing-label').innerText = `♫ Sintonizando: ${track}`;
      triggerToast(`Escuchando muestra: ${track}`);
    }

    window.previewSong = previewSong;
