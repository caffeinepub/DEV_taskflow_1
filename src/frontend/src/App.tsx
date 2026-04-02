import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import {
  KeyboardShortcutsModal,
  useShortcutsModal,
} from "./components/KeyboardShortcutsModal";
import { Layout } from "./components/Layout";
import { NewTaskModal } from "./components/NewTaskModal";
import { Sidebar } from "./components/Sidebar";
import { TaskDetail } from "./components/TaskDetail";
import { TaskList } from "./components/TaskList";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAutoSave } from "./hooks/useAutoSave";
import { useBackendSync } from "./hooks/useBackendSync";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useTaskStore } from "./store/useTaskStore";

function LoadingSkeleton() {
  return (
    <div className="flex h-full">
      {/* Sidebar skeleton */}
      <div className="w-52 shrink-0 border-r border-border px-3 py-4 space-y-2">
        {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
          <Skeleton key={k} className="h-6 w-full rounded" />
        ))}
        <div className="pt-2 space-y-1.5">
          {["p1", "p2", "p3"].map((k) => (
            <Skeleton key={k} className="h-5 w-3/4 rounded" />
          ))}
        </div>
      </div>
      {/* Main skeleton */}
      <div className="flex-1 px-6 py-5 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-7 w-20 rounded" />
        </div>
        <Skeleton className="h-7 w-full rounded" />
        {["t1", "t2", "t3", "t4", "t5"].map((k) => (
          <Skeleton key={k} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

function AppInner() {
  const {
    selectedTaskId,
    setSelectedTask,
    updateTask,
    deleteTask,
    markDirty,
    tasks,
    projects,
    selectedProjectId,
    addTask,
  } = useTaskStore();

  const { triggerSave } = useAutoSave();
  const { isLoading } = useBackendSync();
  const { open: shortcutsOpen, setOpen: setShortcutsOpen } =
    useShortcutsModal();

  const [showNewTask, setShowNewTask] = useState(false);

  const handleComplete = useCallback(() => {
    if (!selectedTaskId) return;
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;
    updateTask(selectedTaskId, { completed: !task.completed });
    markDirty();
  }, [selectedTaskId, tasks, updateTask, markDirty]);

  const handleDelete = useCallback(() => {
    if (!selectedTaskId) return;
    deleteTask(selectedTaskId);
    markDirty();
  }, [selectedTaskId, deleteTask, markDirty]);

  useKeyboardShortcuts({
    onNew: () => setShowNewTask(true),
    onSave: () => triggerSave(),
    onComplete: handleComplete,
    onDelete: handleDelete,
    onEscape: () => {
      setSelectedTask(null);
      setShowNewTask(false);
    },
  });

  const selectedTask = selectedTaskId
    ? (tasks.find((t) => t.id === selectedTaskId) ?? null)
    : null;

  if (isLoading) {
    return <Layout sidebar={<div />} main={<LoadingSkeleton />} />;
  }

  return (
    <>
      <Layout
        sidebar={<Sidebar />}
        main={
          <div className="flex h-full min-h-0">
            <div
              className={`flex-1 min-w-0 transition-all duration-300 ${
                selectedTask ? "border-r border-border" : ""
              }`}
            >
              <TaskList onNewTask={() => setShowNewTask(true)} />
            </div>
            {selectedTask && (
              <div className="w-80 shrink-0 overflow-y-auto bg-card animate-slide-up">
                <TaskDetail
                  task={selectedTask}
                  projects={projects}
                  allTasks={tasks}
                  onUpdate={(updates) => {
                    updateTask(selectedTask.id, updates);
                    markDirty();
                  }}
                  onClose={() => setSelectedTask(null)}
                />
              </div>
            )}
          </div>
        }
      />
      <NewTaskModal
        open={showNewTask}
        onClose={() => setShowNewTask(false)}
        projectId={selectedProjectId}
        nextOrder={
          tasks.filter((t) => t.projectId === selectedProjectId && !t.parentId)
            .length
        }
        onCreated={(task) => {
          addTask(task);
          markDirty();
          setShowNewTask(false);
        }}
      />
      <KeyboardShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
      <Toaster />
    </ThemeProvider>
  );
}
