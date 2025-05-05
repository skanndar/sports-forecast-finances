
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { loadScenarios } from "@/lib/scenarioService";
import { useAppStore } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";

/* ---------- i18n ---------- */
import "@/lib/i18n";

/* ---------- páginas ---------- */
import DashboardPage from "@/pages/DashboardPage";
import InputsPage from "@/pages/InputsPage";
import ScenarioLabPage from "@/pages/ScenarioLabPage";
import SensitivityPage from "@/pages/SensitivityPage";
import InvestorPacketPage from "@/pages/InvestorPacketPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

/* ---------- componentes ---------- */
import Navbar from "@/components/layout/Navbar";

const queryClient = new QueryClient();

/* ------------------------------------------------------------------ */
/* 1 · Layout con navbar                                              */
/* ------------------------------------------------------------------ */
const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
  </div>
);

/* ------------------------------------------------------------------ */
/* 2 · Rutas protegidas                                               */
/* ------------------------------------------------------------------ */
const Protected = ({ children }: { children: React.ReactNode }) => {
  const [isAuthed, setAuthed] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      if (!isSupabaseConfigured()) return setAuthed(true);

      const { data } = await supabase.auth.getSession();
      if (data.session) setAuthed(true);
      else {
        setAuthed(false);
        navigate("/login");
      }
    };
    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
      if (!session) navigate("/login");
    });
    return () => sub?.subscription.unsubscribe();
  }, [navigate]);

  if (isAuthed === null)
    return <div className="grid place-items-center h-screen">Loading…</div>;

  return <>{children}</>;
};

/* ------------------------------------------------------------------ */
/* 3 · Tema (dark / light)                                            */
/* ------------------------------------------------------------------ */
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useAppStore();
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (!theme) setTheme(prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme, setTheme]);
  return <>{children}</>;
};

/* ------------------------------------------------------------------ */
/* 4 · Bootstrap: procesa #access_token y carga escenarios            */
/* ------------------------------------------------------------------ */
const AuthAndDataBootstrap = () => {
  const { setSavedScenarios, setActiveScenario } = useAppStore();
  const location = useLocation();

  /* 1 · procesa token de auth en la URL (si existe) */
  useEffect(() => {
    // Check for auth hash in the URL (#access_token=...)
    if (location.hash.includes("access_token")) {
      // Let Supabase handle the hash fragment
      supabase.auth.getSession().catch(console.error);
    }
  }, [location]);

  /* 2 · procesa share‑link en el hash (#<base64>) */
  useEffect(() => {
    if (location.hash.length > 1 && !location.hash.includes("access_token")) {
      try {
        const decoded = JSON.parse(atob(location.hash.substring(1)));
        console.log("decoded share settings", decoded);
        /* TODO: setear en el estado si lo necesitas */
      } catch {
        /* hash no era base64 válido — lo ignoramos */
      }
    }
  }, [location]);

  /* 3 · carga escenarios (Supabase o localStorage) */
  useEffect(() => {
    loadScenarios().then((list) => {
      setSavedScenarios(list);
      if (list.length) setActiveScenario(list[0]); // selecciona el primero
    });
  }, [setSavedScenarios, setActiveScenario]);

  return null;
};


/* ------------------------------------------------------------------ */
/* 5 · App raíz                                                       */
/* ------------------------------------------------------------------ */
export default function App() {
  /* aviso si Supabase no está configurado */
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Modo local",
        description:
          "Supabase no está configurado. Los escenarios se guardarán en tu navegador.",
        duration: 5000,
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthAndDataBootstrap />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                element={
                  <Protected>
                    <Layout />
                  </Protected>
                }
              >
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
}
