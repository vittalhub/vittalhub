export type ColumnId = "new" | "scheduled" | "waiting" | "confirmed" | "completed";

export interface Patient {
  id: string;
  name: string;
  age: number;
  service: string;
  status: ColumnId;
  date: string;
  time?: string;
  avatar?: string;
  priority?: "low" | "medium" | "high";
  phone?: string;
  notes?: string;
  value?: string;
  healthPlan?: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  patients: Patient[];
  color: string; // Tailwind class for border/header color (e.g., "bg-blue-500")
}
