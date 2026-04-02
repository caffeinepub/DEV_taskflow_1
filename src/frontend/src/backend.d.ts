import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type TaskId = string;
export interface Task {
    id: TaskId;
    title: string;
    order: bigint;
    createdAt: Timestamp;
    tags: Array<string>;
    completed: boolean;
    dueDate?: bigint;
    description: string;
    updatedAt: Timestamp;
    projectId: ProjectId;
    priority: Priority;
    parentId?: TaskId;
    recurringFrequency: RecurringFrequency;
}
export type ProjectId = string;
export interface AppData {
    tasks: Array<Task>;
    projects: Array<Project>;
}
export interface Project {
    id: ProjectId;
    order: bigint;
    name: string;
    createdAt: Timestamp;
    description: string;
}
export enum Priority {
    low = "low",
    high = "high",
    none = "none",
    medium = "medium"
}
export enum RecurringFrequency {
    weekdays = "weekdays",
    none = "none",
    monthly = "monthly",
    daily = "daily",
    weekly = "weekly"
}
export interface backendInterface {
    createProject(name: string, description: string, order: bigint): Promise<Project>;
    createTask(projectId: ProjectId, parentId: TaskId | null, title: string, description: string, dueDate: bigint | null, priority: Priority, order: bigint, tags: Array<string>, recurringFrequency: RecurringFrequency): Promise<Task>;
    deleteProject(id: ProjectId): Promise<void>;
    deleteTask(id: TaskId): Promise<void>;
    getData(): Promise<AppData>;
    getProjects(): Promise<Array<Project>>;
    getTasks(): Promise<Array<Task>>;
    getTasksByProject(projectId: ProjectId): Promise<Array<Task>>;
    saveAll(incomingProjects: Array<Project>, incomingTasks: Array<Task>): Promise<void>;
    updateProject(id: ProjectId, name: string, description: string, order: bigint): Promise<Project | null>;
    updateTask(id: TaskId, projectId: ProjectId, parentId: TaskId | null, title: string, description: string, dueDate: bigint | null, priority: Priority, completed: boolean, order: bigint, tags: Array<string>, recurringFrequency: RecurringFrequency): Promise<Task | null>;
}
