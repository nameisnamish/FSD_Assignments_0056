import React, { useEffect, useRef } from 'react';

const SpatialBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for parallax
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate 4D hyper-spatial points (X, Y, Z, W coordinates)
    const particleCount = 45;
    const particles = [];
    const radius = Math.min(width, height) * 0.35;

    for (let i = 0; i < particleCount; i++) {
      // 4D hyper-sphere coordinates
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const w = Math.random() * Math.PI * 2;

      particles.push({
        x: radius * Math.sin(v) * Math.cos(u),
        y: radius * Math.sin(v) * Math.sin(u),
        z: radius * Math.cos(v),
        w: w, // 4th dimension hyper-phase
        baseSize: Math.random() * 2 + 1.5,
        color: Math.random() > 0.5 ? '#2997ff' : '#a1a1a6'
      });
    }

    let angleX = 0;
    let angleY = 0;
    let time4D = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      angleX += 0.003;
      angleY += 0.002;
      time4D += 0.015; // 4D time dimension shift

      const cx = width / 2 + (mouse.x - width / 2) * 0.08;
      const cy = height / 2 + (mouse.y - height / 2) * 0.08;

      const projected = [];

      // Rotate and project 4D -> 3D -> 2D
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 4D Rotation W-Z phase transformation
        const wShift = p.w + time4D;
        const x4 = p.x;
        const y4 = p.y;
        const z4 = p.z * Math.cos(wShift) - 50 * Math.sin(wShift);

        // 3D Rotations
        // Rotate around Y
        const x1 = x4 * Math.cos(angleY) + z4 * Math.sin(angleY);
        const z1 = -x4 * Math.sin(angleY) + z4 * Math.cos(angleY);

        // Rotate around X
        const y2 = y4 * Math.cos(angleX) - z1 * Math.sin(angleX);
        const z2 = y4 * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Perspective Projection
        const fov = 400;
        const perspective = fov / (fov + z2 + 300);

        const screenX = cx + x1 * perspective;
        const screenY = cy + y2 * perspective;
        const scale = Math.max(0.2, perspective);

        projected.push({
          x: screenX,
          y: screenY,
          scale: scale,
          z: z2,
          color: p.color
        });
      }

      // Draw 4D Spatial Mesh Connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Gradient connection line
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(41, 151, 255, ${alpha})`);
            grad.addColorStop(1, `rgba(161, 161, 166, ${alpha * 0.5})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1 * p1.scale;
            ctx.stroke();
          }
        }
      }

      // Render Spatial Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, Math.max(0.2, p.scale));
        ctx.shadowBlur = 12 * p.scale;
        ctx.shadowColor = '#2997ff';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.85
      }}
    />
  );
};

export default SpatialBackground;
