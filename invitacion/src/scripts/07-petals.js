    /* =================================================================
       10. CANVAS DE PÉTALOS Y HOJAS TROPICALES FLOTANTES
       ================================================================= */
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');
    let screenW, screenH;
    let petals = [];

    function resizeCanvas() {
      screenW = canvas.width = window.innerWidth;
      screenH = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class TropicalPetal {
      constructor() {
        this.init(true);
      }
      init(randomY = false) {
        this.x = Math.random() * screenW;
        this.y = randomY ? Math.random() * screenH : -20;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 0.75 + 0.35;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.2;
        this.opacity = Math.random() * 0.45 + 0.25;
        
        // Tonos celestes tropicales, menta y dorados sutiles
        const palettes = [
          'rgba(94, 197, 182, ',
          'rgba(122, 231, 199, ',
          'rgba(207, 168, 71, ',
          'rgba(232, 249, 245, '
        ];
        this.color = palettes[Math.floor(Math.random() * palettes.length)];
      }
      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.012) * 0.6 + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > screenH + 20) {
          this.init(false);
        }
      }
      render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.75, 0, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.75, 0, 0, -this.size);
        ctx.fill();
        ctx.restore();
      }
    }

    const count = window.innerWidth < 768 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      petals.push(new TropicalPetal());
    }

    function animatePetals() {
      ctx.clearRect(0, 0, screenW, screenH);
      petals.forEach(p => {
        p.update();
        p.render();
      });
      requestAnimationFrame(animatePetals);
    }

    animatePetals();
  