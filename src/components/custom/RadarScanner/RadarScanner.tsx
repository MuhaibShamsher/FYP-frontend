import { useEffect, useRef } from 'react';
import styles from './RadarScanner.module.css';

export default function RadarScanner({ progress, isActive = false }: {
  progress: number;
  isActive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const center = size / 2;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // 1. Grid & Circles
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.2)';
      ctx.lineWidth = 1;

      [0.2, 0.4, 0.6, 0.8].forEach((scale) => {
        ctx.beginPath();
        ctx.arc(center, center, (size / 2 - 2) * scale, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(center, center, size / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(249, 115, 22, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(center, 0);
      ctx.lineTo(center, size);
      ctx.moveTo(0, center);
      ctx.lineTo(size, center);
      ctx.stroke();

      // 2. Progress Arc
      if (progress > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f97316';
        const endAngle = -Math.PI / 2 + Math.PI * 2 * (progress / 100);
        ctx.arc(center, center, size / 2 - 6, -Math.PI / 2, endAngle);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. Radar Sweep — only when actively scanning
      if (isActive) {
        const sweepSpeed = 0.05;
        angle = (angle + sweepSpeed) % (Math.PI * 2);

        const gradient = ctx.createConicGradient(angle, center, center);
        gradient.addColorStop(0, 'rgba(249, 115, 22, 0)');
        gradient.addColorStop(0.8, 'rgba(249, 115, 22, 0.1)');
        gradient.addColorStop(1, 'rgba(249, 115, 22, 0.6)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(center, center, size / 2 - 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Center Core
      ctx.beginPath();
      ctx.fillStyle = '#f97316';
      ctx.arc(center, center, 3, 0, Math.PI * 2);
      ctx.fill();

      // Pulse — only when actively scanning
      if (isActive) {
        const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.2;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
        ctx.lineWidth = 1;
        ctx.arc(center, center, 8 * pulseScale, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [progress]);

  return (
    <div className={styles.container}>
      <div className={styles.scannerWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {/* Overlay Stats */}
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <span className={styles.progressText}>{Math.round(progress)}%</span>
            <span className={styles.statusText}>
              {progress === 100 ? 'COMPLETE' : isActive ? 'SCANNING' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
