import { useEffect, useRef } from 'react';

/**
 * Animated background scene with floating light orbs and ambient particles.
 * Optimized: CSS animations for orbs (GPU-composited), throttled canvas to ~30fps.
 */
export default function BackgroundScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animId;
    let particles = [];
    let lastTime = 0;
    const FPS_INTERVAL = 1000 / 30; // Cap at 30fps

    const resize = () => {
      // Use devicePixelRatio for crisp rendering but limit to 1x for perf
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Reduced from 30 to 15 particles — barely visible difference
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.1 - 0.05,
        opacity: Math.random() * 0.3 + 0.05,
      });
    }

    const animate = (timestamp) => {
      animId = requestAnimationFrame(animate);

      // Throttle to ~30fps
      const elapsed = timestamp - lastTime;
      if (elapsed < FPS_INTERVAL) return;
      lastTime = timestamp - (elapsed % FPS_INTERVAL);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 195, 165, ${p.opacity})`;
        ctx.fill();
      }
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <div className="scene-bg" />
      {/* Floating light orbs — pure CSS keyframes, GPU composited */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div
          className="bg-orb bg-orb-1"
          style={{
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(216,167,167,0.08) 0%, transparent 70%)',
            top: '10%',
            left: '60%',
          }}
        />
        <div
          className="bg-orb bg-orb-2"
          style={{
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(216,195,165,0.1) 0%, transparent 70%)',
            bottom: '20%',
            left: '10%',
          }}
        />
        {/* Dust particle canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ opacity: 0.6 }}
        />
      </div>
    </>
  );
}
