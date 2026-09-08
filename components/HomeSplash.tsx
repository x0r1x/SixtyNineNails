"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const EASE = "cubic-bezier(0.45, 0.05, 0.55, 0.95)";
const DURATION = "2s";
const HEADER_SIZE = 72;

const navLinks = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/mastera", label: "Мастера" },
  { href: "/zapis", label: "Запись" },
];

function splashSize() {
  if (typeof window === "undefined") return 560;
  return Math.min(window.innerWidth * 0.82, 560);
}

function splashTransform(slotLeft: number, slotTop: number, size: number) {
  const scale = splashSize() / size;
  const visual = size * scale;
  const tx = (window.innerWidth - visual) / 2 - slotLeft;
  const ty = (window.innerHeight - visual) / 2 - slotTop;
  return `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
}

export default function HomeSplash() {
  const slotRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const placeFly = useCallback((mode: "splash" | "header", instant: boolean) => {
    const slot = slotRef.current;
    const fly = flyRef.current;
    if (!slot || !fly) return;

    const rect = slot.getBoundingClientRect();
    const left = rect.left;
    const top = rect.top;
    const size = rect.width || HEADER_SIZE;

    fly.style.left = `${left}px`;
    fly.style.top = `${top}px`;
    fly.style.width = `${size}px`;
    fly.style.height = `${size}px`;

    if (instant) {
      fly.style.transition = "none";
    } else {
      fly.style.transition = `transform ${DURATION} ${EASE}`;
    }

    fly.style.transform =
      mode === "splash"
        ? splashTransform(left, top, size)
        : "translate3d(0, 0, 0) scale(1)";

    if (instant) {
      void fly.offsetWidth;
      fly.style.transition = `transform ${DURATION} ${EASE}`;
    }
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mq.matches;
    setReduceMotion(reduced);
    if (reduced) {
      setOpen(true);
      openRef.current = true;
      placeFly("header", true);
      setReady(true);
      return;
    }
    placeFly("splash", true);
    setReady(true);
  }, [placeFly]);

  useEffect(() => {
    const onResize = () => {
      placeFly(openRef.current ? "header" : "splash", true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [placeFly]);

  const goHero = useCallback(() => {
    if (openRef.current || reduceMotion) return;
    openRef.current = true;
    setOpen(true);
    placeFly("header", false);
  }, [placeFly, reduceMotion]);

  return (
    <div
      className={`sn-home relative flex flex-1 flex-col ${
        open || reduceMotion ? "is-open" : "is-splash"
      } ${ready ? "is-ready" : ""} ${reduceMotion ? "is-reduced" : ""}`}
    >
      <button
        ref={flyRef}
        type="button"
        className={`sn-fly ${open || reduceMotion ? "is-header" : "is-splash"}`}
        aria-label={
          open || reduceMotion
            ? "SixtyNineNails"
            : "SixtyNineNails — открыть главную"
        }
        onMouseEnter={goHero}
        onClick={goHero}
        onTouchStart={(e) => {
          if (openRef.current || reduceMotion) return;
          e.preventDefault();
          goHero();
        }}
      >
        <span className="sn-fly-glow" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-large.png"
          alt=""
          width={2048}
          height={2048}
          draggable={false}
          className="sn-fly-img"
        />
      </button>

      {!open && !reduceMotion && (
        <p className="sn-home-hint pointer-events-none fixed bottom-9 left-0 right-0 z-[35] text-center text-[11px] tracking-[0.2em] text-white/35">
          НАВЕДИТЕ ИЛИ НАЖМИТЕ
        </p>
      )}

      <div
        className={`sn-home-hero flex flex-1 flex-col ${
          open || reduceMotion ? "show" : ""
        }`}
        aria-hidden={!open && !reduceMotion}
      >
        <header className="relative z-20 flex w-full items-center justify-between px-6 py-6 md:px-12">
          <div
            ref={slotRef}
            className="sn-logo-slot h-[72px] w-[72px] shrink-0"
            aria-hidden
          />
          <nav className="flex items-center gap-3 text-sm font-light tracking-nav text-white md:gap-4 md:text-base">
            {navLinks.map((link, i) => (
              <span
                key={link.href}
                className="sn-home-nav-item flex items-center gap-3 md:gap-4"
                style={{ ["--sn-nav-i" as string]: String(i) }}
              >
                {i > 0 && (
                  <span className="text-[10px] text-white/70" aria-hidden>
                    •
                  </span>
                )}
                <Link
                  href={link.href}
                  className="sn-nav-link border-b border-transparent pb-0.5 text-white/90 hover:border-burgundy hover:text-white"
                  tabIndex={open || reduceMotion ? undefined : -1}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 text-center">
          <h1 className="sn-home-title text-5xl font-extralight tracking-display text-white md:text-7xl">
            Маникюр
          </h1>
          <p className="sn-home-lead mt-5 max-w-md text-sm font-light leading-relaxed text-white/90 md:text-base">
            Красота в деталях. Уверенность в каждом жесте.
          </p>
          <div className="sn-home-line mt-6 h-px w-16 bg-burgundy" />
          <Link
            href="/zapis"
            className="sn-home-cta sn-btn mt-8 border border-burgundy px-10 py-3 text-xs font-light tracking-label text-white hover:bg-burgundy/20 md:text-sm"
            tabIndex={open || reduceMotion ? undefined : -1}
          >
            ЗАПИСАТЬСЯ
          </Link>
        </section>
      </div>
    </div>
  );
}
