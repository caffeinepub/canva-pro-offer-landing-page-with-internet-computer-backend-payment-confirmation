/**
 * Utility to normalize unknown thrown values into actionable error information.
 * Helps diagnose whether failures are actor-creation, network/agent, or backend-trap related.
 */

export interface NormalizedError {
  userMessage: string;
  technicalDetails: string;
  category: 'actor-creation' | 'network-agent' | 'backend-trap' | 'unknown';
}

/**
 * Normalize any thrown error into a structured format with user-friendly message
 * and debugging details.
 */
export function normalizeActorError(error: unknown): NormalizedError {
  // Default values
  let userMessage = 'An unexpected error occurred. Please try again.';
  let technicalDetails = String(error);
  let category: NormalizedError['category'] = 'unknown';

  try {
    // Handle Error objects
    if (error instanceof Error) {
      technicalDetails = `${error.name}: ${error.message}\n${error.stack || ''}`;

      // Classify based on error message patterns
      const message = error.message.toLowerCase();

      if (
        message.includes('actor') ||
        message.includes('canister') ||
        message.includes('agent') ||
        message.includes('identity')
      ) {
        category = 'actor-creation';
        userMessage =
          'Failed to connect to the service. Please check your connection and try again.';
      } else if (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('timeout') ||
        message.includes('connection')
      ) {
        category = 'network-agent';
        userMessage =
          'Network error. Please check your internet connection and try again.';
      } else if (
        message.includes('trap') ||
        message.includes('reject') ||
        message.includes('unauthorized') ||
        message.includes('not found')
      ) {
        category = 'backend-trap';
        userMessage = 'The service rejected your request. Please try again or contact support.';
      }
    }
    // Handle string errors
    else if (typeof error === 'string') {
      technicalDetails = error;
      const lowerError = error.toLowerCase();

      if (lowerError.includes('trap') || lowerError.includes('reject')) {
        category = 'backend-trap';
        userMessage = 'The service rejected your request. Please try again or contact support.';
      } else if (lowerError.includes('network') || lowerError.includes('fetch')) {
        category = 'network-agent';
        userMessage =
          'Network error. Please check your internet connection and try again.';
      }
    }
    // Handle objects with message property
    else if (error && typeof error === 'object' && 'message' in error) {
      technicalDetails = JSON.stringify(error, null, 2);
      const message = String((error as any).message).toLowerCase();

      if (message.includes('trap') || message.includes('reject')) {
        category = 'backend-trap';
        userMessage = 'The service rejected your request. Please try again or contact support.';
      }
    }
  } catch (normalizationError) {
    console.error('Error during error normalization:', normalizationError);
    technicalDetails = `Original error: ${String(error)}\nNormalization error: ${String(normalizationError)}`;
  }

  return {
    userMessage,
    technicalDetails,
    category,
  };
}

/**
 * Log detailed error context to console for debugging.
 */
export function logActorError(
  context: string,
  error: unknown,
  additionalInfo?: Record<string, any>
) {
  const normalized = normalizeActorError(error);

  console.group(`🔴 Actor Error: ${context}`);
  console.error('Category:', normalized.category);
  console.error('User Message:', normalized.userMessage);
  console.error('Technical Details:', normalized.technicalDetails);
  if (additionalInfo) {
    console.error('Additional Info:', additionalInfo);
  }
  console.groupEnd();

  return normalized;
}
