import React from 'react';
import { Card } from '../components/ui';
import { Calculator, FunctionSquare, Triangle, BarChart2, LineChart, ChevronRight } from 'lucide-react';
import { PageType } from '../components/Layout';
import { useAppContext } from '../context/AppContext';

export const Home: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const { history } = useAppContext();
  
  const tools = [
    { id: 'calculator', name: 'Scientific Calculator', desc: 'Perform advanced mathematical calculations.', icon: Calculator, color: 'bg-blue-500' },
    { id: 'polynomial', name: 'Polynomial Solver', desc: 'Factor, expand, simplify and solve polynomial equations.', icon: FunctionSquare, color: 'bg-purple-500' },
    { id: 'quadratic', name: 'Quadratic Solver', desc: 'Solve quadratic equations step by step.', icon: FunctionSquare, color: 'bg-indigo-500' },
    { id: 'angles', name: 'Angles & Trigonometry', desc: 'Solve triangles, angles and trigonometric problems.', icon: Triangle, color: 'bg-emerald-500' },
    { id: 'statistics', name: 'Statistics', desc: 'Calculate statistical measures and generate charts.', icon: BarChart2, color: 'bg-amber-500' },
    { id: 'graphing', name: 'Graphing Calculator', desc: 'Plot equations and visualize mathematical functions.', icon: LineChart, color: 'bg-rose-500' },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          What do you want to solve today?
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Calculate, solve, visualize and learn mathematics step by step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card 
            key={tool.id}
            className="p-1 cursor-pointer group hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-lg"
            onClick={() => onNavigate(tool.id as PageType)}
          >
            <div className="p-5 flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${tool.color}`}>
                  <tool.icon size={24} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900 group-hover:border-indigo-200 dark:group-hover:border-indigo-700 transition-colors">
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">{tool.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-auto">
                {tool.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {history.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Recent Problems</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {history.slice(0, 4).map((item) => (
              <Card key={item.id} className="p-4 flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/80 cursor-pointer transition-colors" onClick={() => onNavigate(item.module as PageType)}>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{item.module}</span>
                <div className="font-medium truncate text-gray-900 dark:text-gray-100">{item.problem}</div>
                <div className="text-sm text-gray-500 truncate mt-auto">Answer: {item.answer}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
