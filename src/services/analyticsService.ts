
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsQuery, AnalyticsQueryResult, PowerBIReport } from "@/lib/types";

// Analytics Queries
export async function getAnalyticsQueries(): Promise<AnalyticsQuery[]> {
  const { data, error } = await supabase
    .from('analytics_queries')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getAnalyticsQueryById(id: string): Promise<AnalyticsQuery | null> {
  const { data, error } = await supabase
    .from('analytics_queries')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createAnalyticsQuery(query: Omit<AnalyticsQuery, 'id' | 'created_at' | 'updated_at'>): Promise<AnalyticsQuery> {
  const { data, error } = await supabase
    .from('analytics_queries')
    .insert(query)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateAnalyticsQuery(id: string, query: Partial<Omit<AnalyticsQuery, 'id' | 'created_at' | 'updated_at'>>): Promise<AnalyticsQuery> {
  const { data, error } = await supabase
    .from('analytics_queries')
    .update(query)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteAnalyticsQuery(id: string): Promise<void> {
  const { error } = await supabase
    .from('analytics_queries')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Execute SQL query (this would be handled by a Supabase Edge Function in a real app)
export async function executeAnalyticsQuery(query: string): Promise<AnalyticsQueryResult> {
  // In a real app, this would call an Edge Function that safely executes SQL
  // For now, we'll mock the response
  return {
    data: [
      { id: 1, name: "Sample Data 1", value: 100 },
      { id: 2, name: "Sample Data 2", value: 200 },
      { id: 3, name: "Sample Data 3", value: 300 },
    ],
    columns: ["id", "name", "value"]
  };
}

// Power BI Reports
export async function getPowerBIReports(): Promise<PowerBIReport[]> {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getPowerBIReportById(id: string): Promise<PowerBIReport | null> {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createPowerBIReport(report: Omit<PowerBIReport, 'id' | 'created_at' | 'updated_at'>): Promise<PowerBIReport> {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .insert(report)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePowerBIReport(id: string, report: Partial<Omit<PowerBIReport, 'id' | 'created_at' | 'updated_at'>>): Promise<PowerBIReport> {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .update(report)
    .eq('id', id)
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function deletePowerBIReport(id: string): Promise<void> {
  const { error } = await supabase
    .from('powerbi_reports')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// PowerBI Embed Token Service
export async function getPowerBIEmbedInfo(reportId: string): Promise<{embedToken: string; embedUrl: string}> {
  // This would be handled by an Edge Function in production
  // For demo, return mock data
  return {
    embedToken: "mockToken123",
    embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}`
  };
}
