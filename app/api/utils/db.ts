import { createClient } from '@supabase/supabase-js';

// Tạo client Supabase với các cấu hình khác nhau cho từng subdomain
export function getSupabaseClient(subdomain: string) {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_KEY || '';
  
  const client = createClient(supabaseUrl, supabaseKey);
  
  // Sử dụng RLS (Row Level Security) để phân chia dữ liệu theo subdomain
  // Hoặc sử dụng schema khác nhau cho từng subdomain
  
  return client;
}

// Lưu tin nhắn vào cơ sở dữ liệu
export async function saveMessage(subdomain: string, message: string, isBot: boolean) {
  const supabase = getSupabaseClient(subdomain);
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      subdomain,
      message,
      is_bot: isBot,
      created_at: new Date().toISOString(),
    });
    
  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
  
  return data;
}

// Lấy lịch sử tin nhắn từ cơ sở dữ liệu
export async function getMessageHistory(subdomain: string, limit = 50) {
  const supabase = getSupabaseClient(subdomain);
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('subdomain', subdomain)
    .order('created_at', { ascending: true })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching message history:', error);
    throw error;
  }
  
  return data;
} 