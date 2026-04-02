import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAutoSave } from "../hooks/useAutoSave";
import { useTaskStore } from "../store/useTaskStore";
import type { SaveState } from "../types/task";

const CONFIG: Record<
  SaveState,
  { icon: React.ReactNode; label: string; className: string }
> = {
  idle: { icon: null, label: "", className: "opacity-0 pointer-events-none" },
  dirty: {
    icon: <Clock className="w-3 h-3 animate-pulse" />,
    label: "Auto-saving…",
    className: "text-muted-foreground",
  },
  saving: {
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    label: "Saving…",
    className: "text-muted-foreground",
  },
  saved: {
    icon: <CheckCircle2 className="w-3 h-3" />,
    label: "Saved",
    className: "text-primary",
  },
  error: {
    icon: <AlertCircle className="w-3 h-3" />,
    label: "Save failed",
    className: "text-destructive",
  },
};

export function SaveIndicator() {
  const saveState = useTaskStore((s) => s.saveState);
  const { retrySave } = useAutoSave();
  const { icon, label, className } = CONFIG[saveState];

  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-mono transition-smooth ${className}`}
      data-ocid="save-indicator"
      aria-live="polite"
      aria-label={`Save status: ${label}`}
    >
      {icon}
      <span>{label}</span>
      {saveState === "error" && (
        <button
          type="button"
          onClick={retrySave}
          className="flex items-center gap-1 text-destructive hover:text-foreground transition-colors-fast underline underline-offset-2"
          aria-label="Retry save"
          data-ocid="save-retry-btn"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          Retry
        </button>
      )}
    </span>
  );
}
