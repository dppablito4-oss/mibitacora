import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ── Generar estrellas en múltiples capas de profundidad ──
    // Cada capa se mueve a velocidad diferente con el scroll (parallax)
    const layers = [
      { count: 200, minR: 0.3, maxR: 0.8,  speed: 0.02, alpha: [0.15, 0.4]  },  // Lejanas y tenues
      { count: 120, minR: 0.6, maxR: 1.2,  speed: 0.05, alpha: [0.25, 0.55] },  // Media distancia
      { count: 60,  minR: 1.0, maxR: 1.8,  speed: 0.10, alpha: [0.4, 0.75]  },  // Cercanas
      { count: 15,  minR: 1.8, maxR: 3.0,  speed: 0.15, alpha: [0.6, 0.95], glow: true }, // Brillantes con destello
    ];

    // Generar posiciones usando un campo más grande que la pantalla
    // para que al hacer parallax no se vean vacíos
    const fieldH = 12000; // Campo vertical grande

    const starData = layers.map(layer => {
      const stars = [];
      for (let i = 0; i < layer.count; i++) {
        const r = layer.minR + Math.random() * (layer.maxR - layer.minR);
        const baseAlpha = layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0]);
        stars.push({
          x: Math.random() * 3000, // Campo ancho (se hará modulo con width)
          y: Math.random() * fieldH,
          r,
          baseAlpha,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.005 + Math.random() * 0.02,
          color: Math.random() > 0.85 ? '#a5f3fc' : (Math.random() > 0.7 ? '#cffafe' : '#ffffff'),
        });
      }
      return { ...layer, stars };
    });

    // ── Nebulosas sutiles (manchas de color difuso) ──
    const nebulas = [
      { x: 0.15, y: 0.25, r: 280, color: 'rgba(6,182,212,', opacity: 0.04 },
      { x: 0.75, y: 0.55, r: 320, color: 'rgba(168,85,247,', opacity: 0.03 },
      { x: 0.45, y: 0.80, r: 250, color: 'rgba(6,182,212,', opacity: 0.025 },
    ];

    // ── Función de dibujo de estrella con destello ──
    function drawGlowStar(cx, cy, r, alpha, color) {
      // Halo exterior
      const glowR = r * 6;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0, color);
      glow.addColorStop(0.15, color);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = alpha * 0.25;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Rayos en cruz
      ctx.globalAlpha = alpha * 0.5;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6;
      const spikeLen = r * 8;
      ctx.beginPath();
      ctx.moveTo(cx - spikeLen, cy);
      ctx.lineTo(cx + spikeLen, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - spikeLen);
      ctx.lineTo(cx, cy + spikeLen);
      ctx.stroke();

      // Rayos diagonales más cortos
      const diagLen = spikeLen * 0.5;
      ctx.globalAlpha = alpha * 0.25;
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(cx - diagLen * 0.707, cy - diagLen * 0.707);
      ctx.lineTo(cx + diagLen * 0.707, cy + diagLen * 0.707);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + diagLen * 0.707, cy - diagLen * 0.707);
      ctx.lineTo(cx - diagLen * 0.707, cy + diagLen * 0.707);
      ctx.stroke();

      // Núcleo brillante
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Bucle de renderizado ──
    let time = 0;
    const render = () => {
      time++;
      const scrollY = window.scrollY || 0;

      ctx.clearRect(0, 0, width, height);

      // Fondo sólido negro profundo
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Nebulosas (no se mueven, efecto ambiental)
      nebulas.forEach(neb => {
        const nx = neb.x * width;
        const ny = neb.y * height;
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, neb.r);
        grad.addColorStop(0, neb.color + neb.opacity + ')');
        grad.addColorStop(1, neb.color + '0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nx, ny, neb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Estrellas por capa con parallax
      starData.forEach(layer => {
        const offsetY = scrollY * layer.speed;

        layer.stars.forEach(star => {
          // Posición X con wrap-around al ancho de pantalla
          const sx = star.x % width;
          // Posición Y con parallax y wrap-around
          const rawY = star.y - offsetY;
          const sy = ((rawY % fieldH) + fieldH) % fieldH;
          // Solo dibujar si está visible en el viewport
          const screenY = sy % height;
          // Efecto de que están distribuidas en todo el campo
          // pero solo dibujamos las que caen en la pantalla
          const mappedY = ((star.y - offsetY) % height + height) % height;

          // Parpadeo suave
          star.twinklePhase += star.twinkleSpeed;
          const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase);
          const alpha = star.baseAlpha * (0.5 + twinkle * 0.5);

          if (layer.glow) {
            drawGlowStar(sx, mappedY, star.r, alpha, star.color);
          } else {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(sx, mappedY, star.r, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ backgroundColor: '#030712' }}
    />
  );
}
