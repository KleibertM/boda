    /* global triggerToast */
    /* =================================================================
       6. GALERÍA DE FOTOS DIDÁCTICA CON SUBIDA INTERACTIVA Y LIGHTBOX
       ================================================================= */
    const defaultGalleryImages = [
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80", caption: "Nuestro compromiso y amor mutuo" },
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80", caption: "Detalles florales y armonía" },
      { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80", caption: "Caminando juntos bajo la luz" },
      { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80", caption: "Celebrando la dicha del brindis" },
      { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80", caption: "Risas y promesas para siempre" },
      { url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80", caption: "Nuestra unión bendecida por Dios" }
    ];

    function getGalleryPhotos() {
      const stored = localStorage.getItem("wedding_user_photos");
      return stored ? JSON.parse(stored) : defaultGalleryImages;
    }

    function renderGallery() {
      const photos = getGalleryPhotos();
      const grid = document.getElementById('interactive-gallery-grid');
      const badge = document.getElementById('photo-count-badge');
      grid.innerHTML = "";
      badge.innerText = `${photos.length} fotos`;

      photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = "photo-thumb aspect-square rounded-xl overflow-hidden bg-stone-100 border border-teal-100 shadow-2xs relative group";
        
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.caption || "Fotografía de la boda de Kleibert y Sandy";
        img.className = "w-full h-full object-cover transition duration-300 group-hover:scale-105";
        img.loading = "lazy";

        // Overlay interactivo didáctico
        const overlay = document.createElement('div');
        overlay.className = "absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs";
        overlay.innerHTML = '<i class="fa-solid fa-expand text-base"></i>';

        item.appendChild(img);
        item.appendChild(overlay);

        item.addEventListener('click', () => {
          openLightbox(photo.url, photo.caption || "Boda Kleibert & Sandy");
        });

        grid.appendChild(item);
      });
    }

    // Manejo de subida didáctica con drag & drop y file input
    const dropArea = document.getElementById('gallery-drop-area');
    const fileInput = document.getElementById('gallery-file-input');

    dropArea.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('drag-active');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('drag-active');
      }, false);
    });

    dropArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleUploadedFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
      handleUploadedFiles(e.target.files);
    });

    function handleUploadedFiles(files) {
      if (!files || !files.length) return;
      let loadedCount = 0;
      const currentList = getGalleryPhotos();

      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          triggerToast("Por favor sube solo archivos de imagen (JPG, PNG).");
          return;
        }

        const reader = new FileReader();
        reader.onload = function(evt) {
          const base64Data = evt.target.result;
          currentList.unshift({
            url: base64Data,
            caption: `Foto compartida por invitado (${file.name})`
          });
          loadedCount++;

          if (loadedCount === files.length) {
            try {
              localStorage.setItem("wedding_user_photos", JSON.stringify(currentList));
            } catch {
              console.warn("Storage quota excedida para imágenes locales.");
            }
            renderGallery();
            triggerToast(`¡${loadedCount} foto(s) agregada(s) con éxito al muro!`);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Modal Lightbox
    const lightboxModal = document.getElementById('photo-lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-target-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    function openLightbox(url, caption) {
      lightboxImg.src = url;
      lightboxCaption.innerText = caption;
      lightboxModal.classList.remove('hidden');
      lightboxModal.classList.add('flex');
    }

    function closeLightbox() {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
      lightboxImg.src = "";
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === "Escape" && !lightboxModal.classList.contains('hidden')) {
        closeLightbox();
      }
    });

    renderGallery();
