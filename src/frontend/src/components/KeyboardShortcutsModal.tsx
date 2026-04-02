import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

interface Shortcut {
  keys: string[];
  description: string;
}

const SECTIONS: { title: string; shortcuts: Shortcut[] }[] = [
  {
    title: "Tasks",
    shortcuts: [
      { keys: ["⌘", "N"], description: "New task" },
      { keys: ["⌘", "D"], description: "Mark task complete" },
      { keys: ["⌘", "⌫"], description: "Delete selected task" },
      { keys: ["Enter"], description: "Open task detail" },
      { keys: ["Escape"], description: "Deselect / close panel" },
    ],
  },
  {
    title: "Data",
    shortcuts: [{ keys: ["⌘", "S"], description: "Force save now" }],
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["↑", "↓"], description: "Move between tasks" },
      { keys: ["?"], description: "Show this cheat sheet" },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

function KbdKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.6rem] h-6 px-1.5 rounded bg-secondary border border-border text-[11px] font-mono text-foreground shadow-sm">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsModal({
  open,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg bg-card border-border shadow-elevated"
        data-ocid="shortcuts-modal"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-sm font-semibold text-foreground">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 mt-1">
          {SECTIONS.map((section, si) => (
            <div key={section.title} className={si === 1 ? "col-start-1" : ""}>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-3 mb-2">
                {section.title}
              </p>
              <div className="space-y-1.5">
                {section.shortcuts.map((s) => (
                  <div
                    key={s.description}
                    className="flex items-center justify-between gap-4"
                    data-ocid={`shortcut-${s.description.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="text-xs text-muted-foreground">
                      {s.description}
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {s.keys.map((k, i) => (
                        <span key={k} className="flex items-center gap-0.5">
                          <KbdKey>{k}</KbdKey>
                          {i < s.keys.length - 1 && (
                            <span className="text-muted-foreground/40 text-[10px] mx-0.5">
                              +
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="mt-4" />
        <p className="text-[10px] text-muted-foreground text-center mt-1">
          Press <KbdKey>?</KbdKey> anywhere to toggle this panel
        </p>
      </DialogContent>
    </Dialog>
  );
}

/** Hook: press '?' outside inputs to toggle shortcut modal */
export function useShortcutsModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isEditing =
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement).isContentEditable;
      if (e.key === "?" && !isEditing) {
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return { open, setOpen };
}
