import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface BackendConnectivityBannerProps {
  isReachable: boolean;
  isChecking: boolean;
  hasError: boolean;
}

/**
 * Non-blocking warning banner that shows when the backend is unreachable.
 * Uses shadcn/ui Alert component for consistent styling.
 */
export default function BackendConnectivityBanner({
  isReachable,
  isChecking,
  hasError,
}: BackendConnectivityBannerProps) {
  // Don't show anything while checking or if backend is reachable
  if (isChecking || isReachable) {
    return null;
  }

  // Show warning if there's an error
  if (hasError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Warning</AlertTitle>
        <AlertDescription>
          Unable to connect to the backend service. You can still fill out the form, but
          submission may fail. Please check your internet connection or try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
