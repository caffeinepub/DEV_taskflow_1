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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Flag,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  formatFullDate,
  fromDateInputValue,
  toDateInputValue,
} from "../lib/dateUtils";
import { useTaskStore } from "../store/useTaskStore";
import type {
  Priority,
  Project,
  RecurringFrequency,
  Task,
} from "../types/task";
import { PRIORITY_LABELS, RECURRING_LABELS } from "../types/task";
import { TagInput } from "./TagInput";

interface TaskDetailProps {
  task: Task;
  projects: Project[];
  allTasks: Task[];
  onUpdate: (updates: Partial<Task>) => void;
  onClose: () => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
  none: "text-muted-foreground",
};

function MetaRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground w-20 shrink-0">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function TaskDetail({
  task,
  projects,
  allTasks,
  onUpdate,
  onClose,
}: TaskDetailProps) {
  const { addTask, markDirty, deleteTask, tasks } = useTaskStore();
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  const subtasks = allTasks.filter((t) => t.parentId === task.id);
  const project = projects.find((p) => p.id === task.projectId);

  // Collect all unique tags in the store for autocomplete
  const allTags = [...new Set(tasks.flatMap((t) => t.tags))];

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const subtask: Task = {
      id: `task-${Date.now()}`,
      projectId: task.projectId,
      parentId: task.id,
      title: newSubtask.trim(),
      description: "",
      dueDate: null,
      priority: "none",
      completed: false,
      order: subtasks.length,
      tags: [],
      recurringFrequency: "none",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addTask(subtask);
    markDirty();
    setNewSubtask("");
    setAddingSubtask(false);
  };

  const toggleSubtask = (sub: Task) => {
    const { updateTask } = useTaskStore.getState();
    updateTask(sub.id, { completed: !sub.completed });
    markDirty();
  };

  const deleteSubtask = (subId: string) => {
    const { deleteTask: del } = useTaskStore.getState();
    del(subId);
    markDirty();
  };

  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  return (
    <div className="flex flex-col h-full" data-ocid="task-detail">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="text-xs text-muted-foreground font-mono truncate-1">
          {project?.name}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
          onClick={onClose}
          aria-label="Close detail"
          data-ocid="task-detail-close"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Title — click-to-edit */}
        <Input
          value={task.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="border-transparent bg-transparent px-0 text-base font-display font-semibold focus:border-input focus:bg-secondary"
          placeholder="Task title"
          data-ocid="task-title-input"
        />

        {/* Description */}
        <Textarea
          value={task.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Add description…"
          className="resize-none min-h-16 text-sm bg-transparent border-transparent focus:border-input focus:bg-secondary"
          rows={3}
          data-ocid="task-description-input"
        />

        <Separator />

        {/* Meta fields */}
        <div className="space-y-2.5">
          <MetaRow
            icon={
              <Flag
                className={`w-3.5 h-3.5 ${PRIORITY_COLORS[task.priority]}`}
              />
            }
            label="Priority"
          >
            <Select
              value={task.priority}
              onValueChange={(v) => onUpdate({ priority: v as Priority })}
            >
              <SelectTrigger
                className="h-7 text-xs bg-secondary border-transparent"
                data-ocid="task-priority-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                  <SelectItem key={p} value={p} className="text-xs">
                    {PRIORITY_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </MetaRow>

          <MetaRow icon={<Calendar className="w-3.5 h-3.5" />} label="Due date">
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={toDateInputValue(task.dueDate)}
                onChange={(e) =>
                  onUpdate({ dueDate: fromDateInputValue(e.target.value) })
                }
                className="h-7 text-xs bg-secondary border-transparent flex-1"
                data-ocid="task-duedate-input"
              />
              {task.dueDate && (
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatFullDate(task.dueDate)}
                </span>
              )}
            </div>
          </MetaRow>

          <MetaRow
            icon={<ChevronDown className="w-3.5 h-3.5" />}
            label="Project"
          >
            <Select
              value={task.projectId}
              onValueChange={(v) => onUpdate({ projectId: v })}
            >
              <SelectTrigger
                className="h-7 text-xs bg-secondary border-transparent"
                data-ocid="task-project-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </MetaRow>

          <MetaRow icon={<RotateCcw className="w-3.5 h-3.5" />} label="Repeats">
            <Select
              value={task.recurringFrequency}
              onValueChange={(v) =>
                onUpdate({ recurringFrequency: v as RecurringFrequency })
              }
            >
              <SelectTrigger
                className="h-7 text-xs bg-secondary border-transparent"
                data-ocid="task-recurring-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(RECURRING_LABELS) as RecurringFrequency[]).map(
                  (f) => (
                    <SelectItem key={f} value={f} className="text-xs">
                      {RECURRING_LABELS[f]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </MetaRow>
        </div>

        <Separator />

        {/* Tags — with autocomplete */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider text-[10px]">
            Tags
          </p>
          <TagInput
            tags={task.tags}
            allTags={allTags}
            onChange={(tags) => onUpdate({ tags })}
          />
        </div>

        <Separator />

        {/* Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              Subtasks
              {subtasks.length > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1.5 text-[10px] font-mono"
                >
                  {completedSubtasks}/{subtasks.length}
                </Badge>
              )}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground"
              onClick={() => setAddingSubtask(true)}
              aria-label="Add subtask"
              data-ocid="add-subtask-btn"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="space-y-px">
            {subtasks.map((sub) => (
              <div
                key={sub.id}
                className="group flex items-center gap-2 px-1 py-0.5 rounded hover:bg-secondary transition-colors-fast"
                data-ocid={`subtask-item-${sub.id}`}
              >
                <button
                  type="button"
                  onClick={() => toggleSubtask(sub)}
                  className={`shrink-0 transition-colors-fast ${
                    sub.completed
                      ? "text-primary"
                      : "text-muted-foreground/40 hover:text-primary"
                  }`}
                  aria-label={
                    sub.completed ? "Mark incomplete" : "Mark complete"
                  }
                >
                  {sub.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                </button>
                <span
                  className={`text-xs flex-1 min-w-0 truncate-1 ${sub.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {sub.title}
                </span>
                <button
                  type="button"
                  onClick={() => deleteSubtask(sub.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-colors-fast"
                  aria-label="Delete subtask"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {addingSubtask && (
              <div className="flex items-center gap-1.5 mt-1">
                <Input
                  autoFocus
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSubtask();
                    if (e.key === "Escape") {
                      setAddingSubtask(false);
                      setNewSubtask("");
                    }
                  }}
                  onBlur={() => {
                    if (!newSubtask.trim()) setAddingSubtask(false);
                  }}
                  placeholder="Subtask title…"
                  className="h-6 text-xs bg-secondary border-transparent flex-1"
                  data-ocid="subtask-input"
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Metadata footer */}
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Metadata
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 shrink-0" />
            <span>Created {formatFullDate(task.createdAt)}</span>
          </div>
          {task.updatedAt !== task.createdAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3 shrink-0 opacity-0" />
              <span>Updated {formatFullDate(task.updatedAt)}</span>
            </div>
          )}
          {subtasks.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>
                {completedSubtasks} of {subtasks.length} subtasks complete
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-border shrink-0 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onUpdate({ completed: !task.completed })}
          data-ocid="task-complete-btn"
        >
          {task.completed ? (
            <>
              <Circle className="w-3.5 h-3.5 mr-1.5" />
              Mark active
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Complete
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => {
            deleteTask(task.id);
            markDirty();
            onClose();
          }}
          aria-label="Delete task"
          data-ocid="task-delete-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
