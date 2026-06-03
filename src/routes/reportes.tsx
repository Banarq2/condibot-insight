import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, FileType2, Download } from "lucide-react";

export const Route = createFileRoute("/reportes")({
  head: () => ({ meta: [{ title: "Reportes — VMO" }] }),
  component: Reports,
});

const reports = [
  { title: "Reporte ejecutivo de cumplimiento", desc: "Resumen general por proyecto, categoría y riesgo.", icon: FileType2 },
  { title: "Matriz de cumplimiento", desc: "Tabla detallada con condicionantes, evidencias y estado.", icon: FileSpreadsheet },
  { title: "Reporte semestral SEMARNAT", desc: "Formato oficial con anexos y evidencias documentales.", icon: FileText },
  { title: "Reporte de alertas y vencimientos", desc: "Condicionantes críticas, vencidas y próximas.", icon: FileText },
  { title: "Reporte de evidencias por condicionante", desc: "Histórico de evidencias cargadas y validadas.", icon: FileSpreadsheet },
  { title: "Reporte de auditoría interna", desc: "Trazabilidad de cambios, capturas y validaciones.", icon: FileType2 },
];

function Reports() {
  return (
    <>
      <PageHeader title="Reportes" description="Genera reportes exportables a Word, PDF y Excel." />
      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
        {reports.map(r => (
          <Card key={r.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <r.icon className="h-5 w-5" />
              </div>
              <CardTitle className="mt-3 text-base">{r.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{r.desc}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Download className="mr-1 h-3.5 w-3.5" />PDF</Button>
                <Button size="sm" variant="outline"><Download className="mr-1 h-3.5 w-3.5" />Word</Button>
                <Button size="sm" variant="outline"><Download className="mr-1 h-3.5 w-3.5" />Excel</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
