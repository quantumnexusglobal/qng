"use client";

import React, { useRef, useState, useEffect } from "react";

interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  className?: string;
}

export default function SpecularButton({
  children,
  size = "lg",
  radius = 18,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  baseColor = "#525252",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  className = "",
  onClick,
  ...props
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      if (dist <= proximity) {
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x: xPercent, y: yPercent });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse, proximity]);

  useEffect(() => {
    if (!autoAnimate) return;

    let animFrame: number;
    let currentAngle = 0;

    const animate = () => {
      currentAngle = (currentAngle + speed * 2) % 360;
      setAngle(currentAngle);
      const rad = (currentAngle * Math.PI) / 180;
      const x = 50 + 50 * Math.cos(rad);
      const y = 50 + 50 * Math.sin(rad);
      setMousePos({ x, y });
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [autoAnimate, speed]);

  const paddingClasses =
    size === "sm" ? "px-4 py-2 text-xs" : size === "md" ? "px-6 py-3 text-sm" : "px-8 py-4 text-base";

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center justify-center font-medium transition-all duration-300 group overflow-hidden cursor-pointer select-none ${paddingClasses} ${className}`}
      style={{
        borderRadius: `${radius}px`,
        color: textColor,
        backgroundColor: baseColor,
        border: `${thickness}px solid rgba(255, 255, 255, 0.15)`,
        boxShadow: isHovered
          ? `0 12px 30px rgba(0, 0, 0, 0.4), 0 0 25px ${lineColor}40`
          : "0 4px 15px rgba(0, 0, 0, 0.2)",
      }}
      {...props}
    >
      {/* Tint Layer */}
      {tintOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundColor: tint,
            opacity: tintOpacity,
            borderRadius: `${radius}px`,
          }}
        />
      )}

      {/* Specular Light Reflection Ring / Sheen */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          borderRadius: `${radius}px`,
          opacity: isHovered ? intensity : intensity * 0.7,
          background: `radial-gradient(${shineSize * 15}px circle at ${mousePos.x}% ${
            mousePos.y
          }%, ${lineColor} 0%, ${lineColor}30 ${shineFade}%, transparent 80%)`,
          filter: blur > 0 ? `blur(${blur}px)` : "none",
        }}
      />

      {/* Specular Border Highlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          borderRadius: `${radius}px`,
          padding: `${thickness}px`,
          background: `radial-gradient(${shineSize * 20}px circle at ${mousePos.x}% ${
            mousePos.y
          }%, ${lineColor} 0%, transparent 70%)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform duration-300">
        {children}
      </span>
    </button>
  );
}
