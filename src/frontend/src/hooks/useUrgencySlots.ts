import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useUrgencySlots() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['urgencySlots'],
    queryFn: async () => {
      if (!actor) return BigInt(3);
      return actor.getRemainingUrgencySlots();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Refetch every 10 seconds to keep slots updated
  });
}
