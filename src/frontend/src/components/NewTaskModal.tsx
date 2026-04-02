import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { fromDateInputValue } from "../lib/dateUtils";
import { useTaskStore } from "../store/useTaskStore";
import type { Priority, Task } from "../types/task";
import { PRIORITY_LABELS } from "../types/task";

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  nextOrder: number;
  onCreated: (task: Task) => void;
}

const DEFAULT_STATE = {
  title: "",
  description: "",
  dueDate: "",
  priority: "none" as Priority,
};

export function NewTaskModal({
  open,
  onClose,
  projectId,
  nextOrder,
  onCreated,
}: NewTaskModalProps) {
  const { projects } = useTaskStore();
  const [form, setForm] = useState(DEFAULT_STATE);
  const [targetProjectId, setTargetProjectId] = useState(projectId);

  const reset = () => {
    setForm(DEFAULT_STATE);
    setTargetProjectId(projectId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      projectId: targetProjectId,
      parentId: null,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: fromDateInputValue(form.dueDate),
      priority: form.priority,
      completed: false,
      order: nextOrder,
      tags: [],
      recurringFrequency: "none",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    onCreated(task);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent
        className="max-w-md bg-card border-border"
        data-ocid="new-task-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-display font-semibold">
            New Task
            <span className="ml-2 font-mono text-[10px] text-muted-foreground font-normal">
              ⌘N
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="task-title"
              className="text-xs text-muted-foreground"
            >
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              autoFocus
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="What needs to be done?"
              className="h-8 text-sm"
              data-ocid="new-task-title"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="task-desc"
              className="text-xs text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="task-desc"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Optional details…"
              className="resize-none text-sm min-h-16"
              rows={2}
              data-ocid="new-task-description"
            />
          </div>

          {/* Row: priority + due date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="task-priority"
                className="text-xs text-muted-foreground"
              >
                Priority
              </Label>
              <Select
                value={form.priority}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, priority: v as Priority }))
                }
              >
                <SelectTrigger
                  id="task-priority"
                  className="h-8 text-xs"
                  data-ocid="new-task-priority"
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
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="task-duedate"
                className="text-xs text-muted-foreground"
              >
                Due date
              </Label>
              <Input
                id="task-duedate"
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                className="h-8 text-xs"
                data-ocid="new-task-duedate"
              />
            </div>
          </div>

          {/* Project */}
          <div className="space-y-1.5">
            <Label
              htmlFor="task-project"
              className="text-xs text-muted-foreground"
            >
              Project
            </Label>
            <Select value={targetProjectId} onValueChange={setTargetProjectId}>
              <SelectTrigger
                id="task-project"
                className="h-8 text-xs"
                data-ocid="new-task-project"
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
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              data-ocid="new-task-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!form.title.trim()}
              data-ocid="new-task-submit"
            >
              Create task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
