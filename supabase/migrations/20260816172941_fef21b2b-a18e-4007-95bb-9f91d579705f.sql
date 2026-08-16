CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL DEFAULT 'General',
  unit text NOT NULL DEFAULT 'Unit 1',
  kind text NOT NULL DEFAULT 'notes' CHECK (kind IN ('notes','pyq')),
  file_path text,
  extracted_text text,
  status text NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded','analyzing','ready','failed')),
  analysis jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_materials TO authenticated;
GRANT ALL ON public.study_materials TO service_role;

ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own study materials"
ON public.study_materials FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_study_materials_updated_at
BEFORE UPDATE ON public.study_materials
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.study_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic text NOT NULL,
  subject text NOT NULL DEFAULT 'General',
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, subject, topic)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_progress TO authenticated;
GRANT ALL ON public.study_progress TO service_role;

ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own progress"
ON public.study_progress FOR ALL TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own study files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'study-material' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own study files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'study-material' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own study files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'study-material' AND auth.uid()::text = (storage.foldername(name))[1]);