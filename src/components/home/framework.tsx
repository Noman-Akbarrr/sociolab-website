"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stages = [
  {
    num: "01",
    title: "Discovery & Strategy",
    summary: "We analyze your current online presence, competitors, and target audience to build a custom growth plan.",
    bullets: ["Competitor & Audience Research", "Current Presence Audit", "Custom Growth Strategy"],
  },
  {
    num: "02",
    title: "Creative & Content",
    summary: "We design and create all the assets you need — from ad creatives to social media content to your website.",
    bullets: ["Ad Creatives & Copywriting", "Social Media Content Calendar", "Website & Landing Page Design"],
  },
  {
    num: "03",
    title: "Launch & Campaigns",
    summary: "Everything goes live — ad campaigns, social media content, and your website. We monitor daily.",
    bullets: ["Meta & Google Ads Launch", "Social Media Goes Live", "Website Deployment"],
  },
  {
    num: "04",
    title: "Optimize & Scale",
    summary: "Weekly reporting, A/B testing, and scaling what works — we keep improving every month.",
    bullets: ["Weekly Performance Reports", "A/B Testing & Optimization", "Scaling Winning Campaigns"],
  },
];

function RippleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<{ x: number; y: number; radius: number; opacity: number; speed: number }[]>([]);
  const mouse = useRef({ x: 0, y: 0, moving: false });
  const lastMouse = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const lastRippleTime = useRef(0);

  const addRipple = useCallback((x: number, y: number) => {
    ripples.current.push({
      x,
      y,
      radius: 2,
      opacity: 0.35,
      speed: 1.2 + Math.random() * 0.8,
    });
    if (ripples.current.length > 40) {
      ripples.current.shift();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.current = { x, y, moving: true };

      const now = Date.now();
      if (now - lastRippleTime.current > 40) {
        addRipple(x, y);
        lastRippleTime.current = now;
      }
    }

    function handleMouseLeave() {
      mouse.current.moving = false;
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      ripples.current.forEach((r) => {
        r.radius += r.speed;
        r.opacity -= 0.004;

        if (r.opacity > 0) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 85, 0, ${r.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Inner glow ring
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 85, 0, ${r.opacity * 0.4})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      // Remove dead ripples
      ripples.current = ripples.current.filter((r) => r.opacity > 0);

      raf.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [addRipple]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.6 }}
    />
  );
}

export function Framework() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(".fw-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );

      // Horizontal scroll
      const track = trackRef.current;
      if (track) {
        const totalScroll = track.scrollWidth - window.innerWidth + 100;

        gsap.to(track, {
          x: -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#1C1917" }}>
      {/* Mouse ripple canvas */}
      <RippleCanvas />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #FF5500 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <h2 className="fw-title text-3xl md:text-4xl font-bold text-center mb-4 opacity-0" style={{ color: "#FFFFFF" }}>
            How We Work
          </h2>
          <p className="fw-title text-center max-w-2xl mx-auto text-base opacity-0" style={{ color: "#A8A29E" }}>
            A simple, proven process that gets results — no complicated frameworks, no jargon.
          </p>
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div className="overflow-hidden relative z-10">
        <div ref={trackRef} className="flex gap-6 px-6 md:px-12 will-change-transform" style={{ width: "max-content" }}>
          {stages.map((stage) => (
            <div
              key={stage.num}
              className="w-[340px] md:w-[400px] shrink-0 p-8 rounded-xl flex flex-col justify-between group transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: "rgba(41,37,36,0.8)", border: "1px solid #44403C", backdropFilter: "blur(8px)" }}
            >
              <div>
                <span className="font-mono text-5xl font-extrabold transition-colors duration-300 group-hover:text-[#FF5500]" style={{ color: "#FF5500", opacity: 0.2 }}>
                  {stage.num}
                </span>
                <h3 className="text-xl font-bold mt-4 mb-3 transition-colors duration-300 group-hover:text-[#FF5500]" style={{ color: "#FFFFFF" }}>
                  {stage.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#A8A29E" }}>
                  {stage.summary}
                </p>
              </div>
              <ul className="space-y-2">
                {stage.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-sm inline-block mt-1.5 flex-shrink-0" />
                    <span className="text-xs" style={{ color: "#D6D3D1" }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
