"use client";

import { useEffect, useRef } from "react";

export function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dot matrix wave characters & glowing sizes
    const dotChars = ["·", "∘", "○", "◯", "◌", "●", "◉"];
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      // Grid spacing for matrix dot wave
      const colSpacing = 28;
      const rowSpacing = 28;
      const cols = Math.ceil(rect.width / colSpacing);
      const rows = Math.ceil(rect.height / rowSpacing);

      ctx.font = "16px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x + 0.5) * colSpacing;
          const baseY = (y + 0.5) * rowSpacing;

          // Multiple wave interference equation
          const wave1 = Math.sin(x * 0.14 + time * 2.2) * Math.cos(y * 0.1 + time * 0.9);
          const wave2 = Math.sin((x + y) * 0.08 + time * 1.6);
          const wave3 = Math.cos(x * 0.1 - y * 0.07 + time * 1.1);

          const combined = (wave1 + wave2 + wave3) / 3;
          const normalized = (combined + 1) / 2;

          // Vertical displacement creating the wave ripple motion
          const py = baseY + Math.sin(x * 0.1 + y * 0.08 + time * 2) * 8;

          // Select character index and opacity based on wave amplitude
          const charIndex = Math.floor(normalized * (dotChars.length - 1));
          const alpha = 0.15 + normalized * 0.65;

          // Quantum color gradient: Cyan for high peaks, Violet for mid waves, White/Dark for base
          let color: string;
          if (isDarkMode) {
            if (normalized > 0.7) {
              color = `rgba(56, 189, 248, ${alpha})`; // Glowing Cyan
            } else if (normalized > 0.4) {
              color = `rgba(168, 85, 247, ${alpha * 0.85})`; // Violet
            } else {
              color = `rgba(255, 255, 255, ${alpha * 0.6})`;
            }
          } else {
            if (normalized > 0.7) {
              color = `rgba(14, 165, 233, ${alpha * 0.9})`; // Indigo Cyan
            } else if (normalized > 0.4) {
              color = `rgba(99, 102, 241, ${alpha * 0.8})`; // Purple
            } else {
              color = `rgba(30, 41, 59, ${alpha * 0.5})`;
            }
          }

          ctx.fillStyle = color;
          ctx.fillText(dotChars[charIndex], px, py);

          // Draw connecting dot particle glow on peak points
          if (normalized > 0.8) {
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = isDarkMode ? `rgba(56, 189, 248, ${alpha * 0.9})` : `rgba(14, 165, 233, ${alpha * 0.9})`;
            ctx.fill();
          }
        }
      }

      time += 0.018;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
