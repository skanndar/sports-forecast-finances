
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme } = useAppStore();
  
  const routes = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inputs', path: '/inputs' },
    { name: 'Scenario Lab', path: '/scenario-lab' },
    { name: 'Sensitivity', path: '/sensitivity' },
    { name: 'Investor Packet', path: '/investor-packet' }
  ];
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
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
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
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
