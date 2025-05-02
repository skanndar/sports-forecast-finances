
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore } from "./lib/store";
import { supabase, isSupabaseConfigured } from './integrations/supabase/client';
import { loadScenarios } from './lib/scenarioService';
import { toast } from "./components/ui/use-toast";

// Import i18n
import './lib/i18n';

// Import pages
import DashboardPage from "./pages/DashboardPage";
import InputsPage from "./pages/InputsPage";
import ScenarioLabPage from "./pages/ScenarioLabPage";
import SensitivityPage from "./pages/SensitivityPage";
import InvestorPacketPage from "./pages/InvestorPacketPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Import components
import Navbar from "./components/layout/Navbar";

const queryClient = new QueryClient();

// Layout component that includes the navbar
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured()) {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
        if (!data.session) {
          navigate('/login');
        }
      } else {
        // Si Supabase no está configurado, permitimos el acceso sin autenticación
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
    
    // Añadir listener para cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isAuthed = !!session;
        setIsAuthenticated(isAuthed);
        if (!isAuthed && isSupabaseConfigured()) {
          navigate('/login');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Mostrar un cargador mientras verificamos la autenticación
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return <>{children}</>;
};

// Auth wrapper to check if user is logged in
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseInit, setIsSupabaseInit] = useState(false);
  
  useEffect(() => {
    const initSupabase = async () => {
      // Check if Supabase is configured
      if (isSupabaseConfigured()) {
        setIsSupabaseInit(true);
      } else {
        console.log('Supabase is not configured. Using local storage for scenarios.');
        // Show a toast to inform the user
        toast({
          title: "Usando modo local",
          description: "No se ha configurado Supabase. Los escenarios se guardarán localmente.",
          duration: 5000,
        });
        setIsLoading(false);
      }
    };
    
    initSupabase();
  }, []);
  
  // If Supabase is configured, check for existing session
  useEffect(() => {
    if (isSupabaseInit) {
      try {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state change:', event, session);
          setIsLoading(false);
        });
        
        // Initial session check
        const checkSession = async () => {
          try {
            const { data } = await supabase.auth.getSession();
            console.log('Current session:', data.session);
            setIsLoading(false);
          } catch (error) {
            console.error("Error checking Supabase session:", error);
            setIsLoading(false);
          }
        };
        
        checkSession();
        
        return () => {
          if (authListener?.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error("Error setting up auth listener:", error);
        setIsLoading(false);
      }
    }
  }, [isSupabaseInit]);
  
  if (isLoading && isSupabaseInit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Check for theme preference
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useAppStore();
  
  useEffect(() => {
    // Check for system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If theme is not set in store, default to system preference
    if (!theme) {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
    
    // Apply the theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, setTheme]);
  
  return <>{children}</>;
};

// Check for share link in URL
const ShareLinkHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a hash in the URL that might contain encoded settings
    if (location.hash && location.hash.length > 1) {
      try {
        // Extract the hash without the # symbol
        const encodedSettings = location.hash.substring(1);
        
        // Decode the settings
        const decodedSettings = JSON.parse(atob(encodedSettings));
        
        // Here you would update the app state with the decoded settings
        // For now, we'll just log them
        console.log('Decoded settings from share link:', decodedSettings);
        
        // Remove the hash from the URL
        navigate(location.pathname, { replace: true });
        
        // TODO: Update app state with the decoded settings
      } catch (error) {
        console.error('Failed to decode settings from share link:', error);
      }
    }
  }, [location.hash, navigate]);
  
  return null;
};

// Load saved scenarios on app init
const ScenarioLoader = () => {
  const { savedScenarios } = useAppStore();
  
  useEffect(() => {
    const initScenarios = async () => {
      try {
        const scenarios = await loadScenarios();
        // TODO: Update app state with loaded scenarios
        console.log('Loaded scenarios:', scenarios);
      } catch (error) {
        console.error('Error loading scenarios:', error);
      }
    };
    
    if (savedScenarios.length === 0) {
      initScenarios();
    }
  }, [savedScenarios]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthWrapper>
          <BrowserRouter>
            <ShareLinkHandler />
            <ScenarioLoader />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="inputs" element={<InputsPage />} />
                <Route path="scenario-lab" element={<ScenarioLabPage />} />
                <Route path="sensitivity" element={<SensitivityPage />} />
                <Route path="investor-packet" element={<InvestorPacketPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthWrapper>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
