
CREATE POLICY "auth read documents bucket" ON storage.objects FOR SELECT TO authenticated USING (bucket_id IN ('documents','evidences'));
CREATE POLICY "auth insert documents bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('documents','evidences'));
CREATE POLICY "auth update documents bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('documents','evidences'));
CREATE POLICY "auth delete documents bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('documents','evidences'));
