import { cn } from "@/lib/utils";
import type { RiskLevel, Status } from "@/lib/mock-data";

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, string> = {
    crítico: "bg-destructive/15 text-destructive border-destructive/30",
    alto: "bg-warning/20 text-warning-foreground border-warning/40",
    medio: "bg-info/15 text-info border-info/30",
    bajo: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        map[risk],
      )}
    >
      {risk}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    cumple: "bg-success/15 text-success border-success/30",
    "en proceso": "bg-info/15 text-info border-info/30",
    pendiente: "bg-muted text-muted-foreground border-border",
    "no cumple": "bg-destructive/15 text-destructive border-destructive/30",
    vencida: "bg-destructive/20 text-destructive border-destructive/40",
    "no aplica": "bg-muted text-muted-foreground border-border",
    "requiere aclaración": "bg-warning/20 text-warning-foreground border-warning/40",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        map[status],
      )}
    >
      {status}
    </span>
  );
}

export function CategoryBadge({ code }: { code: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
      {code}
    </span>
  );
}
