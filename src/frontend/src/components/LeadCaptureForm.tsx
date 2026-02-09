import { useState } from 'react';
import { useCreateSubmission } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { normalizeActorError } from '../utils/actorError';
import BackendConnectivityBanner from './BackendConnectivityBanner';
import { useBackendConnectivity } from '../hooks/useBackendConnectivity';

interface LeadCaptureFormProps {
  onSuccess: (submissionId: bigint) => void;
}

export default function LeadCaptureForm({ onSuccess }: LeadCaptureFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const createSubmission = useCreateSubmission();
  const { isReachable, isChecking, hasError } = useBackendConnectivity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('📝 Form submission started:', { name, email, whatsapp });

    try {
      const submissionId = await createSubmission.mutateAsync({
        name,
        email,
        whatsapp,
      });

      console.log('✅ Submission created successfully:', submissionId);
      onSuccess(submissionId);
    } catch (error) {
      console.error('❌ Submission failed:', error);
    }
  };

  const isFormValid = name.trim() && email.trim() && whatsapp.trim();
  const isSubmitting = createSubmission.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Get Your Canva Pro Access</CardTitle>
        <CardDescription>Fill in your details below to proceed with your order</CardDescription>
      </CardHeader>
      <CardContent>
        <BackendConnectivityBanner
          isReachable={isReachable}
          isChecking={isChecking}
          hasError={hasError}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number *</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="10-digit mobile number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {createSubmission.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Submission Failed</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>{normalizeActorError(createSubmission.error).userMessage}</p>
                  <button
                    type="button"
                    onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                    className="flex items-center gap-1 text-xs underline hover:no-underline"
                  >
                    {showTechnicalDetails ? (
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
                  </button>
                  {showTechnicalDetails && (
                    <pre className="text-xs bg-destructive/10 p-2 rounded overflow-x-auto">
                      {normalizeActorError(createSubmission.error).technicalDetails}
                    </pre>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Continue to Payment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
