
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthenticated(true);
          navigate('/');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isAuthed = !!session;
        setIsAuthenticated(isAuthed);
        if (isAuthed) {
          navigate('/');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: t('login.invalidEmail'),
        description: t('login.enterValidEmail'),
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        throw error;
      }
      
      setOtpSent(true);
      toast({
        title: t('login.magicLinkSent'),
        description: t('login.checkEmail')
      });
      
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast({
        title: t('login.error'),
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinueAsGuest = () => {
    navigate('/');
  };

  // If still checking authentication status, show loading
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  // If authenticated, redirect to home (handled in useEffect)

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('login.title')}
          </CardTitle>
          <CardDescription className="text-center">
            {otpSent ? t('login.checkEmailForLink') : t('login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? t('login.sending') : t('login.sendMagicLink')}
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm">{t('login.magicLinkInfo')}</p>
              <Button
                onClick={() => setOtpSent(false)}
                variant="outline"
                className="mt-2"
              >
                {t('login.tryDifferentEmail')}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleContinueAsGuest}
          >
            {t('login.continueAsGuest')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
