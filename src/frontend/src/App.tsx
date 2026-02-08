import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Shield } from 'lucide-react';
import OfferDetails from './components/OfferDetails';
import LeadCaptureForm from './components/LeadCaptureForm';
import PaymentSection from './components/PaymentSection';
import PaymentConfirmation from './components/PaymentConfirmation';
import UrgencyBanner from './components/UrgencyBanner';
import AdminSubmissionsView from './components/AdminSubmissionsView';

type FlowStep = 'form' | 'payment' | 'confirmation';

export default function App() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const [currentStep, setCurrentStep] = useState<FlowStep>('form');
  const [submissionId, setSubmissionId] = useState<bigint | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleFormSuccess = (id: bigint) => {
    setSubmissionId(id);
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('confirmation');
  };

  const handleAuthToggle = async () => {
    if (isAuthenticated) {
      await clear();
      setShowAdmin(false);
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <Button onClick={() => setShowAdmin(false)} variant="outline">
              Back to Landing
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <AdminSubmissionsView />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
              CP
            </div>
            <span className="font-semibold text-lg">Canva Pro Offer</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button
                onClick={() => setShowAdmin(true)}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            )}
            <Button
              onClick={handleAuthToggle}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="gap-2"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <UrgencyBanner />
          
          <OfferDetails />

          {currentStep === 'form' && (
            <LeadCaptureForm onSuccess={handleFormSuccess} />
          )}

          {currentStep === 'payment' && submissionId !== null && (
            <PaymentSection
              submissionId={submissionId}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {currentStep === 'confirmation' && (
            <PaymentConfirmation />
          )}
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
