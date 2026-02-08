import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * Lightweight hook that checks backend connectivity without blocking the UI.
 * Uses a simple query call to verify the backend is reachable.
 */
export function useBackendConnectivity() {
  const { actor, isFetching: actorFetching } = useActor();

  const connectivityQuery = useQuery({
    queryKey: ['backend-connectivity'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not initialized');
      }

      try {
        // Use a simple query call that doesn't require authentication
        await actor.getRemainingUrgencySlots();
        return { reachable: true };
      } catch (error) {
        console.error('Backend connectivity check failed:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    retryDelay: 1000,
    // Don't refetch automatically - this is a one-time check on mount
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return {
    isReachable: connectivityQuery.isSuccess,
    isChecking: actorFetching || connectivityQuery.isLoading,
    hasError: connectivityQuery.isError,
    error: connectivityQuery.error,
  };
}
