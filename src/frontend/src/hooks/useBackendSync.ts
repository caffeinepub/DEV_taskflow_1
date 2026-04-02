import { useEffect, useRef, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

/**
 * Syncs initial data from the backend canister on mount.
 * Shows loading state while fetching, then hydrates the store.
 * Falls back to localStorage state if backend is unavailable.
 */
export function useBackendSync() {
  const { setProjects, setTasks, setSaveState } = useTaskStore();
  const hasSynced = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;

    // Backend interface is empty (no getData/saveAll yet from bindgen).
    // localStorage state is authoritative until backend bindings are generated.
    // When backend exposes getData(), wire it here:
    //
    // async function fetchFromBackend() {
    //   const { actor } = useActor();
    //   if (!actor) return;
    //   setIsLoading(true);
    //   setSaveState("saving");
    //   try {
    //     const { projects, tasks } = await actor.getData();
    //     setProjects(projects.map(mapProject));
    //     setTasks(tasks.map(mapTask));
    //     setSaveState("idle");
    //   } catch {
    //     setSaveState("error");
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    // fetchFromBackend();

    void setProjects;
    void setTasks;
    void setSaveState;
    void setIsLoading;
  }, [setProjects, setTasks, setSaveState]);

  return { isLoading };
}
