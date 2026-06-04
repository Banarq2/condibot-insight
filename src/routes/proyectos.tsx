import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, FileText, ListChecks, Plus, Loader2 } from "lucide-react";
import {
  createProject,
  getProjects,
  type CreateProjectInput,
  type Project,
} from "@/services/projectsService";

export const Route = createFileRoute("/proyectos")({
  head: () => ({ meta: [{ title: "Proyectos — VMO" }] }),
  component: Projects,
});

const emptyForm: CreateProjectInput = {
  name: "",
  expediente: "",
  promovente: "",
  authority: "",
  resolution_date: "",
  location: "",
  municipality: "",
  state: "",
  coordinates: "",
  activity: "",
  vigencia: "",
  surface: "",
  volume: "",
};

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<CreateProjectInput>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProjects() {
    try {
      setLoading(true);
      setErrorMessage(null);

      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al cargar proyectos.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  function updateField(field: keyof CreateProjectInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      setErrorMessage("El nombre del proyecto es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);

      await createProject(form);

      setForm(emptyForm);
      setShowForm(false);
      await loadProjects();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al crear proyecto.";
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Proyectos"
        description="Cartera de proyectos con resoluciones ambientales bajo seguimiento."
        actions={
          <Button onClick={() => setShowForm((current) => !current)}>
            <Plus className="mr-1 h-4 w-4" />
            Nuevo proyecto
          </Button>
        }
      />

      <div className="space-y-4 p-6">
        {errorMessage ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {showForm ? (
          <Card>
            <CardContent className="p-5">
              <form className="space-y-4" onSubmit={handleCreateProject}>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nombre del proyecto *</label>
                    <Input
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Ej. Banco Sifón"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Expediente</label>
                    <Input
                      value={form.expediente}
                      onChange={(event) => updateField("expediente", event.target.value)}
                      placeholder="Ej. MIA-BM-APG-002-106435/2022"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Promovente</label>
                    <Input
                      value={form.promovente}
                      onChange={(event) => updateField("promovente", event.target.value)}
                      placeholder="Ej. Waste Dry, S.A. de C.V."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Autoridad</label>
                    <Input
                      value={form.authority}
                      onChange={(event) => updateField("authority", event.target.value)}
                      placeholder="Ej. SMAOT"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Fecha de resolución</label>
                    <Input
                      type="date"
                      value={form.resolution_date}
                      onChange={(event) => updateField("resolution_date", event.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Municipio</label>
                    <Input
                      value={form.municipality}
                      onChange={(event) => updateField("municipality", event.target.value)}
                      placeholder="Ej. Apaseo el Grande"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Estado</label>
                    <Input
                      value={form.state}
                      onChange={(event) => updateField("state", event.target.value)}
                      placeholder="Ej. Guanajuato"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Ubicación</label>
                    <Input
                      value={form.location}
                      onChange={(event) => updateField("location", event.target.value)}
                      placeholder="Ej. Parcela 17, Ejido La Palma"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Coordenadas</label>
                    <Input
                      value={form.coordinates}
                      onChange={(event) => updateField("coordinates", event.target.value)}
                      placeholder="Ej. 20°31’57.1” N, 100°43’11.43” O"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Actividad autorizada</label>
                    <Input
                      value={form.activity}
                      onChange={(event) => updateField("activity", event.target.value)}
                      placeholder="Ej. Extracción / regeneración"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Vigencia</label>
                    <Input
                      value={form.vigencia}
                      onChange={(event) => updateField("vigencia", event.target.value)}
                      placeholder="Ej. 16 meses"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Superficie</label>
                    <Input
                      value={form.surface}
                      onChange={(event) => updateField("surface", event.target.value)}
                      placeholder="Ej. 76,003.21 m²"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Volumen</label>
                    <Input
                      value={form.volume}
                      onChange={(event) => updateField("volume", event.target.value)}
                      placeholder="Ej. 917,056.13 m³"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>

                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Guardar proyecto
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando proyectos...
          </div>
        ) : null}

        {!loading && projects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No hay proyectos registrados. Crea el primer proyecto para iniciar el seguimiento de
              condicionantes ambientales.
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary to-info" />

              <CardContent className="space-y-3 p-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {project.expediente || "Sin expediente"}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold leading-tight">{project.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  {project.promovente || "Sin promovente"}
                </p>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.municipality || "Sin municipio"}, {project.state || "Sin estado"}
                </div>

                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Autoridad</dt>
                    <dd>{project.authority || "N/D"}</dd>
                  </div>

                  <div>
                    <dt className="text-xs text-muted-foreground">Resolución</dt>
                    <dd>{project.resolution_date || "N/D"}</dd>
                  </div>

                  <div>
                    <dt className="text-xs text-muted-foreground">Vigencia</dt>
                    <dd>{project.vigencia || "N/D"}</dd>
                  </div>

                  <div>
                    <dt className="text-xs text-muted-foreground">Superficie</dt>
                    <dd>{project.surface || "N/D"}</dd>
                  </div>
                </dl>

                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-4 w-4" />0 docs
                  </span>

                  <span className="flex items-center gap-1 text-muted-foreground">
                    <ListChecks className="h-4 w-4" />0 cond.
                  </span>

                  <span className="font-semibold text-primary">0%</span>
                </div>

                <Button className="w-full" variant="outline" asChild>
                  <Link to="/proyectos/$projectId" params={{ projectId: project.id }}>
                    Ver detalle
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
