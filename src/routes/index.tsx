import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  FolderKanban,
  ListChecks,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Camera,
  FileWarning,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES, conditionants, kpis, projects } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — VMO Sustentabilidad" },
      {
        name: "description",
        content: "Resumen de cumplimiento de condicionantes ambientales por proyecto.",
      },
    ],
  }),
  component: Dashboard,
});

const kpiCards = [
  { label: "Proyectos", value: kpis.projects, icon: FolderKanban, tone: "text-info" },
  { label: "Condicionantes", value: kpis.conditionants, icon: ListChecks, tone: "text-primary" },
  { label: "Cumplidas", value: kpis.fulfilled, icon: CheckCircle2, tone: "text-success" },
  { label: "Pendientes", value: kpis.pending, icon: Clock, tone: "text-info" },
  { label: "Vencidas", value: kpis.overdue, icon: AlertTriangle, tone: "text-destructive" },
  { label: "Críticas", value: kpis.critical, icon: ShieldAlert, tone: "text-destructive" },
  {
    label: "Evidencias cargadas",
    value: kpis.evidencesUploaded,
    icon: Camera,
    tone: "text-success",
  },
  {
    label: "Evidencias faltantes",
    value: kpis.evidencesMissing,
    icon: FileWarning,
    tone: "text-warning-foreground",
  },
];

function Dashboard() {
  const byCategory = CATEGORIES.map((c) => ({
    code: c.code,
    name: c.name,
    total: conditionants.filter((x) => x.categoryCode === c.code).length,
  }));

  const byRisk = (["crítico", "alto", "medio", "bajo"] as const).map((r) => ({
    name: r,
    value: conditionants.filter((c) => c.risk === r).length,
  }));
  const riskColors = [
    "var(--destructive)",
    "var(--warning)",
    "var(--info)",
    "var(--muted-foreground)",
  ];

  const stages = [
    "previo",
    "preparación",
    "operación",
    "mantenimiento",
    "restauración",
    "cierre",
  ] as const;
  const byStage = stages.map((s) => ({
    stage: s,
    total: conditionants.filter((c) => c.stage === s).length,
  }));

  const upcoming = conditionants
    .filter((c) => c.deadline)
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard de cumplimiento"
        description="Estado general de condicionantes ambientales en todos los proyectos."
        actions={
          <Button asChild>
            <Link to="/documentos">Cargar documento</Link>
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          {kpiCards.map((k) => (
            <Card key={k.label} className="border-l-4 border-l-primary/60">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {k.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">{k.value}</p>
                  </div>
                  <k.icon className={`h-5 w-5 ${k.tone}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Condicionantes por categoría (C01–C10)</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="code" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="total" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Por nivel de riesgo</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byRisk}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                  >
                    {byRisk.map((_, i) => (
                      <Cell key={i} fill={riskColors[i]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Por etapa del proyecto</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 12 }} width={110} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="total" fill="var(--info)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Próximos vencimientos</CardTitle>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map((c) => (
                <div key={c.id} className="flex items-start gap-3 rounded-md border bg-card/50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                    {c.categoryCode}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.summary}</p>
                    <p className="text-xs text-muted-foreground">Vence {c.deadline}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Proyectos activos</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/proyectos">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-lg border bg-card p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {p.expediente}
                </p>
                <p className="mt-1 font-medium leading-tight">{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.municipality}, {p.state}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cumplimiento</span>
                  <span className="font-semibold">{p.compliance}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${p.compliance}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
