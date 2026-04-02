export type ProjectId = string;
export type TaskId = string;
export type Timestamp = number;

export type Priority = "high" | "medium" | "low" | "none";
export type RecurringFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "weekdays"
  | "monthly";
export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";
export type FilterStatus = "all" | "active" | "completed";
export type FilterDueDate =
  | "all"
  | "overdue"
  | "today"
  | "this-week"
  | "no-date";

export interface Project {
  id: ProjectId;
  name: string;
  description: string;
  createdAt: Timestamp;
  order: number;
}

export interface Task {
  id: TaskId;
  projectId: ProjectId;
  parentId: TaskId | null;
  title: string;
  description: string;
  dueDate: number | null;
  priority: Priority;
  completed: boolean;
  order: number;
  tags: string[];
  recurringFrequency: RecurringFrequency;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TaskFilters {
  status: FilterStatus;
  priority: Priority | "all";
  dueDate: FilterDueDate;
  search: string;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
  none: 3,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  none: "None",
};

export const RECURRING_LABELS: Record<RecurringFrequency, string> = {
  none: "Does not repeat",
  daily: "Daily",
  weekly: "Weekly",
  weekdays: "Weekdays",
  monthly: "Monthly",
};

export const DEFAULT_PROJECT_ID = "inbox";

export const SEED_PROJECTS: Project[] = [
  {
    id: "inbox",
    name: "Inbox",
    description: "Default inbox for tasks",
    createdAt: Date.now(),
    order: 0,
  },
  {
    id: "work",
    name: "Work",
    description: "Work-related tasks and projects",
    createdAt: Date.now(),
    order: 1,
  },
  {
    id: "personal",
    name: "Personal",
    description: "Personal errands and goals",
    createdAt: Date.now(),
    order: 2,
  },
];

const now = Date.now();
const day = 86400000;

export const SEED_TASKS: Task[] = [
  {
    id: "t1",
    projectId: "work",
    parentId: null,
    title: "Finalize Q2 product roadmap",
    description:
      "Consolidate feedback from stakeholders and define sprint priorities for Q2.",
    dueDate: now + day * 2,
    priority: "high",
    completed: false,
    order: 0,
    tags: ["planning", "roadmap"],
    recurringFrequency: "none",
    createdAt: now - day * 3,
    updatedAt: now - day,
  },
  {
    id: "t2",
    projectId: "work",
    parentId: null,
    title: "Review pull requests for API refactor",
    description: "Three open PRs need review before end of week merge window.",
    dueDate: now + day,
    priority: "high",
    completed: false,
    order: 1,
    tags: ["engineering", "review"],
    recurringFrequency: "none",
    createdAt: now - day * 2,
    updatedAt: now - day,
  },
  {
    id: "t3",
    projectId: "work",
    parentId: "t1",
    title: "Interview user research candidates",
    description:
      "Schedule and conduct 3 user interviews for feature validation.",
    dueDate: now + day * 5,
    priority: "medium",
    completed: false,
    order: 2,
    tags: ["research"],
    recurringFrequency: "none",
    createdAt: now - day,
    updatedAt: now,
  },
  {
    id: "t4",
    projectId: "work",
    parentId: null,
    title: "Update team docs on deployment process",
    description: "Document the new canister upgrade workflow in Confluence.",
    dueDate: now + day * 7,
    priority: "low",
    completed: true,
    order: 3,
    tags: ["docs"],
    recurringFrequency: "none",
    createdAt: now - day * 4,
    updatedAt: now - day * 2,
  },
  {
    id: "t5",
    projectId: "personal",
    parentId: null,
    title: "Morning workout routine",
    description: "30-minute cardio + core strength session.",
    dueDate: null,
    priority: "medium",
    completed: false,
    order: 0,
    tags: ["health"],
    recurringFrequency: "weekdays",
    createdAt: now - day * 5,
    updatedAt: now,
  },
  {
    id: "t6",
    projectId: "personal",
    parentId: null,
    title: 'Read "Deep Work" — chapters 5–7',
    description:
      "Continue reading and take notes for weekly book club discussion.",
    dueDate: now + day * 3,
    priority: "low",
    completed: false,
    order: 1,
    tags: ["reading", "self-improvement"],
    recurringFrequency: "none",
    createdAt: now - day * 2,
    updatedAt: now - day,
  },
  {
    id: "t7",
    projectId: "inbox",
    parentId: null,
    title: "Renew domain subscriptions",
    description: "Check expiry dates and renew before auto-cancellation.",
    dueDate: now - day,
    priority: "high",
    completed: false,
    order: 0,
    tags: ["admin"],
    recurringFrequency: "none",
    createdAt: now - day * 3,
    updatedAt: now - day,
  },
  {
    id: "t8",
    projectId: "inbox",
    parentId: null,
    title: "Reply to conference speaking invite",
    description:
      "Evaluate timeline and confirm or decline FrontConf 2026 keynote slot.",
    dueDate: now + day * 4,
    priority: "medium",
    completed: false,
    order: 1,
    tags: ["speaking", "opportunity"],
    recurringFrequency: "none",
    createdAt: now - day,
    updatedAt: now,
  },
];
