import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Flag,
  Plus,
  RotateCcw,
  Search,
  Tag,
} from "lucide-react";
import { useRef, useState } from "react";
import { formatDueDate, isPastDue } from "../lib/dateUtils";
import { useTaskStore } from "../store/useTaskStore";
import type {
  FilterDueDate,
  FilterStatus,
  Priority,
  Task,
} from "../types/task";
import { PRIORITY_ORDER } from "../types/task";
import { ContextMenu } from "./ContextMenu";

interface TaskListProps {
  onNewTask: () => void;
}

const PRIORITY_DOT: Record<Priority, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
  none: "priority-none",
};

const DUE_DATE_FILTERS: { value: FilterDueDate | "all"; label: string }[] = [
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "no-date", label: "No Date" },
];

export function TaskList({ onNewTask }: TaskListProps) {
  const {
    selectedProjectId,
    projects,
    filters,
    setFilter,
    getFilteredTasks,
    selectedTaskId,
    setSelectedTask,
    updateTask,
    deleteTask,
    moveTask,
    markDirty,
  } = useTaskStore();

  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragTasksRef = useRef<Task[]>([]);

  const tasks = getFilteredTasks();
  const rootTasks = tasks.filter((t) => !t.parentId);
  const project = projects.find((p) => p.id === selectedProjectId);

  const title =
    selectedProjectId === "all"
      ? filters.dueDate !== "all"
        ? ({
            overdue: "Overdue",
            today: "Today",
            "this-week": "This Week",
            "no-date": "No Date",
          }[filters.dueDate as FilterDueDate] ?? "Tasks")
        : ({ all: "All Tasks", active: "Active", completed: "Completed" }[
            filters.status as FilterStatus
          ] ?? "Tasks")
      : (project?.name ?? "Tasks");

  const completedCount = rootTasks.filter((t) => t.completed).length;
  const totalCount = rootTasks.length;

  const toggleTask = (task: Task) => {
    updateTask(task.id, { completed: !task.completed });
    markDirty();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDragId(taskId);
    dragTasksRef.current = [...rootTasks];
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent, taskId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(taskId);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      setDragId(null);
      setDragOverId(null);
      return;
    }

    const items = [...dragTasksRef.current];
    const fromIdx = items.findIndex((t) => t.id === dragId);
    const toIdx = items.findIndex((t) => t.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);
    items.forEach((t, i) => updateTask(t.id, { order: i }));
    markDirty();

    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-base font-display font-semibold text-foreground">
              {title}
            </h1>
            {totalCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {completedCount} / {totalCount} completed
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={onNewTask}
            data-ocid="new-task-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            New
            <kbd className="font-mono text-[9px] opacity-60 bg-primary-foreground/20 px-1 rounded">
              ⌘N
            </kbd>
          </Button>
        </div>

        {/* Filter toolbar */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search tasks…"
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="h-7 pl-8 text-xs bg-secondary border-transparent focus:border-input"
              data-ocid="task-search"
            />
          </div>
          <Select
            value={filters.priority}
            onValueChange={(v) =>
              setFilter({ priority: v as Priority | "all" })
            }
          >
            <SelectTrigger
              className="h-7 w-28 text-xs"
              data-ocid="filter-priority"
            >
              <Flag className="w-3 h-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Due date quick filters */}
        <div className="flex items-center gap-1 flex-wrap">
          {DUE_DATE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`h-6 px-2 rounded text-[11px] transition-colors-fast ${
                filters.dueDate === value
                  ? "bg-accent/20 text-primary font-medium border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
              }`}
              onClick={() =>
                setFilter({
                  dueDate: filters.dueDate === value ? "all" : value,
                })
              }
              data-ocid={`filter-due-${value}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-4 py-2" data-ocid="task-list">
        {rootTasks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-48 text-center animate-fade-in"
            data-ocid="empty-state"
          >
            <div className="w-14 h-14 rounded-full bg-muted/40 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No tasks yet
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1 mb-3 font-mono">
              Press ⌘N to create one
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewTask}
              className="h-7 text-xs"
              data-ocid="empty-state-new-btn"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add task
            </Button>
          </div>
        ) : (
          <div className="space-y-px">
            {[...rootTasks]
              .sort(
                (a, b) =>
                  PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] ||
                  a.order - b.order,
              )
              .map((task) => (
                <ContextMenu
                  key={task.id}
                  task={task}
                  projects={projects}
                  onEdit={() => setSelectedTask(task.id)}
                  onComplete={() => {
                    updateTask(task.id, { completed: !task.completed });
                    markDirty();
                  }}
                  onMove={(projectId) => {
                    moveTask(task.id, projectId);
                    markDirty();
                  }}
                  onDelete={() => {
                    deleteTask(task.id);
                    markDirty();
                  }}
                  onChangePriority={(priority) => {
                    updateTask(task.id, { priority });
                    markDirty();
                  }}
                >
                  <TaskRow
                    task={task}
                    subtasks={tasks.filter((t) => t.parentId === task.id)}
                    isSelected={selectedTaskId === task.id}
                    isDragging={dragId === task.id}
                    isDragOver={dragOverId === task.id}
                    onSelect={() =>
                      setSelectedTask(
                        task.id === selectedTaskId ? null : task.id,
                      )
                    }
                    onToggle={() => toggleTask(task)}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={(e) => handleDragOver(e, task.id)}
                    onDrop={(e) => handleDrop(e, task.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragOverId(null);
                    }}
                  />
                </ContextMenu>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  subtasks: Task[];
  isSelected: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function TaskRow({
  task,
  subtasks,
  isSelected,
  isDragging,
  isDragOver,
  onSelect,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TaskRowProps) {
  const [expanded, setExpanded] = useState(false);
  const overdue = !task.completed && isPastDue(task.dueDate);
  const hasSubtasks = subtasks.length > 0;

  return (
    <div>
      <button
        type="button"
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={`
          group w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-left
          transition-colors-fast border
          ${
            isSelected
              ? "bg-accent/15 border-primary/30"
              : isDragOver
                ? "bg-secondary border-primary/40"
                : "bg-card hover:bg-secondary border-transparent hover:border-border"
          }
          ${isDragging ? "opacity-40" : ""}
          ${task.completed ? "opacity-60" : ""}
        `}
        onClick={onSelect}
        data-ocid={`task-row-${task.id}`}
      >
        {/* Drag handle hint */}
        <span className="w-1 h-5 flex flex-col justify-center gap-0.5 opacity-0 group-hover:opacity-40 shrink-0">
          <span className="w-1 h-px bg-muted-foreground rounded" />
          <span className="w-1 h-px bg-muted-foreground rounded" />
          <span className="w-1 h-px bg-muted-foreground rounded" />
        </span>

        {/* Checkbox */}
        <button
          type="button"
          className={`shrink-0 transition-colors-fast ${
            task.completed
              ? "text-primary"
              : "text-muted-foreground/40 hover:text-primary"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          data-ocid={`task-check-${task.id}`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </button>

        {/* Priority dot */}
        <span
          className={`shrink-0 w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`}
          style={{ backgroundColor: "currentColor" }}
          aria-label={`Priority: ${task.priority}`}
        />

        {/* Title */}
        <span
          className={`flex-1 min-w-0 text-sm truncate-1 ${
            task.completed
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {task.title}
        </span>

        {/* Tags */}
        {task.tags.slice(0, 2).map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="h-4 px-1.5 text-[10px] font-mono shrink-0 hidden sm:flex"
          >
            <Tag className="w-2 h-2 mr-0.5" />
            {tag}
          </Badge>
        ))}

        {/* Recurring icon */}
        {task.recurringFrequency !== "none" && (
          <RotateCcw
            className="w-3 h-3 text-muted-foreground shrink-0"
            aria-label="Recurring"
          />
        )}

        {/* Due date */}
        {task.dueDate && (
          <span
            className={`text-[11px] font-mono shrink-0 flex items-center gap-0.5 ${
              overdue ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            <Calendar className="w-2.5 h-2.5" />
            {formatDueDate(task.dueDate)}
          </span>
        )}

        {/* Subtask expand */}
        {hasSubtasks && (
          <button
            type="button"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors-fast"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            aria-label={expanded ? "Collapse subtasks" : "Expand subtasks"}
          >
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </button>

      {/* Subtasks */}
      {hasSubtasks && expanded && (
        <div className="ml-8 mt-px space-y-px animate-slide-up">
          {subtasks.map((sub) => (
            <button
              type="button"
              key={sub.id}
              className={`
                w-full flex items-center gap-2 px-2 py-1 rounded text-xs text-left
                border border-transparent
                ${sub.completed ? "opacity-50" : "hover:bg-secondary hover:border-border"}
                transition-colors-fast
              `}
              onClick={() => {
                useTaskStore.getState().setSelectedTask(sub.id);
              }}
              data-ocid={`subtask-row-${sub.id}`}
            >
              <Circle className="w-3 h-3 text-muted-foreground/40 shrink-0" />
              <span
                className={`flex-1 min-w-0 truncate-1 ${sub.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {sub.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
