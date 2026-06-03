import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — VMO" }] }),
  component: Settings,
});

const roles = ["Jefe de Medio Ambiente", "Jefe de Medio Ambiente SGI", "Coordinador ambiental", "Supervisor ambiental", "Coordinador de seguridad", "Supervisor de seguridad"];

function Settings() {
  return (
    <>
      <PageHeader title="Configuración" description="Roles, alertas y preferencias del sistema." />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Roles del sistema</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {roles.map(r => (
              <div key={r} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <span>{r}</span>
                <span className="text-xs text-muted-foreground">Activo</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Notificaciones</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              "Alertas por vencimiento próximo (7 días)",
              "Alertas por condicionante crítica vencida",
              "Recordatorio de reporte semestral",
              "Alertas por incidencia (derrame, fauna, polvo)",
              "Notificación de fianza o permiso por vencer",
            ].map(t => (
              <div key={t} className="flex items-center justify-between rounded-md border bg-card p-3 text-sm">
                <span>{t}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
