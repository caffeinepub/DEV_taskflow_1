import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export function formatDueDate(timestamp: number | null): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
}

export function isPastDue(timestamp: number | null): boolean {
  if (!timestamp) return false;
  return timestamp < Date.now();
}

export function formatFullDate(timestamp: number | null): string {
  if (!timestamp) return "";
  return format(new Date(timestamp), "PPP");
}

export function toDateInputValue(timestamp: number | null): string {
  if (!timestamp) return "";
  return format(new Date(timestamp), "yyyy-MM-dd");
}

export function fromDateInputValue(value: string): number | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.getTime();
}
