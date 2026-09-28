"use client";

import { useRef, useEffect, useState } from "react";

interface ParallaxCardsProps {
  children: React.ReactNode;
  containerClassName?: string;
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxCards({
  children,
  containerClassName = "",
  enabled = true,
  className = "",
  style,
}: ParallaxCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const animationRef = useRef<number | null>(null);
  const targetPosRef = useRef({ x: 0, y: 0 });
  const currentPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const updateRect = () => {
      if (containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, [enabled]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !containerRect) return;
    
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    
    targetPosRef.current = {
      x: (e.clientX - containerRect.left - centerX) * 0.18,
      y: (e.clientY - containerRect.top - centerY) * 0.18,
    };
  };

  const handleMouseLeave = () => {
    if (!enabled) return;
    targetPosRef.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.15;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.15;

      const cards = containerRef.current?.querySelectorAll("[data-parallax-depth]");
      cards?.forEach((card) => {
        const depthAttr = card.getAttribute("data-parallax-depth");
        const depth = depthAttr ? parseFloat(depthAttr) : 0.5;
        const el = card as HTMLElement;
        el.style.setProperty("--parallax-x", (currentPosRef.current.x * depth) + "px");
        el.style.setProperty("--parallax-y", (currentPosRef.current.y * depth) + "px");
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [enabled]);

  return (
    <div
      ref={containerRef}
      className={"relative " + containerClassName + (className ? " " + className : "")}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ touchAction: "none", ...style }}
    >
      {children}
    </div>
  );
}