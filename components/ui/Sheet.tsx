"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  width = "w-[480px]",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            initial={{ x: 520, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 520, opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={cn(
              "fixed right-0 top-0 z-50 flex h-screen max-w-[92vw] flex-col border-l border-border bg-overlay/96 shadow-2xl backdrop-blur-xl",
              width,
            )}
          >
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-text-1">{title}</h3>
                {description ? <p className="text-sm text-text-2">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border p-2 text-text-2 transition hover:bg-elevated hover:text-text-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
