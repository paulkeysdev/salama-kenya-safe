import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          toast({
            title: "Welcome to Salama Kenya Safe!",
            description: "You are now logged in to your safety network.",
          });
          navigate('/');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary-glow/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="bg-primary rounded-full p-4 mx-auto w-fit">
            <Shield className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Salama Kenya Safe</h1>
            <p className="text-muted-foreground mt-2">
              Your personal safety network
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
            <AlertTriangle className="h-5 w-5 text-emergency" />
            <span className="text-sm">Emergency alert system</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
            <Users className="h-5 w-5 text-accent" />
            <span className="text-sm">Trusted contacts network</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm">Real-time safety features</span>
          </div>
        </div>

        {/* Auth Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In or Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary-glow))',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 rounded-md font-medium transition-colors',
                  input: 'w-full px-3 py-2 border rounded-md',
                },
              }}
              theme="light"
              providers={[]}
              redirectTo={`${window.location.origin}/`}
              onlyThirdPartyProviders={false}
              magicLink={false}
              showLinks={true}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          By signing up, you agree to keep your safety information secure and up-to-date.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;