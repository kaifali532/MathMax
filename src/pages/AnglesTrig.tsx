import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { MathDisplay } from '../components/MathDisplay';
import { useAppContext } from '../context/AppContext';

export const AnglesTrig: React.FC = () => {
  const [sides, setSides] = useState({ a: '', b: '', c: '' });
  const [angles, setAngles] = useState({ A: '', B: '' }); // C is always 90 for right triangle
  const [solution, setSolution] = useState<{ 
    a: number, b: number, c: number, A: number, B: number, area: number, perimeter: number, steps: string[] 
  } | null>(null);
  const [error, setError] = useState('');
  const { addToHistory } = useAppContext();

  const handleSolve = () => {
    try {
      setError('');
      const sa = parseFloat(sides.a) || 0;
      const sb = parseFloat(sides.b) || 0;
      const sc = parseFloat(sides.c) || 0;
      const aA = parseFloat(angles.A) || 0;
      const aB = parseFloat(angles.B) || 0;

      let a = sa, b = sb, c = sc, A = aA, B = aB;
      const steps: string[] = [];

      // Degree to radian helpers
      const toRad = (deg: number) => deg * Math.PI / 180;
      const toDeg = (rad: number) => rad * 180 / Math.PI;

      // Validate inputs
      if ([sa, sb, sc, aA, aB].some(v => v < 0)) {
        throw new Error("Lengths and angles must be positive numbers.");
      }

      // Check if provided angles sum > 90 (since it's a right triangle)
      if (aA > 0 && aB > 0 && (aA + aB !== 90)) {
        throw new Error(`In a right triangle, angles A and B must sum to 90°. You provided A=${aA}°, B=${aB}° (Sum = ${aA + aB}°).`);
      }
      if (aA >= 90 || aB >= 90) {
        throw new Error("Angles A and B must be strictly less than 90° in a right triangle.");
      }

      let knownCount = [sa, sb, sc, aA, aB].filter(v => v > 0).length;
      if (knownCount < 2) {
        throw new Error('Not enough information. Enter at least two measurements.');
      }
      
      if (aA && aB && !sa && !sb && !sc) {
        throw new Error('Cannot solve with only angles. Need at least one side.');
      }

      // 1. Find angles if one is known
      if (A > 0 && B === 0) { B = 90 - A; steps.push(`Sum of angles is 180°. B = 90° - A = 90° - ${A}° = ${B}°`); }
      else if (B > 0 && A === 0) { A = 90 - B; steps.push(`Sum of angles is 180°. A = 90° - B = 90° - ${B}° = ${A}°`); }

      // 2. Pythagoras if two sides are known
      if (a > 0 && b > 0 && c === 0) {
        c = Math.sqrt(a*a + b*b);
        steps.push(`Use Pythagorean theorem: $c^2 = a^2 + b^2$`);
        steps.push(`c = \\sqrt{${a}^2 + ${b}^2} = ${c.toFixed(2)}`);
      } else if (a > 0 && c > 0 && b === 0) {
        if (a >= c) throw new Error("Side 'a' cannot be greater than hypotenuse 'c'");
        b = Math.sqrt(c*c - a*a);
        steps.push(`Use Pythagorean theorem: $b^2 = c^2 - a^2$`);
        steps.push(`b = \\sqrt{${c}^2 - ${a}^2} = ${b.toFixed(2)}`);
      } else if (b > 0 && c > 0 && a === 0) {
        if (b >= c) throw new Error("Side 'b' cannot be greater than hypotenuse 'c'");
        a = Math.sqrt(c*c - b*b);
        steps.push(`Use Pythagorean theorem: $a^2 = c^2 - b^2$`);
        steps.push(`a = \\sqrt{${c}^2 - ${b}^2} = ${a.toFixed(2)}`);
      }

      // 3. Trig if one side and one angle known
      if (A > 0 && c > 0 && a === 0) {
        a = c * Math.sin(toRad(A));
        steps.push(`$\\sin(A) = \\frac{a}{c} \\Rightarrow a = c \\cdot \\sin(A)$`);
        steps.push(`a = ${c} \\cdot \\sin(${A}^\\circ) = ${a.toFixed(2)}`);
      }
      if (A > 0 && c > 0 && b === 0) {
        b = c * Math.cos(toRad(A));
        steps.push(`$\\cos(A) = \\frac{b}{c} \\Rightarrow b = c \\cdot \\cos(A)$`);
        steps.push(`b = ${c} \\cdot \\cos(${A}^\\circ) = ${b.toFixed(2)}`);
      }
      if (A > 0 && a > 0 && c === 0) {
        c = a / Math.sin(toRad(A));
        steps.push(`$\\sin(A) = \\frac{a}{c} \\Rightarrow c = \\frac{a}{\\sin(A)}$`);
        steps.push(`c = \\frac{${a}}{\\sin(${A}^\\circ)} = ${c.toFixed(2)}`);
      }
      if (A > 0 && a > 0 && b === 0) {
        b = a / Math.tan(toRad(A));
        steps.push(`$\\tan(A) = \\frac{a}{b} \\Rightarrow b = \\frac{a}{\\tan(A)}$`);
        steps.push(`b = \\frac{${a}}{\\tan(${A}^\\circ)} = ${b.toFixed(2)}`);
      }
      if (A > 0 && b > 0 && c === 0) {
        c = b / Math.cos(toRad(A));
        steps.push(`$\\cos(A) = \\frac{b}{c} \\Rightarrow c = \\frac{b}{\\cos(A)}$`);
        steps.push(`c = \\frac{${b}}{\\cos(${A}^\\circ)} = ${c.toFixed(2)}`);
      }
      if (A > 0 && b > 0 && a === 0) {
        a = b * Math.tan(toRad(A));
        steps.push(`$\\tan(A) = \\frac{a}{b} \\Rightarrow a = b \\cdot \\tan(A)$`);
        steps.push(`a = ${b} \\cdot \\tan(${A}^\\circ) = ${a.toFixed(2)}`);
      }

      // If we found sides but not angles
      if (a > 0 && c > 0 && A === 0) {
        A = toDeg(Math.asin(a/c));
        B = 90 - A;
        steps.push(`$\\sin(A) = \\frac{a}{c} \\Rightarrow A = \\arcsin(\\frac{${a.toFixed(2)}}{${c.toFixed(2)}}) = ${A.toFixed(2)}^\\circ$`);
      }

      // Ensure everything is calculated
      if (!a || !b || !c || !A || !B) {
        // Try another pass (sometimes one pass isn't enough depending on input)
        if (a > 0 && b > 0 && c === 0) c = Math.sqrt(a*a + b*b);
        if (a > 0 && c > 0 && B === 0) { B = toDeg(Math.acos(a/c)); A = 90 - B; }
      }

      if (!a || !b || !c || !A || !B) {
        throw new Error("Could not solve with given inputs.");
      }

      // Validate final triangle rules
      if (a <= 0 || b <= 0 || c <= 0) {
        throw new Error('Invalid triangle: all sides must be positive.');
      }
      // Tolerance for floating point
      const tol = 1e-7;
      if (a + b <= c - tol || a + c <= b - tol || b + c <= a - tol) {
        throw new Error('Invalid triangle: sides do not satisfy the triangle inequality (a + b > c).');
      }

      const area = 0.5 * a * b;
      const perimeter = a + b + c;

      steps.push(`Area = $\\frac{1}{2} \\cdot a \\cdot b = ${area.toFixed(2)}$`);
      steps.push(`Perimeter = $a + b + c = ${perimeter.toFixed(2)}$`);

      setSolution({ a, b, c, A, B, area, perimeter, steps });
      addToHistory({ 
        problem: `Right Triangle (a=${sa||'?'}, b=${sb||'?'}, c=${sc||'?'})`, 
        answer: `c = ${c.toFixed(2)}, A = ${A.toFixed(2)}°`, 
        module: 'angles' 
      });

    } catch (err: any) {
      setError(err.message || 'Invalid configuration');
      setSolution(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Angles & Trigonometry</h1>
        <p className="text-gray-500">Solve right triangles and trigonometric problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 h-fit">
          <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-2 text-gray-900 dark:text-gray-100">Right Triangle Solver</h3>
          <p className="text-sm text-gray-500 mb-4">Enter any two known values (at least one side) to solve the triangle. Angle C is 90°.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Side a</label>
              <Input type="number" value={sides.a} onChange={e => setSides({...sides, a: e.target.value})} placeholder="Length" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Angle A (°)</label>
              <Input type="number" value={angles.A} onChange={e => setAngles({...angles, A: e.target.value})} placeholder="Degrees" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Side b</label>
              <Input type="number" value={sides.b} onChange={e => setSides({...sides, b: e.target.value})} placeholder="Length" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Angle B (°)</label>
              <Input type="number" value={angles.B} onChange={e => setAngles({...angles, B: e.target.value})} placeholder="Degrees" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Hypotenuse (Side c)</label>
              <Input type="number" value={sides.c} onChange={e => setSides({...sides, c: e.target.value})} placeholder="Length" />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button variant="neon" className="flex-1" onClick={handleSolve}>Solve Triangle</Button>
            <Button variant="secondary" onClick={() => { setSides({a:'',b:'',c:''}); setAngles({A:'',B:''}); setSolution(null); setError(''); }}>Clear</Button>
          </div>
          
          {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
        </Card>

        {solution && (
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-2 text-gray-900 dark:text-gray-100">Solution</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:text-base">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Side a:</span> 
                <span className="font-medium text-gray-900 dark:text-gray-100">{solution.a.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Angle A:</span> 
                <span className="font-medium text-zinc-600 dark:text-zinc-400">{solution.A.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Side b:</span> 
                <span className="font-medium text-gray-900 dark:text-gray-100">{solution.b.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Angle B:</span> 
                <span className="font-medium text-zinc-600 dark:text-zinc-400">{solution.B.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Side c (hyp):</span> 
                <span className="font-medium text-gray-900 dark:text-gray-100">{solution.c.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Angle C:</span> 
                <span className="font-medium text-gray-900 dark:text-gray-100">90°</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Area:</span> 
                <span className="font-medium text-gray-900 dark:text-gray-100">{solution.area.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 py-1">
                <span className="text-gray-500">Perimeter:</span> 
                <span className="font-medium text-gray-900 dark:text-gray-100">{solution.perimeter.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Step-by-step</h3>
              <div className="space-y-3">
                {solution.steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-zinc-50 text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                      {step.includes('$') ? (
                        <MathDisplay math={step.replace(/\$/g, '')} />
                      ) : (
                        <p>{step}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
