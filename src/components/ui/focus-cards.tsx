"use client";

import React, { useState } from "react";
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-6 transition-all duration-300",
          hovered === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-white/80 mb-3 line-clamp-2">{card.description}</p>
        )}
        {card.metrics && (
          <div className="flex flex-wrap gap-4 text-xs">
            {card.metrics.map((m, i) => (
              <span key={i} className="flex items-center gap-1 bg-white/10 backdrop-blur px-2 py-1 rounded">
                <span className="font-semibold text-white">{m.value}</span>
                <span className="text-white/60">{m.label}</span>
              </span>
            ))}
          </div>
        )}
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