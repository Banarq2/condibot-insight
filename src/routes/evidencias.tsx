import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, FileText, CheckCircle2, Clock, Upload } from "lucide-react";

export const Route = createFileRoute("/evidencias")({
  head: () => ({ meta: [{ title: "Evidencias — VMO" }] }),
  component: Evidences,
});

const evidences = [
  {
    id: "e1",
    cond: "C05 · Riegos matapolvos diarios",
    type: "Fotografía",
    date: "2026-05-28",
    uploader: "Supervisor ambiental",
    status: "validada",
  },
  {
    id: "e2",
    cond: "C10 · Bitácora ambiental",
    type: "Bitácora",
    date: "2026-05-30",
    uploader: "Coordinador ambiental",
    status: "pendiente",
  },
  {
    id: "e3",
    cond: "C01 · Fianza de cumplimiento",
    type: "Póliza",
    date: "2024-03-20",
    uploader: "Jefe MA",
    status: "validada",
  },
  {
    id: "e4",
    cond: "C08 · Kit antiderrames",
    type: "Fotografía",
    date: "—",
    uploader: "—",
    status: "faltante",
  },
  {
    id: "e5",
    cond: "C07 · Rescate de flora",
    type: "Plano",
    date: "—",
    uploader: "—",
    status: "faltante",
  },
  {
    id: "e6",
    cond: "C10 · Reporte semestral 2025-2",
    type: "PDF",
    date: "2026-01-30",
    uploader: "Jefe MA SGI",
    status: "validada",
  },
];

function Evidences() {
  return (
    <>
      <PageHeader
        title="Evidencias"
        description="Repositorio de evidencias por condicionante con trazabilidad y validación."
        actions={
          <Button>
            <Upload className="mr-1 h-4 w-4" />
            Cargar evidencia
          </Button>
        }
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
        {evidences.map((e) => (
          <Card key={e.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {e.type === "Fotografía" ? (
                    <Camera className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                {e.status === "validada" && (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Validada
                  </span>
                )}
                {e.status === "pendiente" && (
                  <span className="flex items-center gap-1 text-xs text-info">
                    <Clock className="h-3.5 w-3.5" />
                    Pendiente
                  </span>
                )}
                {e.status === "faltante" && (
                  <span className="text-xs text-destructive">Faltante</span>
                )}
              </div>
              <p className="font-medium leading-tight">{e.cond}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{e.type}</span>
                <span>{e.date}</span>
              </div>
              <p className="text-xs text-muted-foreground">{e.uploader}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
