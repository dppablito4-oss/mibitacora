import { useEffect, useRef } from 'react';

export default function SpaceBackground({ theme }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ajustar dimensiones en resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Trackear movimiento del mouse con suavizado (lerp)
    const handleMouseMove = (e) => {
      mouseRef.current.tx = e.clientX - width / 2;
      mouseRef.current.ty = e.clientY - height / 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Configuración del fondo según el tema
    const isDark = theme?.mode !== 'light';
    const accentColor = theme?.accent_color || '#06b6d4';
    const particlesEnabled = theme?.particles !== false;

    // Inicializar estrellas
    const starCount = Math.min(Math.floor((width * height) / 8000), 150);
    const stars = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        alpha: Math.random() * 0.8 + 0.2,
        alphaSpeed: 0.005 + Math.random() * 0.01,
        color: Math.random() > 0.4 ? '#ffffff' : accentColor
      });
    }

    // Inicializar partículas flotantes grandes (nebulosas)
    const nebulas = [
      { x: width * 0.25, y: height * 0.2, rx: 250, ry: 200, color: `${accentColor}08`, speed: 0.0002, angle: 0 },
      { x: width * 0.75, y: height * 0.7, rx: 300, ry: 250, color: `${accentColor}06`, speed: 0.00015, angle: Math.PI }
    ];

    // Bucle de renderizado
    const render = () => {
      // Suavizar movimiento del ratón
      const mouse = mouseRef.current;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Limpiar canvas
      ctx.clearRect(0, 0, width, height);

      // Dibujar cuadrícula tecnológica muy sutil en modo oscuro
      if (isDark) {
        ctx.strokeStyle = `${accentColor}02`;
        ctx.lineWidth = 1;
        const gridSize = 60;
        
        // Agregar un ligero desplazamiento basado en el mouse (parallax 3D)
        const offsetX = -mouse.x * 0.02;
        const offsetY = -mouse.y * 0.02;

        ctx.beginPath();
        for (let x = offsetX % gridSize; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = offsetY % gridSize; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      }

      // Dibujar nebulosas (luces flotantes)
      nebulas.forEach((nebula) => {
        nebula.angle += nebula.speed;
        const dx = Math.cos(nebula.angle) * 30 - mouse.x * 0.03;
        const dy = Math.sin(nebula.angle) * 30 - mouse.y * 0.03;

        const grad = ctx.createRadialGradient(
          nebula.x + dx, nebula.y + dy, 0,
          nebula.x + dx, nebula.y + dy, Math.max(nebula.rx, nebula.ry)
        );
        grad.addColorStop(0, nebula.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nebula.x + dx, nebula.y + dy, Math.max(nebula.rx, nebula.ry), 0, Math.PI * 2);
        ctx.fill();
      });

      // Dibujar y actualizar estrellas
      if (particlesEnabled) {
        stars.forEach((star) => {
          // Movimiento de la estrella
          star.x += star.speedX;
          star.y += star.speedY;

          // Parallax basado en el ratón y el tamaño de la estrella (más grandes se mueven más)
          const px = -mouse.x * (star.size * 0.03);
          const py = -mouse.y * (star.size * 0.03);

          let drawX = star.x + px;
          let drawY = star.y + py;

          // Envolver bordes
          if (drawX < 0) star.x = width - px;
          if (drawX > width) star.x = -px;
          if (drawY < 0) star.y = height - py;
          if (drawY > height) star.y = -py;

          // Guardar posiciones de renderizado final para optimizar constelaciones
          star.drawX = star.x + px;
          star.drawY = star.y + py;

          // Parpadeo (efecto centelleo)
          star.alpha += star.alphaSpeed;
          if (star.alpha > 1 || star.alpha < 0.1) {
            star.alphaSpeed = -star.alphaSpeed;
          }

          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
          ctx.beginPath();
          ctx.arc(star.drawX, star.drawY, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.globalAlpha = 1.0;

        // Dibujar constelaciones (líneas de conexión entre estrellas cercanas)
        if (isDark) {
          ctx.lineWidth = 0.5;
          for (let i = 0; i < starCount; i++) {
            const s1 = stars[i];
            for (let j = i + 1; j < starCount; j++) {
              const s2 = stars[j];

              const dx = s1.drawX - s2.drawX;
              const dy = s1.drawY - s2.drawY;
              const distSq = dx * dx + dy * dy;

              // Evitar Math.sqrt salvo que la distancia esté en el rango de conexión (< 100px)
              if (distSq < 10000) {
                const dist = Math.sqrt(distSq);
                const lineAlpha = (1 - dist / 100) * 0.15;
                ctx.strokeStyle = `${accentColor}${Math.floor(lineAlpha * 255).toString(16).padStart(2, '0')}`;
                ctx.beginPath();
                ctx.moveTo(s1.drawX, s1.drawY);
                ctx.lineTo(s2.drawX, s2.drawY);
                ctx.stroke();
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme?.mode, theme?.accent_color, theme?.particles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none block"
    />
  );
}
