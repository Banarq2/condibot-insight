import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/status-badges";
import { impacts, CATEGORIES } from "@/lib/mock-data";

export const Route = createFileRoute("/impactos")({
  head: () => ({ meta: [{ title: "Impactos — VMO" }] }),
  component: Impacts,
});

function Impacts() {
  return (
    <>
      <PageHeader title="Catálogo de impactos" description="Impactos ambientales (IA) y su relación con las categorías de condicionantes C01–C10." />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {impacts.map(i => (
            <Card key={i.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{i.impactKey} — {i.title}</span>
                  <span className="text-xs font-normal text-muted-foreground">{i.factor}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-xs text-muted-foreground">Causa:</span> {i.cause}</div>
                <div><span className="text-xs text-muted-foreground">Mitigación:</span> {i.mitigation}</div>
                <div><span className="text-xs text-muted-foreground">Evidencia:</span> {i.evidence}</div>
                <div><span className="text-xs text-muted-foreground">Frecuencia:</span> {i.frequency}</div>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-muted-foreground">Vinculado a:</span>
                  {i.linkedCategories.map(c => <CategoryBadge key={c} code={c} />)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Matriz Impacto × Condicionante</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border bg-muted/50 p-2 text-left">Impacto</th>
                  {CATEGORIES.map(c => <th key={c.code} className="border bg-muted/50 p-2 text-center text-xs">{c.code}</th>)}
                </tr>
              </thead>
              <tbody>
                {impacts.map(i => (
                  <tr key={i.id}>
                    <td className="border p-2 font-medium">{i.impactKey} — {i.title}</td>
                    {CATEGORIES.map(c => (
                      <td key={c.code} className="border p-2 text-center">
                        {i.linkedCategories.includes(c.code)
                          ? <span className="inline-block h-3 w-3 rounded-full bg-primary" />
                          : <span className="text-muted-foreground/30">·</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
