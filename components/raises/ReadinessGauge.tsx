"use client";

import { motion } from "framer-motion";

const arc = (radius: number, startAngle: number, endAngle: number) => {
  const start = polar(radius, startAngle);
  const end = polar(radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const polar = (radius: number, angle: number) => {
  const radians = ((angle - 180) * Math.PI) / 180;
  return {
    x: 120 + radius * Math.cos(radians),
    y: 120 + radius * Math.sin(radians),
  };
};

export function ReadinessGauge({
  score,
  factors,
}: {
  score: number;
  factors: Array<{ label: string; score: number }>;
}) {
  const pct = Math.max(Math.min(score, 100), 0) / 100;
  const color = score < 40 ? "rgb(239,68,68)" : score < 70 ? "rgb(245,158,11)" : "rgb(16,185,129)";
  const path = arc(82, 0, 180);
  const pathLength = 257.6;

  return (
    <div className="surface-card p-6">
      <svg viewBox="0 0 240 160" className="mx-auto w-full max-w-[320px]">
        <path d={path} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: pct }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ pathLength: pct, strokeDasharray: pathLength }}
        />
        <text x="120" y="105" textAnchor="middle" className="fill-text-1 font-mono text-[32px] font-semibold">
          {score}
        </text>
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {factors.map((factor) => (
          <div key={factor.label} className="rounded-2xl border border-border bg-base/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-text-3">{factor.label}</p>
            <p className="mt-1 font-mono text-lg text-text-1">{factor.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
