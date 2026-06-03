// Edge function: process-document
// Recibe { document_id } o { text, project_id, doc_name }.
// Descarga el PDF, lo envía a Lovable AI (Gemini 2.5 Pro), extrae condicionantes
// estructuradas y las inserta en la base de datos.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `Eres un analista ambiental experto en MIA, Resoluciones Ambientales Condicionadas y Catálogos de Impactos en México.

Lee el documento y devuelve EXCLUSIVAMENTE JSON válido con esta estructura:

{
  "project": {
    "name": string,
    "expediente": string|null,
    "promovente": string|null,
    "authority": string|null,
    "resolution_date": "YYYY-MM-DD"|null,
    "location": string|null,
    "municipality": string|null,
    "state": string|null,
    "coordinates": string|null,
    "activity": string|null,
    "vigencia": string|null,
    "surface": string|null,
    "volume": string|null
  },
  "executive_summary": string,
  "conditionants": [
    {
      "original_text": string,
      "executive_summary": string,
      "obligation_type": "acción"|"prohibición"|"permiso"|"evidencia"|"reporte"|"restauración"|"monitoreo"|"compensación"|"restricción",
      "category_code": "C01"|"C02"|"C03"|"C04"|"C05"|"C06"|"C07"|"C08"|"C09"|"C10",
      "stage": "previo"|"preparación"|"operación"|"mantenimiento"|"restauración"|"cierre",
      "responsible_role": string,
      "authority_receiver": string,
      "required_evidence": string,
      "evidence_type": string,
      "frequency": "única"|"diaria"|"semanal"|"mensual"|"semestral"|"anual"|"por incidencia"|"cierre",
      "deadline_date": "YYYY-MM-DD"|null,
      "risk_level": "crítico"|"alto"|"medio"|"bajo",
      "page_reference": number|null,
      "confidence_score": number
    }
  ],
  "impacts": [
    {
      "impact_key": string,
      "impact_title": string,
      "environmental_factor": string,
      "cause": string,
      "mitigation_measure": string,
      "evidence_required": string,
      "frequency": string,
      "linked_categories": ["C01"...]
    }
  ]
}

Reglas de clasificación de category_code:
- C01 Documental/permisos: permiso, licencia, fianza, autorización, acuse.
- C02 Inicio de actividades: notificación de inicio, ahuyentamiento previo, delimitación, cercado.
- C03 Superficie/volumen: no exceder área, volumen autorizado, franja, zonas autorizadas.
- C04 Operación: taludes, terrazas, caminos, maquinaria, horarios, compactación.
- C05 Emisiones/polvo/ruido: riegos matapolvos, lonas, silenciadores, verificación vehicular.
- C06 Agua/suelo/drenaje: cauce, escurrimiento, manto acuífero, erosión, despalme.
- C07 Flora y fauna: fauna, flora, caza, tala, rescate, reubicación.
- C08 Residuos: residuos, combustible, lubricante, derrame, letrina, peligroso.
- C09 Restauración: reforestación, regeneración, revegetación, mantenimiento de plantas.
- C10 Reportes: bitácora, reporte semestral, informe, evidencia fotográfica.

Reglas de risk_level:
- crítico: impide iniciar/operar, fianza, permiso, plazo legal, sanción, residuos peligrosos, exceder volumen/área.
- alto: impacto directo (polvo, ruido, suelo, agua, flora, fauna), evidencia faltante relevante.
- medio: trazabilidad o documentación menor.
- bajo: orden documental menor o mejora administrativa.

Nunca mezcles varias obligaciones en una sola fila si tienen evidencia, plazo o responsable diferente. Incluye SIEMPRE el texto literal en original_text. confidence_score entre 0 y 1.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY no configurada");

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const { document_id, project_id: bodyProjectId, text: rawText } = body;

    let projectId: string | null = bodyProjectId ?? null;
    let docId: string | null = document_id ?? null;
    let userContent: any;

    if (document_id) {
      const { data: doc, error } = await admin.from("documents").select("*").eq("id", document_id).single();
      if (error || !doc) throw new Error("Documento no encontrado");
      projectId = doc.project_id;

      await admin.from("documents").update({ status: "procesando" }).eq("id", document_id);

      const { data: file, error: dlErr } = await admin.storage.from("documents").download(doc.storage_path);
      if (dlErr || !file) throw new Error("No se pudo descargar el PDF: " + dlErr?.message);

      const buf = new Uint8Array(await file.arrayBuffer());
      // Base64 encode in chunks to avoid stack overflow
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < buf.length; i += chunk) {
        binary += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + chunk)));
      }
      const b64 = btoa(binary);

      userContent = [
        { type: "text", text: `Procesa este documento (${doc.doc_type}) y extrae toda la información estructurada en JSON según el formato indicado.` },
        { type: "image_url", image_url: { url: `data:application/pdf;base64,${b64}` } },
      ];
    } else if (rawText) {
      userContent = `Procesa este texto y extrae la información estructurada:\n\n${rawText}`;
    } else {
      throw new Error("Se requiere document_id o text");
    }

    // Llamada a Lovable AI Gateway
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const errTxt = await aiResp.text();
      if (docId) await admin.from("documents").update({ status: "error" }).eq("id", docId);
      if (aiResp.status === 429) return new Response(JSON.stringify({ error: "Límite de uso de IA alcanzado, intenta más tarde." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: "Saldo de IA agotado. Agrega créditos al workspace." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("Error IA: " + errTxt);
    }

    const aiData = await aiResp.json();
    const content = aiData.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(content); } catch { parsed = JSON.parse(content.replace(/```json|```/g, "").trim()); }

    // Crear proyecto si no existe
    if (!projectId && parsed.project) {
      const { data: newProj, error: pErr } = await admin.from("projects").insert({
        name: parsed.project.name || "Proyecto sin nombre",
        expediente: parsed.project.expediente,
        promovente: parsed.project.promovente,
        authority: parsed.project.authority,
        resolution_date: parsed.project.resolution_date,
        location: parsed.project.location,
        municipality: parsed.project.municipality,
        state: parsed.project.state,
        coordinates: parsed.project.coordinates,
        activity: parsed.project.activity,
        vigencia: parsed.project.vigencia,
        surface: parsed.project.surface,
        volume: parsed.project.volume,
      }).select("id").single();
      if (pErr) throw pErr;
      projectId = newProj.id;
      if (docId) await admin.from("documents").update({ project_id: projectId }).eq("id", docId);
    } else if (projectId && parsed.project) {
      // actualizar campos vacíos
      await admin.from("projects").update({
        expediente: parsed.project.expediente,
        promovente: parsed.project.promovente,
        authority: parsed.project.authority,
        resolution_date: parsed.project.resolution_date,
        location: parsed.project.location,
        municipality: parsed.project.municipality,
        state: parsed.project.state,
        activity: parsed.project.activity,
        vigencia: parsed.project.vigencia,
        surface: parsed.project.surface,
      }).eq("id", projectId);
    }

    // Insertar condicionantes
    const condRows = (parsed.conditionants || []).map((c: any) => ({
      project_id: projectId,
      source_document_id: docId,
      page_reference: c.page_reference,
      original_text: c.original_text,
      executive_summary: c.executive_summary,
      obligation_type: c.obligation_type,
      category_code: c.category_code,
      stage: c.stage,
      responsible_role: c.responsible_role,
      authority_receiver: c.authority_receiver,
      required_evidence: c.required_evidence,
      evidence_type: c.evidence_type,
      frequency: c.frequency,
      deadline_date: c.deadline_date,
      risk_level: c.risk_level || "medio",
      confidence_score: c.confidence_score,
    }));
    let insertedConds: any[] = [];
    if (condRows.length) {
      const { data, error } = await admin.from("conditionants").insert(condRows).select("id, category_code");
      if (error) throw error;
      insertedConds = data ?? [];
    }

    // Insertar impactos
    const impactRows = (parsed.impacts || []).map((i: any) => ({
      project_id: projectId,
      source_document_id: docId,
      impact_key: i.impact_key,
      impact_title: i.impact_title,
      environmental_factor: i.environmental_factor,
      cause: i.cause,
      mitigation_measure: i.mitigation_measure,
      evidence_required: i.evidence_required,
      frequency: i.frequency,
    }));
    let insertedImpacts: any[] = [];
    if (impactRows.length) {
      const { data, error } = await admin.from("impacts").insert(impactRows).select("id, impact_key");
      if (error) throw error;
      insertedImpacts = data ?? [];
    }

    // Links impacto-condicionante (por categoría)
    if (insertedConds.length && insertedImpacts.length) {
      const impactByKey = new Map(insertedImpacts.map((x: any) => [x.impact_key, x.id]));
      const links: any[] = [];
      for (const imp of parsed.impacts || []) {
        const impId = impactByKey.get(imp.impact_key);
        if (!impId) continue;
        for (const cat of imp.linked_categories || []) {
          for (const cond of insertedConds.filter((c: any) => c.category_code === cat)) {
            links.push({ impact_id: impId, conditionant_id: cond.id, link_type: "categoría" });
          }
        }
      }
      if (links.length) await admin.from("conditionant_impact_links").insert(links);
    }

    if (docId) {
      await admin.from("documents").update({
        status: "procesado",
        ai_summary: { executive_summary: parsed.executive_summary, project: parsed.project, counts: { conditionants: condRows.length, impacts: impactRows.length } },
      }).eq("id", docId);
    }

    return new Response(JSON.stringify({
      success: true,
      project_id: projectId,
      conditionants_created: condRows.length,
      impacts_created: impactRows.length,
      executive_summary: parsed.executive_summary,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("process-document error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
