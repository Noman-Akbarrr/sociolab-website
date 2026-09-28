"use client";

import { useRef, useEffect, useState } from "react";

export function MegaphoneVideo({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const animationRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);

  const playForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 1;
    video.play().catch(() => {});
  };

  const playReverse = () => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = -1;
    video.play().catch(() => {});
  };

  const scrubTo = (targetTime: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const video = videoRef.current;
      if (!video) return;

      const diff = targetTime - video.currentTime;
      if (Math.abs(diff) < 0.02) {
        video.currentTime = targetTime;
        if (targetTime === 0) {
          video.pause();
        }
        return;
      }

      video.currentTime += diff * 0.15;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      playReverse();
    } else {
      playForward();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      playReverse();
    } else {
      scrubTo(0);
    }
  };

  const handleEnded = () => {
    setHasEnded(true);
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime <= 0.1) {
      setHasEnded(false);
      video.pause();
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/megaphone.mp4"
      className={className}
      muted
      playsInline
      preload="auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onEnded={handleEnded}
      onTimeUpdate={handleTimeUpdate}
      aria-hidden="true"
    />
  );
}