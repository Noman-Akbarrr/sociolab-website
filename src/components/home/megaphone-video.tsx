"use client";

import { useRef, useEffect, useState } from "react";

export function MegaphoneVideo({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [duration, setDuration] = useState(0);
  const animationRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);

  const setTargetTime = (target: number) => {
    targetTimeRef.current = Math.max(0, Math.min(duration, target));
    if (animationRef.current) return;

    const animate = () => {
      const video = videoRef.current;
      if (!video) return;

      const current = video.currentTime;
      const target = targetTimeRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.015) {
        video.currentTime = target;
        if (target === 0 || target === duration) {
          video.pause();
        }
        animationRef.current = null;
        return;
      }

      video.currentTime += diff * 0.18;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    directionRef.current = 1;
    setTargetTime(duration);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    directionRef.current = -1;
    setTargetTime(0);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) setDuration(video.duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime <= 0.05 && directionRef.current === -1) {
      video.pause();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/megaphone-for-web.webm"
      className={className}
      muted
      playsInline
      preload="auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      aria-hidden="true"
      style={{ background: "transparent" }}
    />
  );
}