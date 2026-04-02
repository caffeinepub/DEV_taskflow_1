import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Briefcase,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Inbox,
  MoreHorizontal,
  Plus,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import type { FilterDueDate, FilterStatus, Project } from "../types/task";

const PROJECT_ICONS: Record<string, React.ReactNode> = {
  inbox: <Inbox className="w-3.5 h-3.5" />,
  work: <Briefcase className="w-3.5 h-3.5" />,
  personal: <User className="w-3.5 h-3.5" />,
};

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const DATE_FILTERS: {
  value: FilterDueDate;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "overdue",
    label: "Overdue",
    icon: <Calendar className="w-3.5 h-3.5 text-destructive" />,
  },
  {
    value: "today",
    label: "Today",
    icon: <Calendar className="w-3.5 h-3.5 text-primary" />,
  },
  {
    value: "this-week",
    label: "This week",
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
];

export function Sidebar() {
  const {
    projects,
    tasks,
    selectedProjectId,
    filters,
    setSelectedProject,
    setFilter,
    addProject,
    updateProject,
    deleteProject,
    moveTask,
    markDirty,
  } = useTaskStore();

  const [showProjects, setShowProjects] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [addingProject, setAddingProject] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const taskCountFor = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId && !t.completed).length;

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    const id = `proj-${Date.now()}`;
    addProject({
      id,
      name: newProjectName.trim(),
      description: "",
      createdAt: Date.now(),
      order: projects.length,
    });
    markDirty();
    setNewProjectName("");
    setAddingProject(false);
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setEditName(p.name);
  };

  const commitEdit = () => {
    if (editingId && editName.trim()) {
      updateProject(editingId, { name: editName.trim() });
      markDirty();
    }
    setEditingId(null);
  };

  // Drag-over: highlight this project as drop target
  const handleProjectDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetId(projectId);
  };

  // Drop: move task to this project
  const handleProjectDrop = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      moveTask(taskId, projectId);
      markDirty();
    }
    setDropTargetId(null);
  };

  return (
    <nav
      className="flex flex-col h-full py-2 text-sm select-none"
      data-ocid="sidebar-nav"
    >
      {/* Status filter */}
      <div className="px-2 mb-1">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            type="button"
            key={value}
            className={`
              w-full flex items-center gap-2 px-2 py-1 rounded-md text-left
              transition-colors-fast
              ${
                filters.status === value && selectedProjectId === "all"
                  ? "bg-accent/20 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }
            `}
            onClick={() => {
              setSelectedProject("all");
              setFilter({ status: value });
            }}
            data-ocid={`filter-status-${value}`}
          >
            <CheckSquare className="w-3.5 h-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {/* Due date filters */}
      <div className="px-2 mb-3">
        {DATE_FILTERS.map(({ value, label, icon }) => (
          <button
            type="button"
            key={value}
            className={`
              w-full flex items-center gap-2 px-2 py-1 rounded-md text-left
              transition-colors-fast
              ${
                filters.dueDate === value && selectedProjectId === "all"
                  ? "bg-accent/20 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }
            `}
            onClick={() => {
              setSelectedProject("all");
              setFilter({ dueDate: value, status: "all" });
            }}
            data-ocid={`filter-date-${value}`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="mx-2 mb-2 h-px bg-border" />

      {/* Projects section */}
      <div className="px-2 flex items-center justify-between mb-1">
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors-fast"
          onClick={() => setShowProjects(!showProjects)}
        >
          {showProjects ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
          Projects
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => setAddingProject(true)}
              data-ocid="add-project-btn"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">New project</TooltipContent>
        </Tooltip>
      </div>

      {showProjects && (
        <div className="px-2 space-y-px">
          {projects.map((p) => (
            <div
              key={p.id}
              className="group relative"
              onDragOver={(e) => handleProjectDragOver(e, p.id)}
              onDragLeave={() => setDropTargetId(null)}
              onDrop={(e) => handleProjectDrop(e, p.id)}
            >
              <button
                type="button"
                className={`
                  w-full flex items-center gap-2 px-2 py-1 rounded-md text-left
                  transition-colors-fast border
                  ${
                    dropTargetId === p.id
                      ? "bg-accent/25 border-primary/50 text-primary"
                      : selectedProjectId === p.id
                        ? "bg-accent/20 text-primary border-transparent"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border-transparent"
                  }
                `}
                onClick={() => {
                  setSelectedProject(p.id);
                  setFilter({ status: "all", dueDate: "all" });
                }}
                data-ocid={`project-item-${p.id}`}
              >
                <span className="shrink-0">
                  {PROJECT_ICONS[p.id] ?? <Tag className="w-3.5 h-3.5" />}
                </span>

                {editingId === p.id ? (
                  <Input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="h-5 py-0 px-1 text-xs bg-background border-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="flex-1 min-w-0 truncate-1 text-xs">
                    {p.name}
                  </span>
                )}

                {/* Drop hint */}
                {dropTargetId === p.id && (
                  <span className="text-[10px] text-primary font-mono shrink-0">
                    Drop here
                  </span>
                )}

                {taskCountFor(p.id) > 0 && dropTargetId !== p.id && (
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 text-[10px] font-mono shrink-0"
                  >
                    {taskCountFor(p.id)}
                  </Badge>
                )}
              </button>

              {p.id !== "inbox" && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        data-ocid={`project-menu-${p.id}`}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => startEdit(p)}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          deleteProject(p.id);
                          markDirty();
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}

          {addingProject && (
            <div className="flex items-center gap-1 px-2">
              <Input
                autoFocus
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddProject();
                  if (e.key === "Escape") {
                    setAddingProject(false);
                    setNewProjectName("");
                  }
                }}
                onBlur={() => {
                  if (!newProjectName.trim()) setAddingProject(false);
                }}
                className="h-6 py-0 px-2 text-xs"
                data-ocid="new-project-input"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex-1" />
    </nav>
  );
}
