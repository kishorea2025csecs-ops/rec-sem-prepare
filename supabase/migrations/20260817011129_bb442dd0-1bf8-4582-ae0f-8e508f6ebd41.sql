-- 1. Academic Structure
CREATE TABLE public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text UNIQUE NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.units (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    unit_number integer NOT NULL,
    title text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(subject_id, unit_number)
);

CREATE TABLE public.topics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    importance float DEFAULT 0.5, -- 0 to 1
    exam_frequency integer DEFAULT 0, -- how many times appeared in last N semesters
    marks_weightage integer DEFAULT 2, -- typical marks (2, 13, 15)
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
    question_text text NOT NULL,
    marks integer NOT NULL,
    year_semester text, -- e.g. "Nov 2023"
    is_pyq boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. User Progress & Analytics
CREATE TABLE public.topic_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
    mastery_score float DEFAULT 0 CHECK (mastery_score >= 0 AND mastery_score <= 1),
    accuracy float DEFAULT 0 CHECK (accuracy >= 0 AND accuracy <= 1),
    attempt_count integer DEFAULT 0,
    correct_count integer DEFAULT 0,
    revision_count integer DEFAULT 0,
    last_revised_at timestamptz,
    status text DEFAULT 'learning' CHECK (status IN ('weak', 'learning', 'mastered')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id, topic_id)
);

CREATE TABLE public.question_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    is_correct boolean NOT NULL,
    answer_time_seconds integer,
    confidence integer CHECK (confidence >= 1 AND confidence <= 5),
    attempted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.revision_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
    duration_minutes integer,
    score_before float,
    score_after float,
    completed_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Planning
CREATE TABLE public.study_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    exam_date date NOT NULL,
    study_hours_per_day float DEFAULT 2.0,
    preparation_level text DEFAULT 'beginner',
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TABLE public.study_plan_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    study_plan_id uuid REFERENCES public.study_plans(id) ON DELETE CASCADE NOT NULL,
    topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
    scheduled_date date NOT NULL,
    duration_minutes integer DEFAULT 60,
    priority text CHECK (priority IN ('low', 'medium', 'high', 'very_high')),
    completed boolean DEFAULT false,
    completed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. 3D Graph Structure
CREATE TABLE public.concept_nodes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
    topic_id uuid REFERENCES public.topics(id) ON DELETE CASCADE,
    label text NOT NULL,
    description text,
    difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
    importance float DEFAULT 0.5,
    pos_x float DEFAULT 0,
    pos_y float DEFAULT 0,
    pos_z float DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.concept_edges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id uuid REFERENCES public.concept_nodes(id) ON DELETE CASCADE NOT NULL,
    target_node_id uuid REFERENCES public.concept_nodes(id) ON DELETE CASCADE NOT NULL,
    relationship_type text DEFAULT 'prerequisite',
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Security & Grants
GRANT SELECT ON public.subjects TO authenticated;
GRANT SELECT ON public.units TO authenticated;
GRANT SELECT ON public.topics TO authenticated;
GRANT SELECT ON public.questions TO authenticated;
GRANT SELECT ON public.concept_nodes TO authenticated;
GRANT SELECT ON public.concept_edges TO authenticated;

GRANT ALL ON public.topic_progress TO authenticated;
GRANT ALL ON public.question_attempts TO authenticated;
GRANT ALL ON public.revision_sessions TO authenticated;
GRANT ALL ON public.study_plans TO authenticated;
GRANT ALL ON public.study_plan_items TO authenticated;

GRANT ALL ON public.subjects TO service_role;
GRANT ALL ON public.units TO service_role;
GRANT ALL ON public.topics TO service_role;
GRANT ALL ON public.questions TO service_role;
GRANT ALL ON public.topic_progress TO service_role;
GRANT ALL ON public.question_attempts TO service_role;
GRANT ALL ON public.revision_sessions TO service_role;
GRANT ALL ON public.study_plans TO service_role;
GRANT ALL ON public.study_plan_items TO service_role;
GRANT ALL ON public.concept_nodes TO service_role;
GRANT ALL ON public.concept_edges TO service_role;

-- 6. RLS Policies
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public academic content is readable by all students" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public academic content is readable by all students" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public academic content is readable by all students" ON public.topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public academic content is readable by all students" ON public.questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public academic content is readable by all students" ON public.concept_nodes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public academic content is readable by all students" ON public.concept_edges FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users own their topic progress" ON public.topic_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own their question attempts" ON public.question_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own their revision sessions" ON public.revision_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own their study plans" ON public.study_plans FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users own their plan items" ON public.study_plan_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.study_plans WHERE id = study_plan_id AND user_id = auth.uid()));

-- 7. Triggers for updated_at
CREATE TRIGGER update_topic_progress_updated_at BEFORE UPDATE ON public.topic_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
