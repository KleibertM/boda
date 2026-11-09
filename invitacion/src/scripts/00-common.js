/* =================================================================
       1. FEEDBACK TOAST Y COPIADO SEGURO
       ================================================================= */
    function triggerToast(text) {
      const toast = document.getElementById('toast-msg');
      toast.innerText = text;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }

    function copyData(textToCopy, feedback) {
      const tempInput = document.createElement("input");
      tempInput.style.position = "absolute";
      tempInput.style.left = "-9999px";
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand("copy");
        triggerToast(feedback || "¡Copiado al portapapeles!");
      } catch {
        triggerToast("No se pudo copiar de forma automática");
      }
      document.body.removeChild(tempInput);
    }

    /* =================================================================
       2. CONTADOR REGRESIVO A FECHA TENTATIVA
       ================================================================= */
    const targetWedding = new Date();
    targetWedding.setDate(targetWedding.getDate() + 180); // 6 meses de referencia

    function runCountdown() {
      const now = new Date().getTime();
      const difference = targetWedding.getTime() - now;

      if (difference < 0) {
        document.getElementById('timer-days').innerText = "00";
        document.getElementById('timer-hours').innerText = "00";
        document.getElementById('timer-minutes').innerText = "00";
        document.getElementById('timer-seconds').innerText = "00";
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % 1000) / 1000);

      document.getElementById('timer-days').innerText = d < 10 ? '0' + d : d;
      document.getElementById('timer-hours').innerText = h < 10 ? '0' + h : h;
      document.getElementById('timer-minutes').innerText = m < 10 ? '0' + m : m;
      document.getElementById('timer-seconds').innerText = s < 10 ? '0' + s : s;
    }
    setInterval(runCountdown, 1000);
    runCountdown();

    /* =================================================================
       3. SANITIZACIÓN ROBUSTA CONTRA XSS / INYECCIÓN DE CARACTERES
       ================================================================= */
    function sanitizeText(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }

    window.copyData = copyData;
    window.triggerToast = triggerToast;
    window.sanitizeText = sanitizeText;
