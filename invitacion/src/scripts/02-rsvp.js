/* global triggerToast */
    /* =================================================================
       5. ASISTENCIA RSVP INDIVIDUAL (1 EN 1)
       DESTINO: GOOGLE SHEETS (APPS SCRIPT), RESPALDO CORREO Y WHATSAPP
       ================================================================= */

      

    window.GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxB4LubW8qgtdZETrbxAD5ewg7p2085xUp0amHhqJCxLPbr3hKRyaK-t1LO_X2NK2tR/exec";
    const rsvpForm = document.getElementById('rsvp-form');

    rsvpForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const fullname = document.getElementById('rsvp-fullname').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Asistiré';
      const dietary = document.getElementById('rsvp-dietary').value.trim() || 'Sin restricción';
      const phone = document.getElementById('rsvp-phone').value.trim();
      const message = document.getElementById('rsvp-message').value.trim() || 'Sin mensaje adicional';

      if (!fullname || !phone) {
        triggerToast("Por favor completa tu nombre y tu teléfono.");
        return;
      }

      // Estado del botón durante el envío
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';
      }

      triggerToast("Registrando tu asistencia en la lista oficial...");

      // Carga de datos con nombres de propiedades coincidentes con el Apps Script
      const payload = {
        nombre: fullname,
        asistencia: attendance,
        telefono: phone,
        restricciones: dietary,
        mensaje: message
      };

      try {
        // Envío directo a Google Apps Script
        await fetch(window.GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // Evita bloqueos por redirección de Google
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });

        triggerToast(`¡Muchas gracias ${fullname}! Tu asistencia ha sido confirmada con éxito.`);
        rsvpForm.reset();

      } catch (err) {
        console.error("Error al registrar en Google Sheets:", err);
        triggerToast("Ocurrió un error. Abriendo tu correo de respaldo...");

        // Respaldo automático vía Mailto en caso de caída de conexión
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

        setTimeout(() => {
          window.location.href = `mailto:${recipient}?subject=${subject}&body=${bodyContent}`;
        }, 1000);

      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });

    function sendWhatsAppRSVP() {
      const fullname = document.getElementById('rsvp-fullname').value.trim() || 'Un invitado';
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Asistiré';
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