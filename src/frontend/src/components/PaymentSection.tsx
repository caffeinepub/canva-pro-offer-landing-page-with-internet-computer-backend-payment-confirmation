import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useUrgencySlots } from '../hooks/useUrgencySlots';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { PAYMENT_CONFIG } from '../config/payment';

interface PaymentSectionProps {
  submissionId: bigint;
  onSuccess: () => void;
}

export default function PaymentSection({ submissionId, onSuccess }: PaymentSectionProps) {
  const { actor } = useActor();
  const { refetch: refetchSlots } = useUrgencySlots();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsPaid = async () => {
    if (!actor) {
      setError('Connection error. Please try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await actor.markAsPaid(submissionId);
      await refetchSlots();
      onSuccess();
    } catch (err) {
      console.error('Payment confirmation error:', err);
      setError('Failed to confirm payment. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          Complete Your Payment
        </CardTitle>
        <CardDescription>
          Scan the QR code or use the payment link below to complete your purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
          <AlertDescription className="text-sm">
            <strong>Amount to Pay:</strong> ₹299 for 1 Year Canva Pro Subscription
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src="/assets/generated/payment-qr.dim_512x512.png"
              alt="Payment QR Code"
              className="w-64 h-64 object-contain"
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Or pay using this link:</p>
            <a
              href={PAYMENT_CONFIG.paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors"
            >
              Open Payment Link
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <Button
            onClick={handleMarkAsPaid}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-6 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Confirming Payment...
              </>
            ) : (
              'I Have Paid'
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Click this button only after completing the payment
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
