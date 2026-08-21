import React, { useState } from 'react';
import { Card, Button, Input, CopyButton } from '../components/ui';
import { MathDisplay } from '../components/MathDisplay';
import { useAppContext } from '../context/AppContext';
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

export const AlgebraSolver: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [solution, setSolution] = useState<{ answer: string, steps: string[] } | null>(null);
  const [error, setError] = useState('');
  const { addToHistory } = useAppContext();

  const handleSolve = () => {
    if (!expression.trim()) return;
    try {
      setError('');
      // Basic formatting to ensure equations are parsed well
      let expr = expression;
      
      // Heuristic for linear / simple quadratic equations step-by-step
      const steps: string[] = [];
      steps.push(`Identify the equation:`);
      steps.push(nerdamer(expr).toTeX());

      let ans = '';
      if (expr.includes('=')) {
        // Solve equation
        const parts = expr.split('=');
        if (parts.length !== 2) throw new Error("Invalid equation");
        
        const diff = nerdamer(`expand((${parts[0]}) - (${parts[1]}))`);
        if (diff.variables().length === 0) {
          if (diff.eq(0)) {
            ans = 'Infinitely many solutions';
            steps.push(`The equation simplifies to 0 = 0`);
            steps.push(`Result: Infinitely many solutions`);
          } else {
            ans = 'No solution';
            steps.push(`The equation simplifies to a contradiction (${diff.text()} = 0)`);
            steps.push(`Result: No solution`);
          }
        } else {
          // Identify the variable
          const vars = diff.variables();
          const solveVar = vars.includes('x') ? 'x' : vars[0];
          
          let solutions;
          try {
            solutions = (nerdamer as any).solveEquations(expr, solveVar);
          } catch(e) {
            solutions = nerdamer(`solve(${expr}, ${solveVar})`);
          }
          
          if (Array.isArray(solutions)) {
            ans = solutions.map(s => nerdamer(s).text()).join(', ');
            steps.push(`Solve for ${solveVar}:`);
            steps.push(`${solveVar} = ${solutions.map(s => nerdamer(s).toTeX()).join(', ')}`);
          } else {
            const solText = solutions.text();
            // Handle returned array string from solve
            if (solText.startsWith('[') && solText.endsWith(']')) {
              const solArray = solText.slice(1, -1).split(',');
              ans = solArray.map((s: string) => nerdamer(s).text()).join(', ');
              steps.push(`Solve for ${solveVar}:`);
              steps.push(`${solveVar} = ${solArray.map((s: string) => nerdamer(s).toTeX()).join(', ')}`);
            } else {
              ans = solutions.toString();
              steps.push(`${solveVar} = ${nerdamer(solutions).toTeX()}`);
            }
          }
          
          // Verify
          steps.push(`Verification:`);
          try {
             // For single solutions we can easily verify
             if (!ans.includes(',')) {
                const verifiedLhs = nerdamer(parts[0], { [solveVar]: ans }).evaluate().text();
                const verifiedRhs = nerdamer(parts[1], { [solveVar]: ans }).evaluate().text();
                if (nerdamer(verifiedLhs).eq(nerdamer(verifiedRhs))) {
                   steps.push(`Substitute ${solveVar} = ${ans} back into the equation:`);
                   steps.push(`${verifiedLhs} = ${verifiedRhs} \\text{ ✓}`);
                } else {
                   steps.push(`Unable to verify solution.`);
                }
             } else {
                steps.push(`Multiple solutions found. Verification left as an exercise.`);
             }
          } catch(e) {
             steps.push(`Unable to verify solution.`);
          }
        }
      } else {
        // Just evaluate/simplify
        const res = nerdamer(expr);
        ans = res.text();
        steps.push(`Simplify the expression:`);
        steps.push(res.toTeX());
      }

      setSolution({ answer: ans, steps });
      addToHistory({ problem: expression, answer: ans, module: 'algebra' });
    } catch (err: any) {
      setError('Invalid mathematical expression. Please check your input.');
      setSolution(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Algebra Solver</h1>
        <p className="text-gray-500">Solve equations and simplify expressions.</p>
      </div>

      <Card className="p-1 flex items-center focus-within:ring-2 focus-within:ring-zinc-500 transition-all">
        <div className="px-6 py-4 flex-1">
          <div className="text-xs font-bold text-zinc-600 uppercase mb-1 tracking-widest">Input Expression</div>
          <input 
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="2x + 5 = 15"
            onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
            className="text-2xl font-mono text-gray-900 dark:text-gray-100 bg-transparent border-none w-full focus:ring-0 p-0 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
          />
        </div>
        <Button onClick={handleSolve} variant="neon" className="mr-1 py-6 px-8 rounded-xl">Solve Now</Button>
      </Card>
      
      {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}

      {solution && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-[1.5] space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Final Solution</h3>
                <CopyButton variant="ghost" className="text-zinc-600 text-xs font-semibold py-1 px-2 h-auto" text={solution.answer} />
              </div>
              <div className="text-4xl font-serif text-zinc-900 dark:text-zinc-400 flex items-baseline gap-2 mb-4 overflow-x-auto pb-2">
                <MathDisplay math={['No solution', 'Infinitely many solutions'].includes(solution.answer) ? `\\text{${solution.answer}}` : (solution.answer.includes(',') ? `x = \\text{${solution.answer}}` : (expression.includes('=') ? `x = ${nerdamer(solution.answer).toTeX()}` : nerdamer(solution.answer).toTeX()))} />
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
                      {step.includes('=') || step.includes('^') || step.includes('\\') ? (
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
