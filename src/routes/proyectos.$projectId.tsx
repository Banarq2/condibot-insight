import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, FileText, ListChecks, MapPin, ShieldCheck, Upload } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectById, type Project } from "@/services/projectsService";

export const Route = createFileRoute("/proyectos/$projectId")({
  head: () => ({ meta: [{ title: "Detalle de proyecto — VMO" }] }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProject() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const data = await getProjectById(projectId);
      setProject(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al cargar el proyecto.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Cargando proyecto..."
          description="Consultando información del proyecto en Supabase."
        />

        <div className="p-6 text-sm text-muted-foreground">Cargando información...</div>
      </>
    );
  }

  if (errorMessage || !project) {
    return (
      <>
        <PageHeader
          title="Proyecto no disponible"
          description="No fue posible cargar la información del proyecto."
          actions={
            <Button variant="outline" asChild>
              <Link to="/proyectos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a proyectos
              </Link>
            </Button>
          }
        />

        <div className="p-6">
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage || "Proyecto no encontrado."}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={project.name}
        description="Detalle del proyecto ambiental y preparación para gestión de condicionantes."
        actions={
          <Button variant="outline" asChild>
            <Link to="/proyectos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a proyectos
            </Link>
          </Button>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Condicionantes
              </p>
              <p className="mt-2 text-3xl font-semibold">0</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pendiente de conectar en Sprint 2
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Evidencias</p>
              <p className="mt-2 text-3xl font-semibold">0</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pendiente de conectar en Sprint 3
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Alertas</p>
              <p className="mt-2 text-3xl font-semibold">0</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pendiente de conectar en Sprint 4
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cumplimiento</p>
              <p className="mt-2 text-3xl font-semibold">0%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Se calculará con condicionantes reales
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Ficha general del proyecto</CardTitle>
            </CardHeader>

            <CardContent>
              <dl className="grid gap-4 md:grid-cols-2">
                <ProjectField label="Expediente" value={project.expediente} />
                <ProjectField label="Promovente" value={project.promovente} />
                <ProjectField label="Autoridad" value={project.authority} />
                <ProjectField label="Fecha de resolución" value={project.resolution_date} />
                <ProjectField label="Municipio" value={project.municipality} />
                <ProjectField label="Estado" value={project.state} />
                <ProjectField label="Ubicación" value={project.location} />
                <ProjectField label="Coordenadas" value={project.coordinates} />
                <ProjectField label="Actividad autorizada" value={project.activity} />
                <ProjectField label="Vigencia" value={project.vigencia} />
                <ProjectField label="Superficie" value={project.surface} />
                <ProjectField label="Volumen" value={project.volume} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ubicación y alcance</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-3 rounded-lg border p-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {project.municipality || "Sin municipio"}, {project.state || "Sin estado"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.location || "Sin ubicación registrada"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                Esta sección funcionará como contenedor maestro para documentos, condicionantes,
                evidencias, alertas y reportes del proyecto.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ModuleCard
            icon={<ListChecks className="h-5 w-5" />}
            title="Condicionantes"
            description="Alta y seguimiento de obligaciones ambientales por proyecto."
            cta="Sprint 2"
          />

          <ModuleCard
            icon={<Upload className="h-5 w-5" />}
            title="Evidencias"
            description="Carga de fotografías, acuses, reportes, bitácoras y documentos."
            cta="Sprint 3"
          />

          <ModuleCard
            icon={<Bell className="h-5 w-5" />}
            title="Alertas"
            description="Vencimientos, periodicidades, evidencias faltantes y riesgos."
            cta="Sprint 4"
          />

          <ModuleCard
            icon={<FileText className="h-5 w-5" />}
            title="Documentos"
            description="MIA, resolutivos, catálogos, permisos, licencias y anexos."
            cta="Sprint 5"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Preparación para cumplimiento
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground">
            El siguiente paso será registrar condicionantes ambientales asociadas a este proyecto,
            con código, clasificación, obligación, evidencia requerida, responsable, periodicidad,
            riesgo y estado de cumplimiento.
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ProjectField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value || "N/D"}</dd>
    </div>
  );
}

function ModuleCard({
  icon,
  title,
  description,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <p className="text-xs font-medium text-primary">{cta}</p>
      </CardContent>
    </Card>
  );
}
