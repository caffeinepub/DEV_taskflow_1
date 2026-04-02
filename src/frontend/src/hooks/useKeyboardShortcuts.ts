import { useCallback, useEffect } from "react";

interface ShortcutCallbacks {
  onNew?: () => void;
  onSave?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(callbacks: ShortcutCallbacks) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isEditing = ["input", "textarea", "[contenteditable]"].some(
        (sel) => tag === sel || (e.target as HTMLElement).isContentEditable,
      );

      // Cmd/Ctrl+S — force save (always)
      if (isMod && e.key === "s") {
        e.preventDefault();
        callbacks.onSave?.();
        return;
      }

      // Cmd/Ctrl+N — new task (skip if editing)
      if (isMod && e.key === "n" && !isEditing) {
        e.preventDefault();
        callbacks.onNew?.();
        return;
      }

      // Cmd/Ctrl+D — mark complete (skip if editing)
      if (isMod && e.key === "d" && !isEditing) {
        e.preventDefault();
        callbacks.onComplete?.();
        return;
      }

      // Cmd/Ctrl+Delete or Cmd/Ctrl+Backspace — delete (skip if editing)
      if (
        isMod &&
        (e.key === "Delete" || e.key === "Backspace") &&
        !isEditing
      ) {
        e.preventDefault();
        callbacks.onDelete?.();
        return;
      }

      // Escape — cancel / deselect
      if (e.key === "Escape") {
        callbacks.onEscape?.();
      }
    },
    [callbacks],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
