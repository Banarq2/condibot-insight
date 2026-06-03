export const CATEGORIES = [
  { code: "C01", name: "Documental y permisos", color: "var(--info)" },
  { code: "C02", name: "Inicio de actividades", color: "var(--chart-1)" },
  { code: "C03", name: "Superficie y volumen", color: "var(--chart-2)" },
  { code: "C04", name: "Operación de banco u obra", color: "var(--chart-5)" },
  { code: "C05", name: "Emisiones, polvo y ruido", color: "var(--warning)" },
  { code: "C06", name: "Agua, suelo y drenaje", color: "var(--info)" },
  { code: "C07", name: "Flora y fauna", color: "var(--success)" },
  { code: "C08", name: "Residuos y sustancias", color: "var(--destructive)" },
  { code: "C09", name: "Restauración / regeneración", color: "var(--primary)" },
  { code: "C10", name: "Reportes y seguimiento", color: "var(--chart-5)" },
] as const;

export type RiskLevel = "crítico" | "alto" | "medio" | "bajo";
export type Status = "pendiente" | "en proceso" | "cumple" | "no cumple" | "vencida" | "no aplica" | "requiere aclaración";
export type Stage = "previo" | "preparación" | "operación" | "mantenimiento" | "restauración" | "cierre";

export interface Project {
  id: string;
  name: string;
  expediente: string;
  promovente: string;
  authority: string;
  resolutionDate: string;
  location: string;
  municipality: string;
  state: string;
  activity: string;
  vigencia: string;
  surface: string;
  documentsCount: number;
  conditionantsCount: number;
  compliance: number;
}

export interface Conditionant {
  id: string;
  projectId: string;
  sourceDoc: string;
  page: number;
  originalText: string;
  summary: string;
  obligationType: "acción" | "prohibición" | "permiso" | "evidencia" | "reporte" | "restauración" | "monitoreo" | "compensación" | "restricción";
  categoryCode: string;
  stage: Stage;
  responsible: string;
  authorityReceiver: string;
  requiredEvidence: string;
  evidenceType: string;
  frequency: "única" | "diaria" | "semanal" | "mensual" | "semestral" | "anual" | "por incidencia" | "cierre";
  deadline?: string;
  risk: RiskLevel;
  status: Status;
  confidence: number;
}

export interface Impact {
  id: string;
  projectId: string;
  impactKey: string;
  title: string;
  factor: string;
  cause: string;
  mitigation: string;
  evidence: string;
  frequency: string;
  linkedCategories: string[];
}

export const projects: Project[] = [
  {
    id: "p1",
    name: "Banco de Materiales El Mirador",
    expediente: "SEMARNAT/2024/0457",
    promovente: "Constructora VMO S.A. de C.V.",
    authority: "SEMARNAT - Dirección General de Impacto",
    resolutionDate: "2024-03-12",
    location: "Carretera Federal 45 km 112",
    municipality: "Querétaro",
    state: "Querétaro",
    activity: "Extracción de materiales pétreos",
    vigencia: "10 años",
    surface: "18.4 ha",
    documentsCount: 4,
    conditionantsCount: 42,
    compliance: 78,
  },
  {
    id: "p2",
    name: "Ampliación Planta Trituradora Norte",
    expediente: "SEMARNAT/2023/1182",
    promovente: "VMO Agregados S.A.",
    authority: "SEMARNAT",
    resolutionDate: "2023-11-04",
    location: "Parque Industrial Norte",
    municipality: "Monterrey",
    state: "Nuevo León",
    activity: "Operación y ampliación de planta trituradora",
    vigencia: "8 años",
    surface: "6.2 ha",
    documentsCount: 3,
    conditionantsCount: 28,
    compliance: 64,
  },
  {
    id: "p3",
    name: "Restauración Banco San Pedro",
    expediente: "SEMARNAT/2022/0094",
    promovente: "VMO Sustentabilidad",
    authority: "SEMARNAT",
    resolutionDate: "2022-06-20",
    location: "Ejido San Pedro",
    municipality: "León",
    state: "Guanajuato",
    activity: "Restauración y regeneración",
    vigencia: "5 años",
    surface: "12.0 ha",
    documentsCount: 2,
    conditionantsCount: 19,
    compliance: 91,
  },
];

const responsibles = ["Jefe de Medio Ambiente", "Coordinador ambiental", "Supervisor ambiental", "Jefe MA SGI", "Coordinador de seguridad"];
const evidenceTypes = ["Fotografía", "PDF", "Oficio", "Acuse", "Bitácora", "Plano", "Manifiesto", "Licencia", "Póliza"];

const conditionantsSeed: Array<Partial<Conditionant> & { categoryCode: string; summary: string; originalText: string }> = [
  { categoryCode: "C01", summary: "Presentar fianza de cumplimiento ambiental por $1,200,000", originalText: "El promovente deberá exhibir fianza por la cantidad de $1,200,000.00 a favor de la Tesorería de la Federación...", risk: "crítico", status: "cumple", obligationType: "permiso" },
  { categoryCode: "C01", summary: "Mantener disponible MIA en sitio", originalText: "Deberá mantener en sitio una copia de la Manifestación de Impacto Ambiental y la presente resolución...", risk: "alto", status: "cumple", obligationType: "evidencia" },
  { categoryCode: "C02", summary: "Notificar fecha de inicio 15 días antes", originalText: "Notificar por escrito a esta autoridad con al menos 15 días naturales de anticipación al inicio de obras...", risk: "crítico", status: "cumple", obligationType: "reporte" },
  { categoryCode: "C02", summary: "Ahuyentamiento previo de fauna silvestre", originalText: "Previo al despalme deberá realizarse el ahuyentamiento, rescate y reubicación de fauna silvestre...", risk: "alto", status: "en proceso", obligationType: "acción" },
  { categoryCode: "C03", summary: "No exceder 18.4 ha de superficie autorizada", originalText: "Bajo ninguna circunstancia podrá excederse la superficie autorizada de 18.4 hectáreas...", risk: "crítico", status: "cumple", obligationType: "restricción" },
  { categoryCode: "C03", summary: "Respetar franja de amortiguamiento de 20 m", originalText: "Deberá conservarse una franja de amortiguamiento de 20 metros respecto a los límites del predio...", risk: "alto", status: "pendiente", obligationType: "restricción" },
  { categoryCode: "C04", summary: "Taludes finales con pendiente máxima 1:1.5", originalText: "Los taludes finales deberán conformarse con una pendiente no mayor a 1V:1.5H para garantizar estabilidad...", risk: "alto", status: "en proceso", obligationType: "acción" },
  { categoryCode: "C05", summary: "Riegos matapolvos diarios en caminos internos", originalText: "Deberá realizar riegos matapolvos al menos dos veces por jornada en caminos internos y áreas operativas...", risk: "alto", status: "cumple", obligationType: "acción" },
  { categoryCode: "C05", summary: "Verificación vehicular vigente de toda la flota", originalText: "Toda la maquinaria y vehículos deberán contar con verificación vehicular vigente...", risk: "medio", status: "no cumple", obligationType: "evidencia" },
  { categoryCode: "C06", summary: "No afectar escurrimientos naturales", originalText: "Queda prohibido obstruir, desviar o afectar escurrimientos naturales del predio...", risk: "crítico", status: "cumple", obligationType: "prohibición" },
  { categoryCode: "C06", summary: "Conservar capa de suelo vegetal para restauración", originalText: "El suelo vegetal removido deberá conservarse en sitio específico para su uso posterior en restauración...", risk: "alto", status: "en proceso", obligationType: "acción" },
  { categoryCode: "C07", summary: "Prohibida la caza, captura o comercio de fauna", originalText: "Queda estrictamente prohibida la caza, captura, daño o comercio de cualquier especie de fauna silvestre...", risk: "crítico", status: "cumple", obligationType: "prohibición" },
  { categoryCode: "C07", summary: "Rescate y reubicación de flora protegida", originalText: "Las especies de flora con estatus de protección deberán ser rescatadas y reubicadas previo al despalme...", risk: "alto", status: "pendiente", obligationType: "acción" },
  { categoryCode: "C08", summary: "Separar residuos por tipo y disponer con autorizado", originalText: "Los residuos sólidos urbanos, de manejo especial y peligrosos deberán separarse en la fuente...", risk: "alto", status: "en proceso", obligationType: "acción" },
  { categoryCode: "C08", summary: "Contar con kit antiderrames en zonas de combustible", originalText: "En zonas de almacenamiento de combustibles y lubricantes deberá contarse con kit antiderrames...", risk: "crítico", status: "no cumple", obligationType: "acción" },
  { categoryCode: "C09", summary: "Programa de reforestación con especies nativas", originalText: "Implementar programa de reforestación con al menos 1,200 individuos de especies nativas...", risk: "alto", status: "pendiente", obligationType: "restauración" },
  { categoryCode: "C09", summary: "Mantenimiento de plantas mínimo 3 años", originalText: "Las plantas reforestadas deberán recibir mantenimiento por un periodo mínimo de tres años...", risk: "medio", status: "pendiente", obligationType: "restauración" },
  { categoryCode: "C10", summary: "Reporte semestral de cumplimiento", originalText: "Presentar reporte semestral de cumplimiento ante la autoridad ambiental con evidencias documentales y fotográficas...", risk: "crítico", status: "vencida", obligationType: "reporte" },
  { categoryCode: "C10", summary: "Bitácora ambiental actualizada diariamente", originalText: "Mantener bitácora ambiental con registro diario de actividades, incidencias y medidas implementadas...", risk: "alto", status: "en proceso", obligationType: "reporte" },
  { categoryCode: "C10", summary: "Informe final al cierre de operaciones", originalText: "Al cierre de operaciones deberá presentarse informe final con evidencias de restauración y cumplimiento...", risk: "medio", status: "pendiente", obligationType: "reporte" },
];

const stages: Stage[] = ["previo", "preparación", "operación", "mantenimiento", "restauración", "cierre"];

export const conditionants: Conditionant[] = conditionantsSeed.map((c, i) => ({
  id: `cond-${i + 1}`,
  projectId: projects[i % projects.length].id,
  sourceDoc: "Resolución SEMARNAT 2024-0457.pdf",
  page: 8 + (i % 30),
  originalText: c.originalText,
  summary: c.summary,
  obligationType: c.obligationType as Conditionant["obligationType"],
  categoryCode: c.categoryCode,
  stage: stages[i % stages.length],
  responsible: responsibles[i % responsibles.length],
  authorityReceiver: "SEMARNAT",
  requiredEvidence: "Fotografía + acuse de presentación",
  evidenceType: evidenceTypes[i % evidenceTypes.length],
  frequency: (["única", "mensual", "semestral", "diaria", "anual"] as const)[i % 5],
  deadline: i % 3 === 0 ? `2026-${String(((i % 12) + 1)).padStart(2, "0")}-15` : undefined,
  risk: c.risk as RiskLevel,
  status: c.status as Status,
  confidence: 0.78 + (i % 20) / 100,
}));

export const impacts: Impact[] = [
  { id: "IA03", projectId: "p1", impactKey: "IA03", title: "Disminución de calidad del aire por polvos", factor: "Aire", cause: "Tránsito de maquinaria, despalme, trituración", mitigation: "Riegos matapolvos, lonas, velocidad máxima, mantenimiento", evidence: "Fotografía semanal, PDF mensual", frequency: "Semanal", linkedCategories: ["C05"] },
  { id: "IA15", projectId: "p1", impactKey: "IA15", title: "Contaminación por derrames de hidrocarburos", factor: "Suelo / Agua", cause: "Almacenamiento y manejo de combustibles", mitigation: "Kit antiderrames, contención secundaria, capacitación", evidence: "Bitácora, fotografía, manifiesto", frequency: "Por incidencia", linkedCategories: ["C08", "C06"] },
  { id: "IA20", projectId: "p1", impactKey: "IA20", title: "Afectación a fauna silvestre", factor: "Fauna", cause: "Despalme, ruido, tránsito", mitigation: "Ahuyentamiento, rescate, reubicación, señalización", evidence: "Reporte de rescate, fotografía", frequency: "Previo al inicio", linkedCategories: ["C07", "C09"] },
  { id: "IA22", projectId: "p1", impactKey: "IA22", title: "Pérdida de cubierta vegetal", factor: "Flora", cause: "Despalme y desmonte", mitigation: "Rescate de flora, reforestación con especies nativas", evidence: "Plano, bitácora, fotografía", frequency: "Por etapa", linkedCategories: ["C07", "C09"] },
  { id: "IA28", projectId: "p1", impactKey: "IA28", title: "Alteración del paisaje", factor: "Paisaje", cause: "Cortes, taludes, acumulación de material", mitigation: "Conformación final, revegetación, pantallas vegetales", evidence: "Fotografía, plano final", frequency: "Cierre", linkedCategories: ["C09", "C04"] },
  { id: "IA31", projectId: "p1", impactKey: "IA31", title: "Generación de ruido por operación", factor: "Aire / Salud", cause: "Maquinaria, voladuras, trituración", mitigation: "Silenciadores, horarios diurnos, mantenimiento", evidence: "Reporte sonométrico", frequency: "Mensual", linkedCategories: ["C05"] },
];

export const kpis = {
  projects: projects.length,
  conditionants: conditionants.length,
  fulfilled: conditionants.filter(c => c.status === "cumple").length,
  pending: conditionants.filter(c => c.status === "pendiente" || c.status === "en proceso").length,
  overdue: conditionants.filter(c => c.status === "vencida").length,
  critical: conditionants.filter(c => c.risk === "crítico").length,
  evidencesUploaded: 47,
  evidencesMissing: 18,
};
