
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogIn, LogOut } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useAppStore();
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured()) {
        const { data } = await supabase.auth.getSession();
        setIsLoggedIn(!!data.session);
        
        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setIsLoggedIn(!!session);
          }
        );
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } else {
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const routes = [
    { name: t('nav.dashboard'), path: '/' },
    { name: t('nav.inputs'), path: '/inputs' },
    { name: t('nav.scenarioLab'), path: '/scenario-lab' },
    { name: t('nav.sensitivity'), path: '/sensitivity' },
    { name: t('nav.investorPacket'), path: '/investor-packet' }
  ];
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
      // Mostrar un toast o mensaje de confirmación podría ser útil aquí
    }
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-brand-500">Sports-Med Financials</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {routes.map((route) => (
              <Link 
                key={route.path}
                to={route.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === route.path 
                    ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-200' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {route.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            
            {isLoggedIn !== null && (
              isLoggedIn ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('nav.login')}
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto pb-2 mt-2 space-x-2">
          {routes.map((route) => (
            <Link 
              key={route.path}
              to={route.path}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium ${
                location.pathname === route.path 
                  ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-200' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {route.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
