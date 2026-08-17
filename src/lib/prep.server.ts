import { type SupabaseClient } from "@supabase/supabase-js";
import { type Database } from "@/integrations/supabase/types";

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

  // Selection Rate: prepared topics / total topics (simplification of the formula provided)
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
      topic:topics(id, name, importance, subject_id, unit_id)
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

