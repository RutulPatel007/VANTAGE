import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div className="space-y-2">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-text-3">{eyebrow}</p> : null}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-text-1">{title}</h2>
          {description ? <p className="max-w-2xl text-sm text-text-2">{description}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
}
