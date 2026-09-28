"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { FollowerPointerCard } from "./following-pointer";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface FocusCardProps {
  card: {
    title: string;
    src: string;
    description?: string;
    metrics?: { label: string; value: string }[];
  };
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}

export const FocusCard = React.memo(({ card, index, hovered, setHovered }: FocusCardProps) => (
  <FollowerPointerCard title={card.title}>
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-2xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-64 md:h-80 w-full transition-all duration-500 ease-out",
        hovered !== null && hovered !== index && "blur-md scale-[0.96] opacity-60 grayscale"
      )}
      style={{ zIndex: hovered === index ? 10 : 0 }}
    >
      <img
        src={card.src}
        alt={card.title}
        className="object-cover absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
      
      {/* Content container - handles the animation */}
      <div className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-500 ease-out">
        {/* Brand name - moves up on hover */}
        <motion.h3
          className="text-base md:text-lg font-bold text-white/100 drop-shadow-xl"
          initial={false}
          animate={{
            y: hovered === index ? -80 : 0,
            opacity: hovered === index ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {card.title}
        </motion.h3>

        {/* Hover content - description + metrics - slides up from bottom */}
        <motion.div
          initial={false}
          animate={{
            y: hovered === index ? 0 : 60,
            opacity: hovered === index ? 1 : 0,
          }}
          transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 px-5"
        >
          <h3 className="text-base md:text-lg font-bold text-white/100 mb-3 drop-shadow-xl">
            {card.title}
          </h3>
          {card.description && (
            <motion.p
              initial={false}
              animate={{
                y: hovered === index ? 0 : 10,
                opacity: hovered === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm text-white/90 mb-4 line-clamp-3"
            >
              {card.description}
            </motion.p>
          )}
          {card.metrics && card.metrics.length > 0 && (
            <motion.div
              initial={false}
              animate={{
                y: hovered === index ? 0 : 10,
                opacity: hovered === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-3 text-xs"
            >
              {card.metrics.slice(0, 2).map((m, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
                  <span className="font-semibold text-white">{m.value}</span>
                  <span className="text-white/70">{m.label}</span>
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  </FollowerPointerCard>
));

FocusCard.displayName = "FocusCard";

export function FocusCards({ 
  cards, 
  className = "",
  columns = 3
}: { 
  cards: Array<{
    title: string;
    src: string;
    description?: string;
    metrics?: { label: string; value: string }[];
  }>;
  className?: string;
  columns?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div 
      className={cn(
        "grid gap-6",
        `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
        className
      )}
      onMouseLeave={() => setHovered(null)}
    >
      {cards.map((card, index) => (
        <FocusCard
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}