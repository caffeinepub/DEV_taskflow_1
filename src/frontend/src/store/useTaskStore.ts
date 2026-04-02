import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Project,
  ProjectId,
  SaveState,
  Task,
  TaskFilters,
  TaskId,
} from "../types/task";
import { DEFAULT_PROJECT_ID, SEED_PROJECTS, SEED_TASKS } from "../types/task";

interface TaskStore {
  // Data
  projects: Project[];
  tasks: Task[];

  // UI State
  selectedProjectId: ProjectId;
  filters: TaskFilters;
  theme: "dark" | "light";
  saveState: SaveState;
  sidebarOpen: boolean;
  selectedTaskId: TaskId | null;

  // Actions — Data
  setProjects: (projects: Project[]) => void;
  setTasks: (tasks: Task[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: ProjectId, updates: Partial<Project>) => void;
  deleteProject: (id: ProjectId) => void;
  addTask: (task: Task) => void;
  updateTask: (id: TaskId, updates: Partial<Task>) => void;
  deleteTask: (id: TaskId) => void;
  reorderTasks: (taskIds: TaskId[]) => void;
  moveTask: (taskId: TaskId, toProjectId: ProjectId) => void;

  // Actions — UI
  setSelectedProject: (id: ProjectId) => void;
  setFilter: (filter: Partial<TaskFilters>) => void;
  setTheme: (theme: "dark" | "light") => void;
  setSaveState: (state: SaveState) => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedTask: (id: TaskId | null) => void;
  markDirty: () => void;
  markSaved: () => void;

  // Derived helpers (not persisted)
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      projects: SEED_PROJECTS,
      tasks: SEED_TASKS,
      selectedProjectId: DEFAULT_PROJECT_ID,
      filters: {
        status: "all",
        priority: "all",
        dueDate: "all",
        search: "",
      },
      theme: "dark",
      saveState: "idle",
      sidebarOpen: true,
      selectedTaskId: null,

      setProjects: (projects) => set({ projects }),
      setTasks: (tasks) => set({ tasks }),

      addProject: (project) =>
        set((s) => ({ projects: [...s.projects, project] })),

      updateProject: (id, updates) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      deleteProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          tasks: s.tasks.filter((t) => t.projectId !== id),
          selectedProjectId:
            s.selectedProjectId === id
              ? DEFAULT_PROJECT_ID
              : s.selectedProjectId,
        })),

      addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),

      updateTask: (id, updates) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t,
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id && t.parentId !== id),
          selectedTaskId: s.selectedTaskId === id ? null : s.selectedTaskId,
        })),

      reorderTasks: (taskIds) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            const idx = taskIds.indexOf(t.id);
            return idx !== -1 ? { ...t, order: idx } : t;
          }),
        })),

      moveTask: (taskId, toProjectId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, projectId: toProjectId, updatedAt: Date.now() }
              : t,
          ),
        })),

      setSelectedProject: (id) =>
        set({ selectedProjectId: id, selectedTaskId: null }),

      setFilter: (filter) =>
        set((s) => ({ filters: { ...s.filters, ...filter } })),

      setTheme: (theme) => set({ theme }),

      setSaveState: (saveState) => set({ saveState }),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),

      markDirty: () => set({ saveState: "dirty" }),

      markSaved: () => set({ saveState: "saved" }),

      getFilteredTasks: () => {
        const { tasks, selectedProjectId, filters } = get();
        const now = Date.now();
        const dayMs = 86400000;

        let result = tasks.filter((t) => {
          if (selectedProjectId !== "all") {
            if (t.projectId !== selectedProjectId) return false;
          }
          return true;
        });

        if (filters.status !== "all") {
          result = result.filter((t) =>
            filters.status === "active" ? !t.completed : t.completed,
          );
        }

        if (filters.priority !== "all") {
          result = result.filter((t) => t.priority === filters.priority);
        }

        if (filters.dueDate !== "all") {
          result = result.filter((t) => {
            if (filters.dueDate === "no-date") return t.dueDate === null;
            if (!t.dueDate) return false;
            const d = t.dueDate;
            if (filters.dueDate === "overdue") return d < now;
            if (filters.dueDate === "today") return d >= now && d < now + dayMs;
            if (filters.dueDate === "this-week")
              return d >= now && d < now + dayMs * 7;
            return true;
          });
        }

        if (filters.search.trim()) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (t) =>
              t.title.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q) ||
              t.tags.some((tag) => tag.toLowerCase().includes(q)),
          );
        }

        return result.sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: "task-manager-store",
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        selectedProjectId: state.selectedProjectId,
        filters: state.filters,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
