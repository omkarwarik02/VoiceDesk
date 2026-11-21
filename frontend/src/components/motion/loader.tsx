// Bars loader, trimmed from beui.dev/components/motion/loader

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export interface LoaderProps {
  /** Bar height in px. Everything scales from this. */
  size?: number;
  /** Seconds per animation cycle. */
  speed?: number;
  /** Accessible label announced to screen readers. */
  label?: string;
  className?: string;
}

export function Loader({
  size = 32,
  speed = 1,
  label = "Loading",
  className,
}: LoaderProps) {
  const reduce = useReducedMotion() ?? false;
  const bar = size * 0.16;

  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <span className="flex items-center" style={{ gap: size * 0.1, height: size }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="rounded-full bg-current"
            style={{ width: bar, height: size, originY: 1 }}
            animate={reduce ? { opacity: [0.4, 1, 0.4] } : { scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: speed,
              ease: EASE_IN_OUT,
              repeat: Infinity,
              delay: i * speed * 0.12,
            }}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
