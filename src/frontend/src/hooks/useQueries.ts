import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Submission } from '../backend';

export function useGetAllSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<Submission[]>({
    queryKey: ['submissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; whatsapp: string }) => {
      if (!actor) {
        throw new Error('Backend actor not initialized');
      }
      return actor.createSubmission(data.name, data.email, data.whatsapp);
    },
    onSuccess: () => {
      // Invalidate submissions query to refetch data
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}

export function useMarkAsPaid() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: bigint) => {
      if (!actor) {
        throw new Error('Backend actor not initialized');
      }
      return actor.markAsPaid(submissionId);
    },
    onSuccess: () => {
      // Invalidate submissions query to refetch data
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}
