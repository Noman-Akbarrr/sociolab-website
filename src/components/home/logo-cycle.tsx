"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const logos = [
  { name: "Facebook", src: "/logos/Facebook.png" },
  { name: "Instagram", src: "/logos/Instagram.png" },
  { name: "LinkedIn", src: "/logos/LinkedIn.png" },
  { name: "Pinterest", src: "/logos/Pinterest.png" },
  { name: "Reddit", src: "/logos/reddit.png" },
  { name: "Thread", src: "/logos/Thread.png" },
  { name: "TikTok", src: "/logos/Tiktok.png" },
  { name: "YouTube", src: "/logos/Youtube.png" },
  { name: "X (Twitter)", src: "/logos/Twitter.png" },
];

export function LogoCycle({ className = "", size = "1.1em" }: { className?: string; size?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % logos.length);
        setIsAnimating(false);
      }, 300);
    }, 2000);

    intervalRef.current = interval;
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className={className} style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, filter: "blur(10px)", scale: 0.8 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
        >
          <img
            src={logos[currentIndex].src}
            alt={logos[currentIndex].name}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}