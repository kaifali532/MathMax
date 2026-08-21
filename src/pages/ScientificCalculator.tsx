import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, CopyButton } from '../components/ui';
import * as math from 'mathjs';
import { useAppContext } from '../context/AppContext';
import { Delete } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isRad, setIsRad] = useState(true);
  const [error, setError] = useState(false);
  const { addToHistory } = useAppContext();

  // Create a custom mathjs instance with angle mode support
  const evaluateExpression = useCallback((expr: string, radMode: boolean) => {
    try {
      if (!expr.trim()) return '';
      
      // For degree mode, we replace trig functions to convert inputs
      let evalExpr = expr;
      
      if (!radMode) {
        // Simple regex replace for trig functions in degree mode
        // Note: A more robust AST transform is better, but regex works for simple cases
        evalExpr = evalExpr.replace(/(sin|cos|tan)\(([^)]+)\)/g, '$1($2 deg)');
        evalExpr = evalExpr.replace(/(asin|acos|atan)\(([^)]+)\)/g, '($1($2) / deg)');
      }

      const res = math.evaluate(evalExpr);
      
      if (res === undefined || typeof res === 'function') return '';
      if (res === Infinity || res === -Infinity || Number.isNaN(Number(res))) {
        throw new Error('Division by zero is not allowed.');
      }
      
      // Format to avoid long decimals
      return math.format(res, { precision: 14 });
    } catch (err) {
      throw new Error('Invalid expression');
    }
  }, []);

  const calculate = useCallback(() => {
    if (!expression) return;
    try {
      setError(false);
      const res = evaluateExpression(expression, isRad);
      setResult(res.toString());
      if (res.toString() !== '') {
        addToHistory({
          problem: expression,
          answer: res.toString(),
          module: 'calculator'
        });
      }
    } catch (err: any) {
      setError(true);
      if (err.message && err.message.includes('Division by zero')) {
        setResult('Undefined: Division by zero');
      } else {
        setResult('Invalid expression');
      }
    }
  }, [expression, isRad, evaluateExpression, addToHistory]);

  const handleInput = (val: string) => {
    setError(false);
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
    setError(false);
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    if (/[0-9+\-*/.()^%]/.test(key)) {
      handleInput(key);
    } else if (key === 'Enter') {
      calculate();
    } else if (key === 'Backspace') {
      handleDelete();
    } else if (key === 'Escape') {
      handleClear();
    }
  }, [calculate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const buttons = [
    { label: 'sin', action: () => handleInput('sin(') },
    { label: 'cos', action: () => handleInput('cos(') },
    { label: 'tan', action: () => handleInput('tan(') },
    { label: 'DEG/RAD', action: () => setIsRad(!isRad), className: isRad ? 'text-indigo-600 font-bold' : 'text-gray-500 font-bold' },
    { label: 'Clear', action: handleClear, className: 'text-red-500' },
    
    { label: 'sin⁻¹', action: () => handleInput('asin(') },
    { label: 'cos⁻¹', action: () => handleInput('acos(') },
    { label: 'tan⁻¹', action: () => handleInput('atan(') },
    { label: '(', action: () => handleInput('(') },
    { label: ')', action: () => handleInput(')') },
    
    { label: 'log', action: () => handleInput('log10(') },
    { label: 'ln', action: () => handleInput('log(') },
    { label: '√', action: () => handleInput('sqrt(') },
    { label: '∛', action: () => handleInput('cbrt(') },
    { label: 'xʸ', action: () => handleInput('^') },
    
    { label: 'π', action: () => handleInput('pi') },
    { label: 'e', action: () => handleInput('e') },
    { label: '!', action: () => handleInput('!') },
    { label: 'x²', action: () => handleInput('^2') },
    { label: 'DEL', action: handleDelete, icon: Delete },
    
    { label: '7', action: () => handleInput('7'), variant: 'secondary' as const },
    { label: '8', action: () => handleInput('8'), variant: 'secondary' as const },
    { label: '9', action: () => handleInput('9'), variant: 'secondary' as const },
    { label: '÷', action: () => handleInput('/') },
    { label: '%', action: () => handleInput('%') },
    
    { label: '4', action: () => handleInput('4'), variant: 'secondary' as const },
    { label: '5', action: () => handleInput('5'), variant: 'secondary' as const },
    { label: '6', action: () => handleInput('6'), variant: 'secondary' as const },
    { label: '×', action: () => handleInput('*') },
    { label: '10ˣ', action: () => handleInput('10^') },
    
    { label: '1', action: () => handleInput('1'), variant: 'secondary' as const },
    { label: '2', action: () => handleInput('2'), variant: 'secondary' as const },
    { label: '3', action: () => handleInput('3'), variant: 'secondary' as const },
    { label: '−', action: () => handleInput('-') },
    { label: 'EXP', action: () => handleInput('E') },
    
    { label: '0', action: () => handleInput('0'), variant: 'secondary' as const, className: 'col-span-2' },
    { label: '.', action: () => handleInput('.'), variant: 'secondary' as const },
    { label: '+', action: () => handleInput('+') },
    { label: '=', action: calculate, variant: 'neon' as const },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Scientific Calculator</h1>
        <p className="text-gray-500">Perform advanced mathematical calculations.</p>
      </div>

      <Card className="p-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm rounded-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-[20px] p-6 mb-2 text-right min-h-[140px] flex flex-col justify-end overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-700 mx-1 mt-1">
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md text-gray-500 dark:text-gray-400 tracking-wider">
              {isRad ? 'RAD' : 'DEG'}
            </span>
          </div>
          
          <div className="text-gray-400 dark:text-gray-500 text-xl md:text-2xl min-h-[2rem] font-mono tracking-wider break-all mt-4">
            {expression || '0'}
          </div>
          <div className={`text-4xl md:text-5xl font-bold mt-2 min-h-[3rem] font-mono tracking-tight break-all ${error ? 'text-red-500 text-2xl md:text-3xl' : 'text-indigo-900 dark:text-indigo-100'}`}>
            {result ? (error ? result : `= ${result}`) : ''}
          </div>
        </div>

        <div className="p-2 grid grid-cols-5 gap-2">
          {buttons.map((btn, i) => (
            <Button
              key={i}
              variant={btn.variant || 'ghost'}
              onClick={btn.action}
              className={`h-14 sm:h-16 text-sm sm:text-base ${btn.className || ''}`}
            >
              {btn.label === 'DEG/RAD' ? (isRad ? 'RAD' : 'DEG') : (btn.icon ? <btn.icon size={20} /> : btn.label)}
            </Button>
          ))}
        </div>
      </Card>
      
      {result && !error && (
        <div className="flex justify-end">
          <CopyButton variant="outline" text={result} />
        </div>
      )}
    </div>
  );
};
