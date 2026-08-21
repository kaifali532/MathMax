import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { MathDisplay } from '../components/MathDisplay';
import { useAppContext } from '../context/AppContext';

export const QuadraticSolver: React.FC = () => {
  const [params, setParams] = useState({ a: '', b: '', c: '' });
  const [solution, setSolution] = useState<{ d: number, dText: string, result: string, steps: string[] } | null>(null);
  const [error, setError] = useState('');
  const { addToHistory } = useAppContext();

  const handleSolve = () => {
    try {
      setError('');
      const a = parseFloat(params.a);
      const b = parseFloat(params.b);
      const c = parseFloat(params.c);

      if (isNaN(a) || isNaN(b) || isNaN(c)) {
        throw new Error('Please enter valid numbers for a, b, and c.');
      }
      if (a === 0) {
        throw new Error('Coefficient "a" cannot be 0 for a quadratic equation.');
      }

      const steps: string[] = [];
      steps.push(`Identify coefficients for $ax^2 + bx + c = 0$:`);
      steps.push(`a = ${a}, b = ${b}, c = ${c}`);

      const D = (b * b) - (4 * a * c);
      steps.push(`Calculate the Discriminant ($D = b^2 - 4ac$):`);
      steps.push(`D = (${b})^2 - 4(${a})(${c}) = ${D}`);

      let dText = '';
      let result = '';

      if (D > 0) {
        dText = 'Two real roots (D > 0)';
        const x1 = (-b + Math.sqrt(D)) / (2 * a);
        const x2 = (-b - Math.sqrt(D)) / (2 * a);
        result = `x = ${x1.toFixed(4)}, ${x2.toFixed(4)}`;
        steps.push(`Since D > 0, there are two distinct real roots.`);
        steps.push(`x = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{-(${b}) \\pm \\sqrt{${D}}}{2(${a})}`);
        steps.push(`x_1 = \\frac{${-b} + ${Math.sqrt(D).toFixed(4)}}{${2*a}} = ${x1.toFixed(4)}`);
        steps.push(`x_2 = \\frac{${-b} - ${Math.sqrt(D).toFixed(4)}}{${2*a}} = ${x2.toFixed(4)}`);
      } else if (D === 0) {
        dText = 'One repeated real root (D = 0)';
        const x = -b / (2 * a);
        result = `x = ${x.toFixed(4)}`;
        steps.push(`Since D = 0, there is exactly one real root.`);
        steps.push(`x = \\frac{-b}{2a} = \\frac{-(${b})}{2(${a})} = ${x.toFixed(4)}`);
      } else {
        dText = 'Two complex roots (D < 0)';
        const real = -b / (2 * a);
        const imag = Math.sqrt(Math.abs(D)) / (2 * a);
        const r = real === 0 ? '' : real.toFixed(4);
        const sign = imag >= 0 ? '+' : '-';
        const i = Math.abs(imag).toFixed(4);
        result = `x = ${r} ${sign} ${i}i, ${r} ${sign === '+' ? '-' : '+'} ${i}i`;
        steps.push(`Since D < 0, there are two complex roots.`);
        steps.push(`x = \\frac{-b \\pm i\\sqrt{|D|}}{2a}`);
        steps.push(`x = ${real.toFixed(4)} \\pm ${imag.toFixed(4)}i`);
      }

      setSolution({ d: D, dText, result, steps });
      addToHistory({ problem: `${a}x² + ${b}x + ${c} = 0`, answer: result, module: 'quadratic' });
    } catch (err: any) {
      setError(err.message || 'Invalid input');
      setSolution(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Quadratic Solver</h1>
        <p className="text-gray-500">Solve quadratic equations using the quadratic formula.</p>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Enter coefficients</h3>
        <p className="text-sm text-gray-500">For an equation in the form <MathDisplay math="ax^2 + bx + c = 0" /></p>
        
        <div className="flex gap-4 items-center">
          <Input type="number" value={params.a} onChange={e => setParams({...params, a: e.target.value})} placeholder="a" className="w-24 text-center font-mono text-lg" />
          <span className="text-xl font-medium font-mono text-gray-500">x² +</span>
          <Input type="number" value={params.b} onChange={e => setParams({...params, b: e.target.value})} placeholder="b" className="w-24 text-center font-mono text-lg" />
          <span className="text-xl font-medium font-mono text-gray-500">x +</span>
          <Input type="number" value={params.c} onChange={e => setParams({...params, c: e.target.value})} placeholder="c" className="w-24 text-center font-mono text-lg" />
          <span className="text-xl font-medium font-mono text-gray-500">= 0</span>
        </div>
        
        <div className="pt-2">
          <Button onClick={handleSolve} className="py-4 px-8 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none">Solve Quadratic</Button>
        </div>
        
        {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
      </Card>

      {solution && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-[1.5] space-y-6">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Discriminant (D)</h3>
                  <div className="text-xl font-medium font-mono text-gray-800 dark:text-gray-200">{solution.d}</div>
                  <div className="text-sm text-gray-500 mt-1">{solution.dText}</div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Result</h3>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {solution.result}
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Step-by-step Explanation</h3>
              <div className="space-y-4">
                {solution.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <div className="flex-1 overflow-x-auto pb-2 text-sm md:text-base">
                      {step.includes('$') || step.includes('\\') ? (
                        <div className="text-sm font-serif italic mt-1 text-gray-600 dark:text-gray-300">
                          <MathDisplay math={step.replace(/\$/g, '')} />
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{step}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
