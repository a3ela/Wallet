import type { SupabaseClient } from "@supabase/supabase-js";

export type AccountType =
  | "CASH"
  | 'BANK" | "CREDIT_CARD" | "INVESTMENT" | "LOAN" | "OTHER";';

export type Account = {
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  is_default: boolean;
  created_at: string;
};

export async function getAccounts(superbase: SupabaseClient, userId: string) {
  const { data, error } = await superbase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Account[];
}
