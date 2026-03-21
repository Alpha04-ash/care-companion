import { createClient } from '@/utils/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'model';
  content: string;
}

export interface SessionAnalysis {
  id?: string;
  timestamp: string;
  moodScore: number;
  sleepQuality: number | null;
  painLevel: number | null;
  appetite: number | null;
  social: number | null;
  redFlags: string[];
  summary: string;
  transcript?: ChatMessage[];
}

export const saveSessionAnalysis = async (analysis: Omit<SessionAnalysis, 'timestamp'>) => {
  const supabase = createClient();
  if (!supabase.auth) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('sessions')
    .insert([{
      user_id: user.id,
      mood_score: analysis.moodScore,
      sleep_quality: analysis.sleepQuality,
      pain_level: analysis.painLevel,
      appetite: analysis.appetite,
      social: analysis.social,
      red_flags: analysis.redFlags,
      summary: analysis.summary,
      transcript: analysis.transcript
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSessionHistory = async (): Promise<SessionAnalysis[]> => {
  const supabase = createClient();
  if (!supabase.from) return [];

  const { data, error } = await supabase

  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }

  return data.map(s => ({
    id: s.id,
    timestamp: s.timestamp,
    moodScore: s.mood_score,
    sleepQuality: s.sleep_quality,
    painLevel: s.pain_level,
    appetite: s.appetite,
    social: s.social,
    redFlags: s.red_flags,
    summary: s.summary,
    transcript: s.transcript
  }));
};

export const getUserProfile = async () => {
  const supabase = createClient();
  if (!supabase.auth) return null;

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return data;
};

export const saveUserProfile = async (profile: { name: string; age: string; concerns: string }) => {
  const supabase = createClient();
  if (!supabase.auth) return null;

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      name: profile.name,
      age: parseInt(profile.age),
      concerns: profile.concerns,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const clearSessionHistory = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Sign out error:', error);
};
