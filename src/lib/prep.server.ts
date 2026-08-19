import { type SupabaseClient } from "@supabase/supabase-js";
import { type Database } from "@/integrations/supabase/types";
import { addDays, format, differenceInDays, startOfDay } from 'date-fns';

export type PrepAnalytics = {
  readiness: number;
  topicCoverage: number;
  questionAccuracy: number;
  revisionConsistency: number;
  priorityCoverage: number;
  selectionRate: number;
  revisionKpi: 'ACTIVE' | 'INACTIVE';
  recommendation: string;
};

export async function getPrepAnalytics(supabase: SupabaseClient<Database>, userId: string): Promise<PrepAnalytics> {
  // 1. Fetch data in parallel
  const [
    { data: topics },
    { data: progress },
    { data: attempts },
    { data: revisions }
  ] = await Promise.all([
    supabase.from('topics').select('id, importance'),
    supabase.from('topic_progress').select('*').eq('user_id', userId),
    supabase.from('question_attempts').select('*').eq('user_id', userId),
    supabase.from('revision_sessions').select('*').eq('user_id', userId)
  ]);

  if (!topics || topics.length === 0) {
    return {
      readiness: 0,
      topicCoverage: 0,
      questionAccuracy: 0,
      revisionConsistency: 0,
      priorityCoverage: 0,
      selectionRate: 0,
      revisionKpi: 'INACTIVE',
      recommendation: "Start your first unit to calculate readiness."
    };
  }

  // 2. Calculations
  const totalTopics = topics.length;
  const masteredTopics = progress?.filter(p => p.status === 'mastered').length || 0;
  const topicCoverage = Math.round((masteredTopics / totalTopics) * 100);

  const totalAttempts = attempts?.length || 0;
  const correctAttempts = attempts?.filter(a => a.is_correct).length || 0;
  const questionAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  const priorityTopics = topics.filter(t => (t.importance || 0) > 0.7);
  const masteredPriority = progress?.filter(p => 
    p.status === 'mastered' && 
    priorityTopics.some(pt => pt.id === p.topic_id)
  ).length || 0;
  const priorityCoverage = priorityTopics.length > 0 ? Math.round((masteredPriority / priorityTopics.length) * 100) : 0;

  // Selection Rate: prepared topics / total topics
  const selectionRate = Math.round(((progress?.length || 0) / totalTopics) * 100);

  // Revision KPI
  const recentRevisions = revisions?.filter(r => {
    const d = new Date(r.completed_at);
    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length || 0;
  const revisionKpi = recentRevisions > 0 ? 'ACTIVE' : 'INACTIVE';
  
  // Consistency: percent of mastered topics revised in last 14 days
  const revisedMastered = progress?.filter(p => 
    p.status === 'mastered' && 
    p.last_revised_at && 
    (Date.now() - new Date(p.last_revised_at).getTime()) < 14 * 24 * 60 * 60 * 1000
  ).length || 0;
  const revisionConsistency = masteredTopics > 0 ? Math.round((revisedMastered / masteredTopics) * 100) : 0;

  // Readiness: weighted average
  const readiness = Math.round((topicCoverage * 0.4) + (questionAccuracy * 0.3) + (priorityCoverage * 0.2) + (revisionConsistency * 0.1));

  // Recommendation logic
  let recommendation = "You're making steady progress. ";
  const weakTopic = progress?.find(p => p.status === 'weak');
  if (readiness < 30) {
    recommendation = "Complete your first practice session to calculate your readiness score.";
  } else if (priorityCoverage < 50) {
    recommendation = "Priority Alert: Focus on high-weightage topics next.";
  } else if (weakTopic) {
    recommendation = `You're ${readiness}% ready. Focus next on mastering your weak topics.`;
  } else {
    recommendation = `You're ${readiness}% ready. Keep up the revision consistency!`;
  }

  return {
    readiness,
    topicCoverage,
    questionAccuracy,
    revisionConsistency,
    priorityCoverage,
    selectionRate,
    revisionKpi,
    recommendation
  };
}

export async function handleGetQuestionBank(
  supabase: SupabaseClient<Database>,
  userId: string,
  filter: { subject?: string | undefined; unit?: string | undefined }
) {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      topic:topics(id, title, importance, subject_id, unit_id, marks_weightage, exam_frequency)
    `);

  if (error) throw error;
  return data;
}

export async function handleGetTopics(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await supabase
    .from('topics')
    .select(`
      *,
      progress:topic_progress(*)
    `);

  if (error) throw error;
  return data;
}

export async function handleUpdateTopicMastery(
  supabase: SupabaseClient<Database>,
  userId: string,
  data: { topicId: string; masteryScore: number }
) {
  const { data: updated, error } = await supabase
    .from('topic_progress')
    .upsert({
      user_id: userId,
      topic_id: data.topicId,
      mastery_score: data.masteryScore,
      status: data.masteryScore > 80 ? 'mastered' : data.masteryScore > 40 ? 'learning' : 'weak',
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return updated;
}

export async function handleGetUnits(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('units')
    .select('id, unit_number, title, subject:subjects(id, code, name)')
    .order('unit_number');
  if (error) throw error;
  return data ?? [];
}

export async function handleGetStudyPlan(supabase: SupabaseClient<Database>, userId: string) {
  const { data: plans, error } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  const plan = plans?.[0];
  if (!plan) return null;

  const { data: items, error: itemsError } = await supabase
    .from('study_plan_items')
    .select('*, topic:topics(id, title, importance, unit_id)')
    .eq('study_plan_id', plan.id)
    .order('scheduled_date');
  if (itemsError) throw itemsError;

  return { plan, items: items ?? [] };
}

export async function handleToggleStudyTask(
  supabase: SupabaseClient<Database>,
  userId: string,
  data: { itemId: string; completed: boolean }
) {
  const { data: updated, error } = await supabase
    .from('study_plan_items')
    .update({
      completed: data.completed,
      completed_at: data.completed ? new Date().toISOString() : null,
    })
    .eq('id', data.itemId)
    .select('*, topic:topics(id, title, importance, unit_id)')
    .single();
  if (error) throw error;

  if (data.completed && updated?.topic_id) {
    await supabase.from('revision_sessions').insert({
      user_id: userId,
      topic_id: updated.topic_id,
      duration_minutes: updated.duration_minutes ?? 60,
    });
  }
  return updated;
}

export async function handleGeneratePlan(
  supabase: SupabaseClient<Database>,
  userId: string,
  config: { examDate: string; dailyHours: number; units: string[]; level: string }
) {
  const examDate = startOfDay(new Date(config.examDate));
  const today = startOfDay(new Date());
  const daysAvailable = differenceInDays(examDate, today);

  if (daysAvailable <= 0) {
    throw new Error("Exam date must be in the future");
  }

  let query = supabase.from('topics').select('*, progress:topic_progress(*)');
  if (config.units.length > 0) query = query.in('unit_id', config.units);
  const { data: topics, error } = await query;

  if (error) throw error;
  if (!topics || topics.length === 0) {
    throw new Error("No topics found for the selected units. Upload your notes first.");
  }

  const prioritized = [...topics].sort((a, b) => {
    const aMastery = (a as any).progress?.[0]?.mastery_score || 0;
    const bMastery = (b as any).progress?.[0]?.mastery_score || 0;
    return ((b.importance || 0.5) * (1 - bMastery / 100)) - ((a.importance || 0.5) * (1 - aMastery / 100));
  });

  // Reset any previous plan so the schedule stays unique per student
  const { data: oldPlans } = await supabase.from('study_plans').select('id').eq('user_id', userId);
  const oldIds = (oldPlans ?? []).map((p) => p.id);
  if (oldIds.length > 0) {
    await supabase.from('study_plan_items').delete().in('study_plan_id', oldIds);
    await supabase.from('study_plans').delete().in('id', oldIds);
  }

  const { data: plan, error: planError } = await supabase
    .from('study_plans')
    .insert({
      user_id: userId,
      exam_date: config.examDate,
      study_hours_per_day: config.dailyHours,
      preparation_level: config.level,
    })
    .select()
    .single();
  if (planError) throw planError;

  const minutesPerDay = Math.max(30, Math.round(config.dailyHours * 60));
  const topicsPerDay = Math.max(1, Math.ceil(prioritized.length / daysAvailable));
  const slotMinutes = Math.max(20, Math.floor(minutesPerDay / topicsPerDay));

  const items = prioritized.map((t, index) => {
    const dayOffset = Math.floor(index / topicsPerDay);
    return {
      study_plan_id: plan.id,
      topic_id: t.id,
      scheduled_date: format(addDays(today, dayOffset), 'yyyy-MM-dd'),
      duration_minutes: slotMinutes,
      priority: (t.importance || 0.5) > 0.7 ? 'high' : (t.importance || 0.5) > 0.4 ? 'medium' : 'low',
      completed: false,
    };
  });

  const { error: itemsError } = await supabase.from('study_plan_items').insert(items);
  if (itemsError) throw itemsError;

  return handleGetStudyPlan(supabase, userId);
}

export async function handleGetQuestionSolution(
  supabase: SupabaseClient<Database>,
  data: { questionId: string },
) {
  const { data: question, error } = await supabase
    .from('questions')
    .select('*, topic:topics(id, title)')
    .eq('id', data.questionId)
    .single();
  if (error || !question) throw new Error('Question not found');

  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error('AI is not configured');

  const marks = question.marks ?? 13;
  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash',
      messages: [
        {
          role: 'system',
          content:
            'You are an Anna University exam evaluator. Write accurate model answers in plain text with simple dash bullets. Never claim a question will definitely appear in an exam.',
        },
        {
          role: 'user',
          content: `Topic: ${(question as any).topic?.title ?? 'General'}
Marks: ${marks}
Question: ${question.question_text}

Write a ${marks}-mark model answer with: Definition, Key points, Steps/derivation (if any), Diagram description (if relevant), and 5-8 keywords the examiner looks for.`,
        },
      ],
    }),
  });

  if (res.status === 429) throw new Error('AI rate limit reached. Please try again in a minute.');
  if (res.status === 402) throw new Error('AI credits exhausted. Please top up to continue.');
  if (!res.ok) throw new Error(`AI request failed (${res.status})`);

  const json = await res.json();
  const answer = (json?.choices?.[0]?.message?.content as string) ?? '';
  if (!answer.trim()) throw new Error('AI returned an empty answer');
  return { answer, question };
}

export async function handleRecordAttempt(
  supabase: SupabaseClient<Database>,
  userId: string,
  data: { questionId: string; isCorrect: boolean; confidence?: number | undefined },
) {
  const { data: inserted, error } = await supabase
    .from('question_attempts')
    .insert({
      user_id: userId,
      question_id: data.questionId,
      is_correct: data.isCorrect,
      confidence: data.confidence ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return inserted;
}
