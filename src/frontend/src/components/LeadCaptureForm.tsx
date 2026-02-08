import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useBackendConnectivity } from '../hooks/useBackendConnectivity';
import { normalizeActorError, logActorError } from '../utils/actorError';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import BackendConnectivityBanner from './BackendConnectivityBanner';

interface LeadCaptureFormProps {
  onSuccess: (submissionId: bigint) => void;
}

export default function LeadCaptureForm({ onSuccess }: LeadCaptureFormProps) {
  const { actor } = useActor();
  const connectivity = useBackendConnectivity();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{
    message: string;
    details: string;
  } | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp number is required';
    } else if (!/^\d{10}$/.test(formData.whatsapp.replace(/\D/g, ''))) {
      newErrors.whatsapp = 'Please enter a valid 10-digit number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!actor) {
      const errorInfo = {
        message: 'Service connection not available. Please refresh the page and try again.',
        details: 'Actor is null - backend connection not initialized',
      };
      setSubmitError(errorInfo);
      console.error('❌ Submission failed: Actor not available');
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitError(null);

    try {
      console.log('📤 Submitting lead capture form...', {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        hasActor: !!actor,
      });

      const submissionId = await actor.createSubmission(
        formData.name,
        formData.email,
        formData.whatsapp
      );

      console.log('✅ Submission successful:', submissionId);
      onSuccess(submissionId);
    } catch (error) {
      // Normalize and log the error with full context
      const normalized = logActorError('Lead Form Submission', error, {
        hasActor: !!actor,
        formData: {
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
        },
      });

      setSubmitError({
        message: normalized.userMessage,
        details: normalized.rawError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BackendConnectivityBanner
        isReachable={connectivity.isReachable}
        isChecking={connectivity.isChecking}
        hasError={connectivity.hasError}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Get Your Canva Pro Access</CardTitle>
          <CardDescription>Fill in your details below to proceed with your order</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="9876543210"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className={errors.whatsapp ? 'border-destructive' : ''}
              />
              {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
            </div>

            {submitError && (
              <Alert variant="destructive">
                <AlertDescription className="space-y-2">
                  <p className="font-medium">{submitError.message}</p>
                  <details className="mt-2">
                    <summary
                      className="cursor-pointer text-sm flex items-center gap-1 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowErrorDetails(!showErrorDetails);
                      }}
                    >
                      {showErrorDetails ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          Hide technical details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          Show technical details
                        </>
                      )}
                    </summary>
                    {showErrorDetails && (
                      <pre className="mt-2 text-xs bg-destructive/10 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                        {submitError.details}
                      </pre>
                    )}
                  </details>
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
