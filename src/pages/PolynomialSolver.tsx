import React, { useState } from 'react';
import { Card, Button, Input, CopyButton } from '../components/ui';
import { MathDisplay } from '../components/MathDisplay';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

type PolyAction = 'simplify' | 'expand' | 'factor' | 'solve';

export const PolynomialSolver: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [action, setAction] = useState<PolyAction>('factor');
  const [solution, setSolution] = useState<{ answer: string, steps: string[] } | null>(null);
  const [error, setError] = useState('');
  const { addToHistory } = useAppContext();

  const handleCalculate = () => {
    if (!expression.trim()) return;
    try {
      setError('');
      let res = '';
      const steps: string[] = [];
      const parsed = nerdamer(expression);
      
      steps.push(`Original expression:`);
      steps.push(parsed.toTeX());

      if (action === 'simplify') {
        const sim = nerdamer(parsed.text());
        res = sim.text();
        steps.push(`Combine like terms to simplify:`);
        steps.push(sim.toTeX());
      } else if (action === 'expand') {
        const exp = (nerdamer as any).expand(parsed.text());
        res = exp.text();
        steps.push(`Distribute and expand the polynomial:`);
        steps.push(exp.toTeX());
      } else if (action === 'factor') {
        const fac = nerdamer(`factor(${parsed.text()})`);
        res = fac.text();
        steps.push(`Find common factors and group terms:`);
        steps.push(fac.toTeX());
      } else if (action === 'solve') {
        // assume equating to 0 if no '=' provided
        const eq = expression.includes('=') ? expression : `${expression} = 0`;
        const sol = (nerdamer as any).solveEquations(eq, 'x');
        if (Array.isArray(sol)) {
          res = sol.map(s => nerdamer(s).text()).join(', ');
          
          const hasComplex = res.includes('i');
          
          steps.push(`Set the equation to solve for x:`);
          steps.push(nerdamer(eq).toTeX());
          steps.push(hasComplex ? `The roots are (Complex roots):` : `The roots are:`);
          steps.push(`x = ${sol.map(s => nerdamer(s).toTeX()).join(', ')}`);
        } else {
          res = sol.toString();
        }
      }

      setSolution({ answer: res, steps });
      addToHistory({ problem: `${action}: ${expression}`, answer: res, module: 'polynomial' });
    } catch (err) {
      setError('Unable to read polynomial. Example: x^2 - 5x + 6');
      setSolution(null);
    }
  };

  const actions: { id: PolyAction; label: string }[] = [
    { id: 'simplify', label: 'Simplify' },
    { id: 'expand', label: 'Expand' },
    { id: 'factor', label: 'Factor' },
    { id: 'solve', label: 'Solve / Roots' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Polynomial Solver</h1>
        <p className="text-gray-500">Factor, expand, simplify, and solve polynomials.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex flex-wrap gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          {actions.map((act) => (
            <Button 
              key={act.id} 
              variant={action === act.id ? 'primary' : 'ghost'}
              onClick={() => setAction(act.id)}
              className={cn("flex-1 min-w-[100px] text-xs py-2 shadow-none border-none", action === act.id ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-500 hover:text-gray-900")}
            >
              {act.label}
            </Button>
          ))}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl flex items-center focus-within:ring-2 focus-within:ring-zinc-500 transition-all border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 flex-1">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {action === 'solve' ? 'Enter polynomial equation' : 'Enter polynomial'}
            </label>
            <input 
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder={action === 'solve' ? "x^2 - 5x + 6 = 0" : "x^2 - 5x + 6"}
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              className="text-xl font-mono text-gray-900 dark:text-gray-100 bg-transparent border-none w-full focus:ring-0 p-0 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
            />
          </div>
          <Button onClick={handleCalculate} variant="neon" className="py-4 px-6 rounded-xl">Calculate</Button>
        </div>
        {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
      </Card>

      {solution && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-[1.5] space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Final Result</h3>
                <CopyButton variant="ghost" className="text-zinc-600 text-xs font-semibold py-1 px-2 h-auto" text={solution.answer} />
              </div>
              <div className="text-4xl font-serif text-zinc-900 dark:text-zinc-400 flex items-baseline gap-2 mb-4 overflow-x-auto pb-2">
                <MathDisplay math={action === 'solve' ? (solution.answer.includes(',') ? `x = \\text{${solution.answer}}` : `x = ${nerdamer(solution.answer).toTeX()}`) : nerdamer(solution.answer).toTeX()} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Step-by-step Explanation</h3>
              <div className="space-y-4">
                {solution.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full flex items-center justify-center text-[10px] font-bold mt-1 shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 overflow-x-auto pb-2">
                      {step.includes('=') || step.includes('^') || step.includes('\\') || step.includes('x') ? (
                        <div className="text-sm font-serif italic mt-1 text-gray-600 dark:text-gray-300">
                          <MathDisplay math={step} />
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
