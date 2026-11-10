    /* global triggerToast, sanitizeText */
    /* =================================================================
       7. PLAYLIST DE LOS INVITADOS CON LOCALSTORAGE
       ================================================================= */
    const initialSongs = [
      { name: "Carlos M.", song: "Renuévame", artist: "Marcos Witt" },
      { name: "Valeria R.", song: "La Bondad de Dios", artist: "Essential Worship / Evan Craft" },
      { name: "Andrés G.", song: "Jesucristo Basta", artist: "Un Corazón" }
    ];

    function getSongs() {
      const stored = localStorage.getItem("wedding_playlist_data");
      return stored ? JSON.parse(stored) : initialSongs;
    }

    function renderSongs() {
      const list = getSongs();
      const container = document.getElementById('guest-songs-container');
      const badge = document.getElementById('playlist-count-badge');
      container.innerHTML = "";
      badge.innerText = `${list.length} sugerencias`;

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

    document.getElementById('playlist-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const recommender = document.getElementById('recommender-name').value.trim();
      const title = document.getElementById('song-name').value.trim();
      const artist = document.getElementById('artist-name').value.trim();

      if (!recommender || !title || !artist) return;

      const current = getSongs();
      current.unshift({ name: recommender, song: title, artist: artist });
      localStorage.setItem("wedding_playlist_data", JSON.stringify(current));

      renderSongs();
      triggerToast(`¡Tema agregado por ${recommender}!`);

      document.getElementById('song-name').value = "";
      document.getElementById('artist-name').value = "";
      document.getElementById('now-playing-label').innerText = `♫ Recomendación: ${title} (${artist})`;
    });

    function previewSong(track) {
      document.getElementById('now-playing-label').innerText = `♫ Sintonizando: ${track}`;
      triggerToast(`Escuchando muestra: ${track}`);
    }

    window.previewSong = previewSong;

    renderSongs();
