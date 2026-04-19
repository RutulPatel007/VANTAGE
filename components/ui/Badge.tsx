import { cn } from "@/lib/utils";

const tones = {
  default: "border-border bg-elevated text-text-2",
  accent: "border-accent/25 bg-accent/10 text-accent",
  signal: "border-signal/25 bg-signal/10 text-signal",
  pending: "border-pending/25 bg-pending/10 text-pending",
  approved: "border-approved/25 bg-approved/10 text-approved",
  rejected: "border-rejected/25 bg-rejected/10 text-rejected",
};

export function Badge({
  className,
  tone = "default",
  children,
}: {
  className?: string;
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
