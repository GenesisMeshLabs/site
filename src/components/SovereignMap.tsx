'use client';
import { useEffect, useRef } from 'react';

export default function SovereignMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sv = canvasRef.current;
    const sx = sv.getContext('2d')!;
    if (!sx) return;

    const clouds = ['AZURE', 'DIGITALOCEAN', 'CLOUDFLARE', 'AKAMAI/LINODE'];
    let SW = 0, SH = 0;

    function sresize() {
      SW = sv.width = sv.offsetWidth * devicePixelRatio;
      SH = sv.height = 340 * devicePixelRatio;
    }

    window.addEventListener('resize', sresize);
    sresize();

    const nodes = clouds.map((name, i) => {
      const ang = -Math.PI / 2 + (i * (Math.PI * 2)) / clouds.length;
      return { name, bx: 0.5 + Math.cos(ang) * 0.3, by: 0.5 + Math.sin(ang) * 0.3, ph: Math.random() * 6.28 };
    });
    const hub = { bx: 0.5, by: 0.5 };
    let t0 = 0;

    function stick(ts: number) {
      t0 = ts / 1000;
      sx.clearRect(0, 0, SW, SH);

      const cx = hub.bx * SW,
        cy = hub.by * SH;

      nodes.forEach((n, i) => {
        const nx = n.bx * SW,
          ny = n.by * SH;
        const pulse = (Math.sin(t0 * 1.6 + n.ph) + 1) / 2;

        sx.strokeStyle = `rgba(237,28,36,${0.12 + pulse * 0.25})`;
        sx.lineWidth = 1 * devicePixelRatio;
        sx.setLineDash([6 * devicePixelRatio, 8 * devicePixelRatio]);
        sx.lineDashOffset = -t0 * 40 * devicePixelRatio;
        sx.beginPath();
        sx.moveTo(cx, cy);
        sx.lineTo(nx, ny);
        sx.stroke();
        sx.setLineDash([]);

        const m = nodes[(i + 1) % nodes.length];
        sx.strokeStyle = 'rgba(245,245,245,.08)';
        sx.beginPath();
        sx.moveTo(nx, ny);
        sx.lineTo(m.bx * SW, m.by * SH);
        sx.stroke();

        const pt = ((t0 * 0.25 + i * 0.25) % 1);
        sx.fillStyle = '#ED1C24';
        sx.beginPath();
        sx.arc(cx + (nx - cx) * pt, cy + (ny - cy) * pt, 2.2 * devicePixelRatio, 0, 7);
        sx.fill();
      });

      sx.fillStyle = '#ED1C24';
      sx.beginPath();
      sx.arc(cx, cy, 4 * devicePixelRatio, 0, 7);
      sx.fill();

      sx.strokeStyle = 'rgba(237,28,36,.35)';
      sx.beginPath();
      sx.arc(cx, cy, (8 + 3 * Math.sin(t0 * 2)) * devicePixelRatio, 0, 7);
      sx.stroke();

      sx.fillStyle = 'rgba(245,245,245,.55)';
      sx.font = `${9 * devicePixelRatio}px "JetBrains Mono", monospace`;
      sx.textAlign = 'center';
      sx.fillText('RECOGNITION NETWORK', cx, cy + 22 * devicePixelRatio);

      nodes.forEach((n) => {
        const nx = n.bx * SW,
          ny = n.by * SH;
        sx.fillStyle = '#f5f5f5';
        sx.beginPath();
        sx.arc(nx, ny, 3.4 * devicePixelRatio, 0, 7);
        sx.fill();

        sx.strokeStyle = 'rgba(245,245,245,.25)';
        sx.beginPath();
        sx.arc(nx, ny, 8 * devicePixelRatio, 0, 7);
        sx.stroke();

        sx.fillStyle = 'rgba(245,245,245,.6)';
        sx.font = `${9 * devicePixelRatio}px "JetBrains Mono", monospace`;
        sx.fillText(n.name, nx, ny - 14 * devicePixelRatio);

        sx.fillStyle = 'rgba(237,28,36,.8)';
        sx.fillText('● ONLINE', nx, ny + 20 * devicePixelRatio);
      });

      requestAnimationFrame(stick);
    }
    requestAnimationFrame(stick);

    return () => {
      window.removeEventListener('resize', sresize);
    };
  }, []);

  return <canvas id="sovmap" ref={canvasRef} />;
}
