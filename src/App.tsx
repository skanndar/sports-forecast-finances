
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "./lib/store";

// Import pages
import DashboardPage from "./pages/DashboardPage";
import InputsPage from "./pages/InputsPage";
import ScenarioLabPage from "./pages/ScenarioLabPage";
import SensitivityPage from "./pages/SensitivityPage";
import InvestorPacketPage from "./pages/InvestorPacketPage";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ShareLinkHandler />
          <Routes>
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
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
