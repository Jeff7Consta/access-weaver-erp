
import { supabase } from "@/integrations/supabase/client";
import { AnalyticsQuery, PowerBIReport, AnalyticsQueryResult } from "@/lib/types";

// Analytics Queries API
export const getAnalyticsQueries = async (): Promise<AnalyticsQuery[]> => {
  const { data, error } = await supabase
    .from('analytics_queries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform data to match AnalyticsQuery type
  return data.map(item => ({
    ...item,
    columns: item.columns ? item.columns : {}
  })) as AnalyticsQuery[];
};

export const getAnalyticsQueryById = async (id: string): Promise<AnalyticsQuery> => {
  const { data, error } = await supabase
    .from('analytics_queries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return {
    ...data,
    columns: data.columns ? data.columns : {}
  } as AnalyticsQuery;
};

export const createAnalyticsQuery = async (query: Omit<AnalyticsQuery, "id" | "created_at" | "updated_at">): Promise<AnalyticsQuery> => {
  const { data, error } = await supabase
    .from('analytics_queries')
    .insert(query)
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    columns: data.columns ? data.columns : {}
  } as AnalyticsQuery;
};

export const updateAnalyticsQuery = async (id: string, query: Partial<AnalyticsQuery>): Promise<AnalyticsQuery> => {
  const { data, error } = await supabase
    .from('analytics_queries')
    .update(query)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    columns: data.columns ? data.columns : {}
  } as AnalyticsQuery;
};

export const deleteAnalyticsQuery = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('analytics_queries')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const executeAnalyticsQuery = async (sqlQuery: string): Promise<AnalyticsQueryResult> => {
  const { data, error } = await supabase.functions.invoke('execute-query', {
    body: { query: sqlQuery }
  });

  if (error) throw error;
  if (data.error) throw data.error;

  return data as AnalyticsQueryResult;
};

// PowerBI Reports API
export const getPowerBIReports = async (): Promise<PowerBIReport[]> => {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PowerBIReport[];
};

export const getPowerBIReportById = async (id: string): Promise<PowerBIReport> => {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PowerBIReport;
};

export const createPowerBIReport = async (report: Omit<PowerBIReport, "id" | "created_at" | "updated_at">): Promise<PowerBIReport> => {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .insert(report)
    .select()
    .single();

  if (error) throw error;
  return data as PowerBIReport;
};

export const updatePowerBIReport = async (id: string, report: Partial<PowerBIReport>): Promise<PowerBIReport> => {
  const { data, error } = await supabase
    .from('powerbi_reports')
    .update(report)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PowerBIReport;
};

export const deletePowerBIReport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('powerbi_reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getPowerBIEmbedInfo = async (reportId: string): Promise<{ embedToken: string; embedUrl: string }> => {
  const { data, error } = await supabase.functions.invoke('powerbi-embed', {
    body: { reportId }
  });

  if (error) throw error;
  if (data.error) throw data.error;

  return data as { embedToken: string; embedUrl: string };
};
