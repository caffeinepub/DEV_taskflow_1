import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  Circle,
  Flag,
  FolderInput,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Priority, Project, Task } from "../types/task";
import { PRIORITY_LABELS } from "../types/task";

interface ContextMenuProps {
  task: Task;
  projects: Project[];
  children: React.ReactNode;
  onEdit: () => void;
  onComplete: () => void;
  onMove: (projectId: string) => void;
  onDelete: () => void;
  onChangePriority: (priority: Priority) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
  none: "text-muted-foreground",
};

export function ContextMenu({
  task,
  projects,
  children,
  onEdit,
  onComplete,
  onMove,
  onDelete,
  onChangePriority,
}: ContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onContextMenu={(e) => {
          e.preventDefault();
          // Trigger the dropdown at the right-click position
          (e.currentTarget as HTMLElement).click();
        }}
      >
        <div data-ocid={`context-trigger-${task.id}`}>{children}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48"
        align="start"
        data-ocid={`context-menu-${task.id}`}
      >
        <DropdownMenuItem onClick={onEdit} data-ocid={`ctx-edit-${task.id}`}>
          <Pencil className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onComplete}
          data-ocid={`ctx-complete-${task.id}`}
        >
          {task.completed ? (
            <>
              <Circle className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              Mark active
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-primary" />
              Mark complete
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Priority submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger data-ocid={`ctx-priority-${task.id}`}>
            <Flag
              className={`w-3.5 h-3.5 mr-2 ${PRIORITY_COLORS[task.priority]}`}
            />
            Priority
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-32">
            {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
              <DropdownMenuItem
                key={p}
                onClick={() => onChangePriority(p)}
                className={task.priority === p ? "bg-accent/20" : ""}
                data-ocid={`ctx-priority-${p}-${task.id}`}
              >
                <Flag className={`w-3 h-3 mr-2 ${PRIORITY_COLORS[p]}`} />
                {PRIORITY_LABELS[p]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Move to project submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger data-ocid={`ctx-move-${task.id}`}>
            <FolderInput className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            Move to
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-40">
            {projects
              .filter((p) => p.id !== task.projectId)
              .map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() => onMove(p.id)}
                  data-ocid={`ctx-move-${p.id}-${task.id}`}
                >
                  {p.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
          data-ocid={`ctx-delete-${task.id}`}
        >
          <Trash2 className="w-3.5 h-3.5 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
