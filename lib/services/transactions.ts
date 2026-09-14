import { CategoryKey } from "@/constants/categories";
import { SupabaseClient } from "@supabase/supabase-js";
export type TransactionType = "INCOME" | "EXPENSE";
export type InputMethod = "MANUAL" | "RECEIPT_SCAN" | "VOICE";

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  type: TransactionType;
  amaount: number;
  category: CategoryKey;
  description: string | null;
  date: string;
  status: string;
  input_method: InputMethod;
  voice_transcript: string | null;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionsFilter = {
  type?: TransactionType | null;
  accountId?: string | null;
};

export async function getTransactions(
  superbase: SupabaseClient,
  userId: string,
  filter: TransactionsFilter = {},
) {
let query = superbase.from("transactions").select("*").eq("user_id", userId);

  if (filter.type) {
    query = query.eq("type", filter.type);
  }
  if (filter.accountId) {
    query = query.eq("account_id", filter.accountId);
  }
  const { data, error } = await query.order('date', { ascending: false });
}
