import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryBadge, RiskBadge, StatusBadge } from "@/components/status-badges";
import { CATEGORIES, conditionants } from "@/lib/mock-data";
import { Search, Download, Filter } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/condicionantes")({
  head: () => ({ meta: [{ title: "Condicionantes — VMO" }] }),
  component: Conditionants,
});

function Conditionants() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const filtered = conditionants.filter(c =>
    (cat === "all" || c.categoryCode === cat) &&
    (q === "" || c.summary.toLowerCase().includes(q.toLowerCase()) || c.originalText.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <PageHeader
        title="Condicionantes"
        description="Cada obligación detectada se guarda como un registro individual editable, con trazabilidad al texto original."
        actions={<Button variant="outline"><Download className="mr-1 h-4 w-4" />Exportar</Button>}
      />
      <div className="space-y-4 p-6">
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <div className="relative min-w-[260px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar texto, palabra clave..." className="pl-9" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="w-[260px]"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c.code} value={c.code}>{c.code} — {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{filtered.length} de {conditionants.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cat.</TableHead>
                    <TableHead className="min-w-[320px]">Resumen</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Vence</TableHead>
                    <TableHead>Riesgo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Conf.</TableHead>
                    <TableHead>Pág.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.id}>
                      <TableCell><CategoryBadge code={c.categoryCode} /></TableCell>
                      <TableCell>
                        <p className="font-medium leading-tight">{c.summary}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.originalText}</p>
                      </TableCell>
                      <TableCell className="capitalize text-sm">{c.obligationType}</TableCell>
                      <TableCell className="capitalize text-sm">{c.stage}</TableCell>
                      <TableCell className="text-sm">{c.responsible}</TableCell>
                      <TableCell className="capitalize text-sm">{c.frequency}</TableCell>
                      <TableCell className="text-sm tabular-nums">{c.deadline ?? "—"}</TableCell>
                      <TableCell><RiskBadge risk={c.risk} /></TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell className="text-sm tabular-nums">{Math.round(c.confidence * 100)}%</TableCell>
                      <TableCell className="text-sm tabular-nums">{c.page}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
