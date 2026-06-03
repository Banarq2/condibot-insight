import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge, RiskBadge } from "@/components/status-badges";
import { AlertTriangle, CalendarClock, Bell } from "lucide-react";
import { conditionants } from "@/lib/mock-data";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [{ title: "Alertas — VMO" }] }),
  component: Alerts,
});

function Alerts() {
  const alerts = [
    { type: "Vencimiento", icon: CalendarClock, items: conditionants.filter(c => c.status === "vencida") },
    { type: "Crítica sin evidencia", icon: AlertTriangle, items: conditionants.filter(c => c.risk === "crítico" && c.status === "no cumple") },
    { type: "Próximo reporte", icon: Bell, items: conditionants.filter(c => c.categoryCode === "C10").slice(0, 3) },
  ];
  return (
    <>
      <PageHeader title="Alertas de cumplimiento" description="Notificaciones automáticas por plazo, periodicidad, falta de evidencia o incidencia." />
      <div className="space-y-6 p-6">
        {alerts.map(group => (
          <div key={group.type}>
            <div className="mb-3 flex items-center gap-2">
              <group.icon className="h-5 w-5 text-warning-foreground" />
              <h2 className="text-lg font-semibold">{group.type}</h2>
              <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning-foreground">{group.items.length}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {group.items.map(c => (
                <Card key={c.id} className="border-l-4 border-l-warning">
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <CategoryBadge code={c.categoryCode} />
                      <RiskBadge risk={c.risk} />
                    </div>
                    <p className="font-medium leading-tight">{c.summary}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Resp: {c.responsible}</span>
                      <span>{c.deadline ?? "Periodicidad: " + c.frequency}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
