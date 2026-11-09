    /* global triggerToast, sanitizeText */
    /* =================================================================
       4. SECCIÓN DE DEDICATORIAS, CONSEJOS & VERSÍCULOS (CON SEGURIDAD)
       ================================================================= */
    const initialDedications = [
      {
        author: "Familia Medina Gómez",
        type: "Versículo Bíblico",
        citation: "Eclesiastés 4:12",
        message: "Cordón de tres dobleces no se rompe pronto. Que Cristo sea siempre el centro de su matrimonio.",
        time: "Hace 1 hora"
      },
      {
        author: "Familia Mansilla Rivera",
        type: "Bendición & Deseos",
        citation: "Proverbios 3:3",
        message: "Nunca se aparten de ustedes la misericordia y la verdad. ¡Les deseamos un hogar lleno de paz!",
        time: "Hace 3 horas"
      },
      {
        author: "Padrinos de Boda",
        type: "Consejo Matrimonial",
        citation: "Efesios 4:2-3",
        message: "La paciencia y el perdón diario son la base del amor duradero. ¡Sean muy felices siempre!",
        time: "Ayer"
      }
    ];

    function getDedications() {
      const stored = localStorage.getItem("wedding_dedications_data");
      return stored ? JSON.parse(stored) : initialDedications;
    }

    function renderDedications() {
      const list = getDedications();
      const wall = document.getElementById('dedications-wall');
      const badge = document.getElementById('ded-count-badge');
      wall.innerHTML = "";
      badge.innerText = `${list.length} dedicatorias`;

      list.forEach(item => {
        const card = document.createElement('div');
        card.className = "p-2.5 rounded-xl bg-white border border-teal-100 shadow-2xs hover:border-teal-300 transition";

        const safeAuthor = sanitizeText(item.author);
        const safeType = sanitizeText(item.type);
        const safeCitation = item.citation ? sanitizeText(item.citation) : "";
        const safeMessage = sanitizeText(item.message);
        const safeTime = sanitizeText(item.time || "Reciente");

        card.innerHTML = `
          <div class="flex items-center justify-between text-[11px] mb-1">
            <span class="font-bold text-stone-900">${safeAuthor}</span>
            <span class="text-[9px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full font-medium">${safeType}</span>
          </div>
          ${safeCitation ? `<div class="text-[10px] font-semibold text-teal-700 italic mb-0.5">"${safeCitation}"</div>` : ''}
          <p class="text-stone-600 text-[11px] italic leading-relaxed">"${safeMessage}"</p>
          <div class="text-right text-[9px] text-stone-400 mt-1">${safeTime}</div>
        `;
        wall.appendChild(card);
      });
    }

    // Cooldown de envío para prevenir spam o flood (Rate Limiting en Frontend)
    let lastDedicationTimestamp = 0;
    const SUBMIT_COOLDOWN_MS = 15000; // 15 segundos entre cada dedicatoria

    document.getElementById('dedication-form').addEventListener('submit', function(e) {
      e.preventDefault();

      // Control 1: Honeypot (si el bot rellenó el campo oculto, abortamos)
      const botField = document.getElementById('honeypot_field').value;
      if (botField) {
        console.warn("Detección de bot por Honeypot. Envío abortado.");
        return;
      }

      // Control 2: Rate Limiting
      const now = Date.now();
      if (now - lastDedicationTimestamp < SUBMIT_COOLDOWN_MS) {
        const waitSec = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastDedicationTimestamp)) / 1000);
        triggerToast(`Por favor espera ${waitSec} segundos para enviar otra dedicatoria.`);
        return;
      }

      // Control 3: Validación y Sanitización de entradas
      const author = document.getElementById('ded-author').value.trim();
      const type = document.getElementById('ded-type').value;
      const citation = document.getElementById('ded-citation').value.trim();
      const message = document.getElementById('ded-message').value.trim();

      if (author.length < 2 || message.length < 5) {
        triggerToast("Por favor ingresa un nombre y un mensaje válido.");
        return;
      }

      // Guardar en almacenamiento seguro local
      const currentList = getDedications();
      currentList.unshift({
        author: author,
        type: type,
        citation: citation,
        message: message,
        time: "Hace un momento"
      });

      localStorage.setItem("wedding_dedications_data", JSON.stringify(currentList));
      lastDedicationTimestamp = now;

      renderDedications();
      triggerToast("¡Dedicatoria agregada con bendición!");

      // Limpieza de campos
      document.getElementById('ded-author').value = "";
      document.getElementById('ded-citation').value = "";
      document.getElementById('ded-message').value = "";
    });

    renderDedications();
