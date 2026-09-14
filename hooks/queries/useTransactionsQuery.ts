import { useSupabase } from "@/hooks/useSuperbase";
import { queryKeys } from "@/lib/query/keys";
import { getTransactions, TransactionsFilter } from "@/lib/services/transactions";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

export function useTransactionsQuery(filters: TransactionsFilter = {}) {
  const { user } = useUser();
  const supabase = useSupabase();

  return useQuery({
    queryKey: queryKeys.transactions(user?.id, filters),
    queryFn: () => getTransactions(supabase, user!.id, filters),
    enabled: !!user,
  });
}
