import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase is not configured.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function createOrder(order) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...order,
      created_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) throw new Error(`Supabase order insert failed: ${error.message}`);
  return data;
}

export async function getNextOrderNumber() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('orders').select('order_number').order('created_at', { ascending: false }).limit(1);
  if (error) throw new Error(`Supabase order number lookup failed: ${error.message}`);
  const lastNumber = Number(data?.[0]?.order_number?.replace(/\D/g, '') ?? 1000);
  return lastNumber + 1;
}

export async function listOrders() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(`Supabase order query failed: ${error.message}`);
  return data;
}

export async function updateOrderStatus(id, status) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select('*').single();
  if (error) throw new Error(`Supabase order update failed: ${error.message}`);
  return data;
}
