import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';

interface Equation {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
}

const colors = ['#4f46e5', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const GraphingCalculator: React.FC = () => {
  const [equations, setEquations] = useState<Equation[]>([
    { id: '1', expr: 'x^2', color: colors[0], visible: true }
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const { theme, addToHistory } = useAppContext();

  const handleAdd = () => {
    if (!input.trim()) return;
    try {
      // Test evaluation
      const compiled = math.compile(input);
      compiled.evaluate({ x: 1 });
      
      const newEq = {
        id: crypto.randomUUID(),
        expr: input,
        color: colors[equations.length % colors.length],
        visible: true
      };
      
      setEquations([...equations, newEq]);
      setInput('');
      setError('');
      
      addToHistory({
        problem: `Graph: y = ${input}`,
        answer: 'Plotted successfully',
        module: 'graphing'
      });
    } catch (err) {
      setError('Invalid equation. Use "x" as the variable (e.g., x^2 + 2x).');
    }
  };

  const removeEq = (id: string) => {
    setEquations(equations.filter(eq => eq.id !== id));
  };

  const toggleVisibility = (id: string) => {
    setEquations(equations.map(eq => eq.id === id ? { ...eq, visible: !eq.visible } : eq));
  };

  // Generate data for plotly
  const data = equations.filter(eq => eq.visible).map(eq => {
    const xValues = [];
    const yValues = [];
    
    try {
      const compiled = math.compile(eq.expr);
      // Generate points from -20 to 20
      for (let x = -20; x <= 20; x += 0.1) {
        xValues.push(x);
        try {
          const y = compiled.evaluate({ x });
          yValues.push(y);
        } catch (e) {
          yValues.push(null);
        }
      }
    } catch (e) {
      // Skip invalid
    }

    return {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: `y = ${eq.expr}`,
      line: { color: eq.color, width: 2 }
    };
  });

  const layout = {
    autosize: true,
    plot_bgcolor: theme === 'dark' ? '#111827' : '#ffffff',
    paper_bgcolor: theme === 'dark' ? '#111827' : '#ffffff',
    font: { color: theme === 'dark' ? '#9ca3af' : '#4b5563' },
    margin: { l: 40, r: 20, t: 40, b: 40 },
    xaxis: { 
      title: 'x', 
      gridcolor: theme === 'dark' ? '#374151' : '#f3f4f6',
      zerolinecolor: theme === 'dark' ? '#6b7280' : '#9ca3af',
      zerolinewidth: 2,
    },
    yaxis: { 
      title: 'y', 
      gridcolor: theme === 'dark' ? '#374151' : '#f3f4f6',
      zerolinecolor: theme === 'dark' ? '#6b7280' : '#9ca3af',
      zerolinewidth: 2,
    },
    showlegend: true,
    legend: { x: 0, y: 1 }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Graphing Calculator</h1>
        <p className="text-gray-500">Plot equations and visualize mathematical functions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Add Equation (y = ...)</label>
              <div className="flex flex-col gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="x^2 - 4"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button onClick={handleAdd} variant="neon">Add to Graph</Button>
              </div>
              {error && <div className="text-red-500 text-xs font-medium mt-2">{error}</div>}
            </div>
            
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Equations</h3>
              {equations.length === 0 && <p className="text-sm text-gray-500 italic">No equations added.</p>}
              {equations.map(eq => (
                <div key={eq.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                  <button 
                    className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-opacity"
                    style={{ backgroundColor: eq.visible ? eq.color : 'transparent', border: `2px solid ${eq.color}` }}
                    onClick={() => toggleVisibility(eq.id)}
                  />
                  <div className="flex-1 truncate text-sm font-mono" style={{ opacity: eq.visible ? 1 : 0.5 }}>
                    y = {eq.expr}
                  </div>
                  <button onClick={() => removeEq(eq.id)} className="text-gray-400 hover:text-red-500 p-1">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 h-[500px] lg:h-[700px] border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <Plot
            data={data as any}
            layout={layout as any}
            config={{ responsive: true, scrollZoom: true }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>
    </div>
  );
};
