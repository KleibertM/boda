    /* =================================================================
       9. NAVEGACIÓN Y SINCRONIZACIÓN DE DOTS CON SCROLL SNAP
       ================================================================= */
    const scroller = document.getElementById('snap-scroller');
    const sections = document.querySelectorAll('.snap-section');
    const dots = document.querySelectorAll('.nav-dot');

    scroller.addEventListener('scroll', () => {
      const middle = scroller.scrollTop + scroller.clientHeight / 2;
      sections.forEach((sec, idx) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (middle >= top && middle < top + height) {
          dots.forEach(d => d.classList.remove('active'));
          if (dots[idx]) dots[idx].classList.add('active');
        }
      });
    });

