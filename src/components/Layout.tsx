import React, { useState } from 'react';
import { Menu, X, Home, Calculator, FunctionSquare, Triangle, BarChart2, LineChart, BookOpen, History, Settings, HelpCircle, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

export type PageType = 'home' | 'calculator' | 'algebra' | 'polynomial' | 'quadratic' | 'angles' | 'statistics' | 'graphing' | 'formulas' | 'history';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'algebra', label: 'Algebra', icon: FunctionSquare },
  { id: 'polynomial', label: 'Polynomials', icon: FunctionSquare },
  { id: 'quadratic', label: 'Quadratic Solver', icon: FunctionSquare },
  { id: 'angles', label: 'Angles & Trig', icon: Triangle },
  { id: 'statistics', label: 'Statistics', icon: BarChart2 },
  { id: 'graphing', label: 'Graphing', icon: LineChart },
  { id: 'formulas', label: 'Formula Library', icon: BookOpen },
  { id: 'history', label: 'History', icon: History },
] as const;

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useAppContext();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-sm">M</div>
          <span className="font-semibold text-lg">MathStudio</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-40 transition-transform duration-300 ease-in-out shrink-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic text-lg shadow-sm">M</div>
            <h1 className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">MathStudio</h1>
          </div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none">Student Toolkit</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 md:py-0 px-3 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Core Tools</div>
          {navItems.slice(0, 8).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as PageType);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group duration-200",
                currentPage === item.id 
                  ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-indigo-100 dark:border-indigo-800" 
                  : "text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:translate-x-1"
              )}
            >
              <item.icon size={20} className={currentPage === item.id ? "" : "opacity-70"} />
              {item.label}
            </button>
          ))}
          <div className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Library</div>
          {navItems.slice(8).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as PageType);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group duration-200",
                currentPage === item.id 
                  ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-indigo-100 dark:border-indigo-800" 
                  : "text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:translate-x-1"
              )}
            >
              <item.icon size={20} className={currentPage === item.id ? "" : "opacity-70"} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <button 
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <button className="flex-1 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Help</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0">
        <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation (Optional, keeping simple with sidebar for now as requested, but sidebar acts as hamburger menu) */}
    </div>
  );
};
