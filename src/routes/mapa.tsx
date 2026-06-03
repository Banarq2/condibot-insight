import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES, conditionants, projects } from "@/lib/mock-data";

export const Route = createFileRoute("/mapa")({
  head: () => ({ meta: [{ title: "Mapa conceptual — VMO" }] }),
  component: ConceptMap,
});

function ConceptMap() {
  const project = projects[0];
  const branches = CATEGORIES.map(cat => {
    const items = conditionants.filter(c => c.categoryCode === cat.code);
    const critical = items.filter(c => c.risk === "crítico").length;
    return { ...cat, total: items.length, critical };
  });

  return (
    <>
      <PageHeader title="Mapa conceptual del proyecto" description={`${project.name} — ramificación por categoría de condicionantes.`} />
      <div className="p-6">
        <div className="relative mx-auto max-w-6xl">
          <Card className="mx-auto mb-8 max-w-md border-2 border-primary bg-primary/5">
            <CardContent className="p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Proyecto</p>
              <h2 className="mt-1 text-lg font-semibold text-primary">{project.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{project.expediente}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {branches.map(b => (
              <Card key={b.code} className="relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-primary" />
                <CardContent className="space-y-2 p-4 pl-5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{b.code}</span>
                    <span className="text-2xl font-bold tabular-nums">{b.total}</span>
                  </div>
                  <p className="text-sm font-medium leading-tight">{b.name}</p>
                  <div className="flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
                    <span>Críticas</span>
                    <span className={b.critical > 0 ? "font-semibold text-destructive" : ""}>{b.critical}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">Vista esquemática · próximamente conexiones interactivas y diagrama tipo árbol</p>
        </div>
      </div>
    </>
  );
}
