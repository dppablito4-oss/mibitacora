import { useEffect, useRef } from 'react';
import { audioEffects } from '../utils/audioEffects';

export default function CustomCursor({ theme }) {
  const cursorType = theme?.cursor_type || 'arc'; // 'none', 'arc', 'shield', 'mjolnir'
  const isMuted = theme?.sound_enabled === false;
  
  const canvasRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isHoveredRef = useRef(false);
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);

  // Determinar visibilidad de forma síncrona en el render
  const isMobile = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
  const showCanvas = !isMobile && cursorType !== 'none';

  useEffect(() => {
    // Si no se debe mostrar el cursor personalizado, remover la clase y salir
    if (!showCanvas) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    // Agregar la clase para ocultar el cursor del sistema
    document.documentElement.classList.add('custom-cursor-active');

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      positionRef.current.targetX = e.clientX;
      positionRef.current.targetY = e.clientY;
      
      // La primera vez, inicializar la posición interpolada instantáneamente
      if (positionRef.current.x === 0 && positionRef.current.y === 0) {
        positionRef.current.x = e.clientX;
        positionRef.current.y = e.clientY;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Trackear hovers en botones y links para efectos visuales y de sonido
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        isHoveredRef.current = true;
        audioEffects.playHover();
      }
    };
    const handleMouseOut = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        isHoveredRef.current = false;
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Efectos de click
    const handleMouseDown = () => {
      const { targetX, targetY } = positionRef.current;
      
      // Reproducir sonido repulsor/click
      if (cursorType === 'arc') {
        audioEffects.playRepulsor();
      } else {
        audioEffects.playClick();
      }

      // Crear onda expansiva en el punto exacto del click
      ripplesRef.current.push({
        x: targetX,
        y: targetY,
        radius: 5,
        maxRadius: 40,
        alpha: 0.8,
        speed: 2.5
      });

      // Crear chispas/partículas
      const count = cursorType === 'mjolnir' ? 20 : 12; // Mjolnir genera chispas eléctricas
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2 + 1,
          alpha: 1,
          life: 1,
          decay: 0.03 + Math.random() * 0.03,
          color: cursorType === 'mjolnir' ? '#38bdf8' : (theme?.accent_color || '#06b6d4') // Mjolnir azul eléctrico
        });
      }
    };
    window.addEventListener('mousedown', handleMouseDown);

    let animationFrameId;
    let angleRotation = 0;

    const accentColor = theme?.accent_color || '#06b6d4';

    // Bucle de animación del cursor y partículas
    const update = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Suavizar movimiento del cursor (Lerp) para la estela/glow secundario
      const pos = positionRef.current;
      pos.x += (pos.targetX - pos.x) * 0.15;
      pos.y += (pos.targetY - pos.y) * 0.15;

      const mouseX = pos.targetX;
      const mouseY = pos.targetY;
      const lerpX = pos.x;
      const lerpY = pos.y;

      // Rotar elementos del cursor
      angleRotation += 0.02;

      // 2. Dibujar Ondas Expansivas (Ripples)
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += ripple.speed;
        ripple.alpha -= 0.03;

        if (ripple.alpha <= 0) return false;

        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = ripple.alpha;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // 3. Dibujar Chispas de Click
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Gravedad leve
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      ctx.globalAlpha = 1.0;

      // 4. Dibujar Cursor Seleccionado
      const sizeMultiplier = isHoveredRef.current ? 1.3 : 1.0;
      
      if (cursorType === 'arc') {
        // --- REACTOR ARC DE IRON MAN ---
        const r = 16 * sizeMultiplier;
        
        // Brillo de fondo (sigue con retraso suave para dar sensación de energía flotante)
        const glow = ctx.createRadialGradient(lerpX, lerpY, 0, lerpX, lerpY, r * 2.5);
        glow.addColorStop(0, `${accentColor}40`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lerpX, lerpY, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Anillo exterior segmentado (posición del mouse instantánea)
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, r, 0, Math.PI * 2);
        ctx.stroke();

        // Líneas internas del reactor (posición del mouse instantánea)
        ctx.save();
        ctx.translate(mouseX, mouseY);
        ctx.rotate(angleRotation);
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 10; i++) {
          ctx.rotate((Math.PI * 2) / 10);
          ctx.beginPath();
          ctx.moveTo(r - 5, 0);
          ctx.lineTo(r, 0);
          ctx.stroke();
        }
        ctx.restore();

        // Núcleo central brillante (posición del mouse instantánea para click exacto)
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, r / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Resetear sombra

      } else if (cursorType === 'shield') {
        // --- S.H.I.E.L.D. TARGET HUD ---
        const r = 18 * sizeMultiplier;

        // Anillo exterior discontinuo que sigue con lag (estela de escaneo/fijación)
        ctx.strokeStyle = `${accentColor}70`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.arc(lerpX, lerpY, r + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset

        // Mira central instantánea
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.arc(mouseX, mouseY, r, 0, Math.PI * 2);
        ctx.stroke();

        // Líneas de mira en cruz
        ctx.beginPath();
        ctx.moveTo(mouseX - r - 4, mouseY); ctx.lineTo(mouseX - r + 2, mouseY);
        ctx.moveTo(mouseX + r - 2, mouseY); ctx.lineTo(mouseX + r + 4, mouseY);
        ctx.moveTo(mouseX, mouseY - r - 4); ctx.lineTo(mouseX, mouseY - r + 2);
        ctx.moveTo(mouseX, mouseY + r - 2); ctx.lineTo(mouseX, mouseY + r + 4);
        ctx.stroke();

        // Cuadrado pequeño en el centro exacto
        ctx.fillStyle = accentColor;
        ctx.fillRect(mouseX - 1.5, mouseY - 1.5, 3, 3);

      } else if (cursorType === 'mjolnir') {
        // --- MJOLNIR (MARTILLO DE THOR) ---
        // Dibujamos el martillo instantáneamente
        ctx.save();
        ctx.translate(mouseX, mouseY);
        ctx.rotate(Math.sin(angleRotation * 0.5) * 0.15); // Balanceo leve al moverse
        
        ctx.strokeStyle = accentColor;
        ctx.fillStyle = theme?.mode === 'light' ? '#334155' : '#1e293b';
        ctx.lineWidth = 1.5;

        // Cabeza del martillo (caja central)
        ctx.beginPath();
        ctx.rect(-10, -16, 20, 10);
        ctx.fill();
        ctx.stroke();

        // Bordes biselados del martillo
        ctx.beginPath();
        ctx.moveTo(-10, -16); ctx.lineTo(-14, -13); ctx.lineTo(-14, -9); ctx.lineTo(-10, -6);
        ctx.moveTo(10, -16); ctx.lineTo(14, -13); ctx.lineTo(14, -9); ctx.lineTo(10, -6);
        ctx.stroke();

        // Mango
        ctx.strokeStyle = '#a1a1aa';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 12);
        ctx.stroke();

        // Correa/mango base
        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.arc(0, 12, 2, 0, Math.PI);
        ctx.stroke();

        ctx.restore();

        // Estela eléctrica (pequeño rayo zig-zag que conecta el martillo con la posición retrasada lerpX/lerpY)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY);
        const midX = (mouseX + lerpX) / 2 + (Math.random() - 0.5) * 8;
        const midY = (mouseY + lerpY) / 2 + (Math.random() - 0.5) * 8;
        ctx.lineTo(midX, midY);
        ctx.lineTo(lerpX, lerpY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.classList.remove('custom-cursor-active');
      cancelAnimationFrame(animationFrameId);
    };
  }, [showCanvas, cursorType, theme?.accent_color, theme?.mode]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full z-50 pointer-events-none ${showCanvas ? 'block' : 'hidden'}`}
    />
  );
}
