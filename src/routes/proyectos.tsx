import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projects } from "@/lib/mock-data";
import { MapPin, FileText, ListChecks, Plus } from "lucide-react";

export const Route = createFileRoute("/proyectos")({
  head: () => ({ meta: [{ title: "Proyectos — VMO" }] }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <PageHeader
        title="Proyectos"
        description="Cartera de proyectos con resoluciones ambientales bajo seguimiento."
        actions={<Button><Plus className="mr-1 h-4 w-4" />Nuevo proyecto</Button>}
      />
      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map(p => (
          <Card key={p.id} className="overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary to-info" />
            <CardContent className="space-y-3 p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{p.expediente}</p>
                <h3 className="mt-1 text-lg font-semibold leading-tight">{p.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{p.promovente}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {p.municipality}, {p.state}
              </div>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div><dt className="text-xs text-muted-foreground">Autoridad</dt><dd>{p.authority}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Resolución</dt><dd>{p.resolutionDate}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Vigencia</dt><dd>{p.vigencia}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Superficie</dt><dd>{p.surface}</dd></div>
              </dl>
              <div className="flex items-center justify-between border-t pt-3 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground"><FileText className="h-4 w-4" />{p.documentsCount} docs</span>
                <span className="flex items-center gap-1 text-muted-foreground"><ListChecks className="h-4 w-4" />{p.conditionantsCount} cond.</span>
                <span className="font-semibold text-primary">{p.compliance}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
