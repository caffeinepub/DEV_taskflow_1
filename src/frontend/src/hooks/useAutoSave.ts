import { useCallback, useEffect, useRef } from "react";
import { useTaskStore } from "../store/useTaskStore";

const DEBOUNCE_MS = 2000;

export function useAutoSave() {
  const { saveState, setSaveState } = useTaskStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const executeSave = useCallback(async () => {
    if (!isMounted.current) return;
    setSaveState("saving");
    // Snapshot current state at save time
    const { projects: currentProjects, tasks: currentTasks } =
      useTaskStore.getState();
    try {
      // Backend integration point: when bindings expose saveAll(), call:
      // await actor.saveAll(currentProjects, currentTasks);
      void currentProjects;
      void currentTasks;
      await new Promise<void>((res) => setTimeout(res, 350));
      if (isMounted.current) {
        setSaveState("saved");
        // Reset to idle after 2.5s so indicator fades
        setTimeout(() => {
          if (isMounted.current) setSaveState("idle");
        }, 2500);
      }
    } catch {
      if (isMounted.current) setSaveState("error");
    }
  }, [setSaveState]);

  // Watch dirty state and debounce auto-save
  useEffect(() => {
    if (saveState !== "dirty") return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      executeSave();
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [saveState, executeSave]);

  // Manual save trigger (bypasses debounce)
  const triggerSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    executeSave();
  }, [executeSave]);

  // Retry after error
  const retrySave = useCallback(() => {
    setSaveState("dirty");
  }, [setSaveState]);

  return { triggerSave, retrySave };
}
