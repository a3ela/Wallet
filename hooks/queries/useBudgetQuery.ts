import { useSupabase } from "@/hooks/useSuperbase";
import { queryKeys } from "@/lib/query/keys";
import { getBudgets } from "@/lib/services/budgets";
import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";

export function useAccountsQuery() {
  const { user } = useUser();
  const supabase = useSupabase();

  return useQuery({
    queryKey: queryKeys.accounts(user?.id),
    queryFn: () => getBudgets(supabase, user!.id),
    enabled: !!user,
  });
}