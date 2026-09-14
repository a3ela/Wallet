import type { TransactionsFilter } from "@/lib/services/transactions";

export const queryKeys = {
  accounts: (userId?: string) => ["accounts", userId] as const,
  transactions: (userId?: string, filters: TransactionsFilter = {}) =>
    ["transactions", userId, filters] as const,
  budget: (userId?: string) => ["budget", userId] as const,
};
