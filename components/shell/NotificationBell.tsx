import { Bell } from "lucide-react";

export function NotificationBell({ count }: { count: number }) {
  return (
    <button
      type="button"
      className="relative rounded-2xl border border-border bg-surface p-2.5 text-text-2 transition hover:bg-elevated hover:text-text-1"
      aria-label="Notifications"
    >
      <Bell className="h-4 w-4" />
      {count ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}
