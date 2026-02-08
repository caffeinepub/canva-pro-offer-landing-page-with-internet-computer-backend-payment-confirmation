import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock } from 'lucide-react';

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

        <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-lg p-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-xl text-amber-900 dark:text-amber-100">
              Access Timeline
            </h3>
          </div>
          <p className="text-lg font-medium text-amber-900 dark:text-amber-100">
            You will get access within 10 mins after checking your payment details
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-sm text-left">
          <h3 className="font-semibold text-base text-center">What to Expect</h3>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>We'll verify your payment details</li>
            <li>You'll receive your Canva Pro access via email and WhatsApp</li>
            <li>Your 1-year warranty starts from the date of activation</li>
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          If you have any questions, please contact our support team.
        </p>
      </CardContent>
    </Card>
  );
}
