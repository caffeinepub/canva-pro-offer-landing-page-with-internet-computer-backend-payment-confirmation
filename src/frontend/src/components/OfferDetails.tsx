import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Shield } from 'lucide-react';

export default function OfferDetails() {
  const features = [
    '420,000+ Premium Templates',
    'Remove Background in 1 Click',
    '100+ Million Premium Photos & Videos',
    'Magic Resize & Brand Kit',
    'Unlimited Cloud Storage',
    'Team Collaboration Tools',
    'Priority Support 24/7',
    'All Premium Fonts & Elements'
  ];

  return (
    <Card className="border-2 border-amber-200 dark:border-amber-900/50 shadow-xl bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="flex justify-center">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1.5 text-sm font-semibold">
            Limited Time Offer
          </Badge>
        </div>
        <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Canva Pro
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl md:text-6xl font-bold text-foreground">₹299</span>
            <div className="text-left">
              <div className="text-sm text-muted-foreground">for</div>
              <div className="text-lg font-semibold">1 Year</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl text-muted-foreground line-through">₹4,000</span>
            <Badge variant="destructive" className="text-sm font-bold">
              93% OFF
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
          <Shield className="h-5 w-5" />
          <span>1 Year Warranty Included</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">What You Get:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
