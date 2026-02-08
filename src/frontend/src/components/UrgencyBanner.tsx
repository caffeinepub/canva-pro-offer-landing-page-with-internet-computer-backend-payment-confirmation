import { useUrgencySlots } from '../hooks/useUrgencySlots';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Loader2 } from 'lucide-react';

export default function UrgencyBanner() {
  const { data: remainingSlots, isLoading } = useUrgencySlots();

  if (isLoading) {
    return (
      <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription className="ml-2">Loading availability...</AlertDescription>
      </Alert>
    );
  }

  const slots = remainingSlots !== undefined ? Number(remainingSlots) : 3;

  return (
    <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-300 dark:border-amber-900 shadow-md">
      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="ml-2 font-semibold text-base text-amber-900 dark:text-amber-100">
        Only {slots} {slots === 1 ? 'slot' : 'slots'} left at this price!
      </AlertDescription>
    </Alert>
  );
}
