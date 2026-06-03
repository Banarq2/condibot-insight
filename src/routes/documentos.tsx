import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, ScanLine, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/documentos")({
  head: () => ({ meta: [{ title: "Documentos — VMO" }] }),
  component: Documents,
});

const recent = [
  { name: "Resolución SEMARNAT 2024-0457.pdf", type: "Resolución condicionada", project: "Banco El Mirador", pages: 47, status: "Procesado", date: "2026-05-28" },
  { name: "MIA Banco El Mirador.pdf", type: "MIA", project: "Banco El Mirador", pages: 312, status: "Procesado", date: "2026-05-26" },
  { name: "Catálogo Impactos VMO 2025.pdf", type: "Catálogo IA", project: "General", pages: 84, status: "Procesado", date: "2026-05-20" },
  { name: "Resolución Planta Norte.pdf", type: "Resolución condicionada", project: "Planta Trituradora Norte", pages: 38, status: "OCR en proceso", date: "2026-06-02" },
];

function Documents() {
  const [docType, setDocType] = useState("resolucion");
  return (
    <>
      <PageHeader title="Carga de documentos" description="Sube MIA, resoluciones condicionadas, catálogos de impactos o evidencias de cumplimiento." />
      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Nuevo documento</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Tipo de documento</label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mia">Manifestación de Impacto Ambiental (MIA)</SelectItem>
                    <SelectItem value="resolucion">Resolución / Autorización Condicionada</SelectItem>
                    <SelectItem value="catalogo">Catálogo de Impactos y Condicionantes</SelectItem>
                    <SelectItem value="evidencia">Evidencia de cumplimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Proyecto</label>
                <Select defaultValue="p1">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">Banco de Materiales El Mirador</SelectItem>
                    <SelectItem value="p2">Ampliación Planta Trituradora Norte</SelectItem>
                    <SelectItem value="p3">Restauración Banco San Pedro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-12 text-center transition hover:bg-primary/10">
              <Upload className="h-10 w-10 text-primary" />
              <div>
                <p className="font-medium">Arrastra el PDF aquí o haz clic para seleccionar</p>
                <p className="mt-1 text-xs text-muted-foreground">Acepta PDF digital o escaneado. OCR automático.</p>
              </div>
              <input type="file" accept="application/pdf" className="hidden" />
            </label>

            <div className="grid gap-2 rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="font-medium">Al procesar, la IA extraerá:</p>
              <ul className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />Ficha del proyecto</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />Condicionantes C01–C10</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />Plazos y periodicidades</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />Evidencias requeridas</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />Riesgo y etapa</li>
                <li className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" />Página fuente y texto original</li>
              </ul>
            </div>

            <Button className="w-full" size="lg"><Sparkles className="mr-2 h-4 w-4" />Procesar con IA</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Documentos recientes</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recent.map(d => (
              <div key={d.name} className="flex items-start gap-3 rounded-md border bg-card p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-info/10 text-info">
                  {d.status.includes("OCR") ? <ScanLine className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.type} · {d.pages} págs · {d.project}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{d.date} · <span className={d.status === "Procesado" ? "text-success" : "text-warning-foreground"}>{d.status}</span></p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
