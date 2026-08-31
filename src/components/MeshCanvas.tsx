'use client';
import { useEffect, useRef } from 'react';

export default function MeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const c = canvasRef.current;
    const ctx = c.getContext('2d')!;
    if (!ctx) return;

    let W = 0, H = 0;
    let nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];

    function resize() {
      W = c.width = c.offsetWidth * devicePixelRatio;
      H = c.height = c.offsetHeight * devicePixelRatio;
    }

    window.addEventListener('resize', resize);
    resize();

    const N = Math.min(64, Math.floor(W / 34));
    for (let i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() < 0.12 ? 2.6 : 1.4,
      });
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j],
            dx = a.x - b.x,
            dy = a.y - b.y,
            d = Math.hypot(dx, dy);
          if (d < W * 0.14) {
            ctx.strokeStyle = `rgba(237,28,36,${(1 - d / (W * 0.14)) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.r > 2 ? '#ED1C24' : 'rgba(245,245,245,.5)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 7);
        ctx.fill();
      }

      requestAnimationFrame(tick);
    }
    tick();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="mesh" ref={canvasRef} />;
}
