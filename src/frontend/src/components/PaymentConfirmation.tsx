import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Mail, MessageCircle } from 'lucide-react';

export default function PaymentConfirmation() {
  return (
    <Card className="shadow-lg border-2 border-emerald-200 dark:border-emerald-900/50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <CardTitle className="text-3xl text-emerald-600 dark:text-emerald-400">
          Payment Confirmed!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <p className="text-lg">
          Thank you for your purchase! Your Canva Pro subscription is being processed.
        </p>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-lg">What Happens Next?</h3>
          <div className="space-y-3 text-sm text-left">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p>
                You'll receive your Canva Pro access details via email within 24 hours
              </p>
            </div>
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p>
                We'll also send you a WhatsApp message with your subscription details
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p>
                Your 1-year warranty starts from the date of activation
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          If you have any questions, please contact our support team.
        </p>
      </CardContent>
    </Card>
  );
}
