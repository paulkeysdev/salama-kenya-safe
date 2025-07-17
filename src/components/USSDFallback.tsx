import { Phone, Smartphone, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const USSDFallback = () => {
  const handleUSSDCall = (code: string) => {
    if ('navigator' in window && 'clipboard' in navigator) {
      navigator.clipboard.writeText(code).then(() => {
        // Try to open dialer
        window.location.href = `tel:${code}`;
      });
    } else {
      window.location.href = `tel:${code}`;
    }
  };

  const ussdCodes = [
    {
      provider: 'Safaricom',
      code: '*123#',
      description: 'Emergency assistance request'
    },
    {
      provider: 'Airtel',
      code: '*456#',
      description: 'Safety service activation'
    },
    {
      provider: 'Telkom',
      code: '*789#',
      description: 'Emergency support line'
    }
  ];

  return (
    <div className="space-y-6">
      <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        <AlertDescription className="text-orange-800 dark:text-orange-200">
          <strong>No Internet Connection</strong><br />
          Use USSD codes below to request help via your mobile network.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency USSD Codes
          </CardTitle>
          <CardDescription>
            These codes work without internet and send emergency requests through your mobile network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ussdCodes.map((ussd, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{ussd.provider}</h4>
                <p className="text-sm text-muted-foreground">{ussd.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUSSDCall(ussd.code)}
                className="font-mono"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                {ussd.code}
              </Button>
            </div>
          ))}

          <Alert>
            <AlertDescription className="text-sm">
              <strong>How to use:</strong><br />
              1. Tap any code above to open your phone dialer<br />
              2. Press the call button to send the USSD request<br />
              3. Follow the prompts that appear on your screen<br />
              4. Your location and emergency details will be sent via SMS
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Direct Emergency Numbers</CardTitle>
          <CardDescription>
            Standard emergency numbers that work in Kenya
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={() => window.location.href = 'tel:999'}
          >
            <Phone className="h-4 w-4 mr-2" />
            999 - Police Emergency
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={() => window.location.href = 'tel:911'}
          >
            <Phone className="h-4 w-4 mr-2" />
            911 - General Emergency
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => window.location.href = 'tel:1195'}
          >
            <Phone className="h-4 w-4 mr-2" />
            1195 - Gender Violence Helpline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};