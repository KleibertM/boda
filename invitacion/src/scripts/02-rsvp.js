    /* global triggerToast */
    /* =================================================================
       5. ASISTENCIA RSVP INDIVIDUAL (1 EN 1)
       DESTINO: kleibertmedina@gmail.com Y WHATSAPP
       ================================================================= */
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const fullname = document.getElementById('rsvp-fullname').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const dietary = document.getElementById('rsvp-dietary').value.trim() || 'Sin restricción';
      const phone = document.getElementById('rsvp-phone').value.trim();
      const message = document.getElementById('rsvp-message').value.trim() || 'Sin mensaje adicional';

      if (!fullname || !phone) {
        triggerToast("Por favor completa tu nombre y tu teléfono.");
        return;
      }

      const recipient = "kleibertmedina@gmail.com";
      const subject = encodeURIComponent(`RSVP Individual Boda Kleibert & Sandy: ${fullname}`);
      const bodyContent = encodeURIComponent(
        `¡Hola Kleibert y Sandy!\n\n` +
        `Confirmo mi asistencia individual (1 persona) con los siguientes datos:\n\n` +
        `• Nombre del invitado: ${fullname}\n` +
        `• Modalidad: Registro Individual (1 invitado)\n` +
        `• Estado de asistencia: ${attendance}\n` +
        `• Teléfono / WhatsApp: ${phone}\n` +
        `• Menú o restricciones alimentarias: ${dietary}\n` +
        `• Mensaje personal: ${message}\n\n` +
        `¡Bendiciones para ambos en esta nueva etapa!`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${bodyContent}`;
      triggerToast("Abriendo correo para registrar tu asistencia individual...");

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);
    });

    function sendWhatsAppRSVP() {
      const fullname = document.getElementById('rsvp-fullname').value.trim() || 'Un invitado';
      const attendance = document.querySelector('input[name="attendance"]:checked').value;
      const phone = document.getElementById('rsvp-phone').value.trim() || 'No indicado';

      const text = encodeURIComponent(
        `¡Hola Kleibert y Sandy! Confirmo mi asistencia individual a su boda:\n\n` +
        `• Nombre: ${fullname}\n` +
        `• Asistencia: ${attendance}\n` +
        `• Cupo: 1 invitado individual\n` +
        `• Teléfono: ${phone}`
      );
      
      // WhatsApp directo al número oficial 976963819
      window.open(`https://wa.me/51976963819?text=${text}`, '_blank');
    }

    window.sendWhatsAppRSVP = sendWhatsAppRSVP;
