
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM (
  'admin', 'jefe_ma', 'jefe_ma_sgi', 'coordinador_ambiental',
  'supervisor_ambiental', 'coordinador_seguridad', 'supervisor_seguridad'
);

CREATE TYPE public.doc_type AS ENUM ('mia', 'resolucion', 'catalogo', 'evidencia');
CREATE TYPE public.doc_status AS ENUM ('subido', 'ocr', 'procesando', 'procesado', 'error');
CREATE TYPE public.cat_code AS ENUM ('C01','C02','C03','C04','C05','C06','C07','C08','C09','C10');
CREATE TYPE public.risk_level AS ENUM ('crítico','alto','medio','bajo');
CREATE TYPE public.cond_status AS ENUM ('pendiente','en proceso','cumple','no cumple','vencida','no aplica','requiere aclaración');
CREATE TYPE public.cond_stage AS ENUM ('previo','preparación','operación','mantenimiento','restauración','cierre');
CREATE TYPE public.cond_obligation AS ENUM ('acción','prohibición','permiso','evidencia','reporte','restauración','monitoreo','compensación','restricción');
CREATE TYPE public.cond_frequency AS ENUM ('única','diaria','semanal','mensual','semestral','anual','por incidencia','cierre');
CREATE TYPE public.evidence_status AS ENUM ('pendiente','validada','rechazada','faltante');

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles select all authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "user_roles select own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles admin manage" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ PROJECTS ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  expediente TEXT,
  promovente TEXT,
  authority TEXT,
  resolution_date DATE,
  location TEXT,
  municipality TEXT,
  state TEXT,
  coordinates TEXT,
  activity TEXT,
  vigencia TEXT,
  surface TEXT,
  volume TEXT,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects all authenticated" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ DOCUMENTS ============
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects ON DELETE CASCADE,
  doc_type doc_type NOT NULL,
  name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  pages INTEGER,
  status doc_status NOT NULL DEFAULT 'subido',
  extracted_text TEXT,
  ai_summary JSONB,
  uploaded_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents all authenticated" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_documents_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_documents_project ON public.documents(project_id);

-- ============ CONDITIONANTS ============
CREATE TABLE public.conditionants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  source_document_id UUID REFERENCES public.documents ON DELETE SET NULL,
  page_reference INTEGER,
  original_text TEXT NOT NULL,
  executive_summary TEXT,
  obligation_type cond_obligation,
  category_code cat_code,
  stage cond_stage,
  responsible_role TEXT,
  authority_receiver TEXT,
  required_evidence TEXT,
  evidence_type TEXT,
  frequency cond_frequency,
  deadline_date DATE,
  risk_level risk_level NOT NULL DEFAULT 'medio',
  status cond_status NOT NULL DEFAULT 'pendiente',
  observations TEXT,
  confidence_score NUMERIC(4,3),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conditionants TO authenticated;
GRANT ALL ON public.conditionants TO service_role;
ALTER TABLE public.conditionants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conditionants all authenticated" ON public.conditionants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_cond_updated BEFORE UPDATE ON public.conditionants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_cond_project ON public.conditionants(project_id);
CREATE INDEX idx_cond_category ON public.conditionants(category_code);

-- ============ IMPACTS ============
CREATE TABLE public.impacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects ON DELETE CASCADE,
  source_document_id UUID REFERENCES public.documents ON DELETE SET NULL,
  impact_key TEXT NOT NULL,
  impact_title TEXT NOT NULL,
  environmental_factor TEXT,
  cause TEXT,
  mitigation_measure TEXT,
  evidence_required TEXT,
  frequency TEXT,
  alert_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impacts TO authenticated;
GRANT ALL ON public.impacts TO service_role;
ALTER TABLE public.impacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "impacts all authenticated" ON public.impacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_impacts_updated BEFORE UPDATE ON public.impacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ LINKS ============
CREATE TABLE public.conditionant_impact_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conditionant_id UUID NOT NULL REFERENCES public.conditionants ON DELETE CASCADE,
  impact_id UUID NOT NULL REFERENCES public.impacts ON DELETE CASCADE,
  link_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (conditionant_id, impact_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conditionant_impact_links TO authenticated;
GRANT ALL ON public.conditionant_impact_links TO service_role;
ALTER TABLE public.conditionant_impact_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "links all authenticated" ON public.conditionant_impact_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ EVIDENCES ============
CREATE TABLE public.evidences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conditionant_id UUID NOT NULL REFERENCES public.conditionants ON DELETE CASCADE,
  evidence_type TEXT,
  file_url TEXT,
  evidence_date DATE,
  geolocation TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES auth.users,
  validation_status evidence_status NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.evidences TO authenticated;
GRANT ALL ON public.evidences TO service_role;
ALTER TABLE public.evidences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evidences all authenticated" ON public.evidences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_evidences_updated BEFORE UPDATE ON public.evidences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ALERTS ============
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conditionant_id UUID REFERENCES public.conditionants ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity risk_level NOT NULL DEFAULT 'medio',
  due_date DATE,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts all authenticated" ON public.alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit select authenticated" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "audit insert authenticated" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);
