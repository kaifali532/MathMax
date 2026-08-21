import React, { useState } from 'react';
import { Card, Input } from '../components/ui';
import { MathDisplay } from '../components/MathDisplay';
import { Search } from 'lucide-react';

const formulas = [
  { category: 'Algebra', name: 'Quadratic Formula', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', desc: 'Finds the roots of a quadratic equation ax² + bx + c = 0.' },
  { category: 'Algebra', name: 'Difference of Squares', formula: 'a^2 - b^2 = (a - b)(a + b)', desc: 'Factors the difference of two perfect squares.' },
  { category: 'Algebra', name: 'Perfect Square Trinomial', formula: '(a \\pm b)^2 = a^2 \\pm 2ab + b^2', desc: 'Expands a binomial squared.' },
  { category: 'Algebra', name: 'Laws of Indices (Multiplication)', formula: 'x^a \\cdot x^b = x^{a+b}', desc: 'Multiplying terms with the same base.' },
  { category: 'Algebra', name: 'Laws of Indices (Division)', formula: '\\frac{x^a}{x^b} = x^{a-b}', desc: 'Dividing terms with the same base.' },
  { category: 'Algebra', name: 'Laws of Indices (Power)', formula: '(x^a)^b = x^{ab}', desc: 'A power raised to another power.' },
  
  { category: 'Geometry', name: 'Area of a Circle', formula: 'A = \\pi r^2', desc: 'Calculates the area of a circle given its radius.' },
  { category: 'Geometry', name: 'Circumference of a Circle', formula: 'C = 2\\pi r', desc: 'Calculates the distance around a circle.' },
  { category: 'Geometry', name: 'Area of a Triangle', formula: 'A = \\frac{1}{2}bh', desc: 'Calculates area given base and height.' },
  { category: 'Geometry', name: 'Volume of a Sphere', formula: 'V = \\frac{4}{3}\\pi r^3', desc: 'Calculates the volume of a perfect sphere.' },
  { category: 'Geometry', name: 'Volume of a Cylinder', formula: 'V = \\pi r^2 h', desc: 'Calculates the volume of a cylinder.' },
  
  { category: 'Trigonometry', name: 'Pythagorean Theorem', formula: 'a^2 + b^2 = c^2', desc: 'Relates the sides of a right-angled triangle.' },
  { category: 'Trigonometry', name: 'Sine Rule', formula: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}', desc: 'Relates sides and angles of any triangle.' },
  { category: 'Trigonometry', name: 'Cosine Rule', formula: 'c^2 = a^2 + b^2 - 2ab \\cos C', desc: 'Finds a side length or angle in any triangle.' },
  { category: 'Trigonometry', name: 'Pythagorean Identity', formula: '\\sin^2 \\theta + \\cos^2 \\theta = 1', desc: 'Fundamental trigonometric identity.' },
  
  { category: 'Coordinate Geometry', name: 'Distance Formula', formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', desc: 'Distance between two points.' },
  { category: 'Coordinate Geometry', name: 'Midpoint Formula', formula: 'M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)', desc: 'Finds the exact center between two points.' },
  { category: 'Coordinate Geometry', name: 'Slope', formula: 'm = \\frac{y_2 - y_1}{x_2 - x_1}', desc: 'Calculates the steepness of a line.' },
  
  { category: 'Statistics', name: 'Mean', formula: '\\bar{x} = \\frac{\\sum x_i}{n}', desc: 'The average of a set of numbers.' },
  { category: 'Statistics', name: 'Population Variance', formula: '\\sigma^2 = \\frac{\\sum (x_i - \\mu)^2}{N}', desc: 'Measures how spread out a population is.' },
  { category: 'Statistics', name: 'Sample Variance', formula: 's^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n - 1}', desc: 'Estimates variance from a sample.' }
];

export const Formulas: React.FC = () => {
  const [search, setSearch] = useState('');
  
  const filtered = formulas.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase()) ||
    f.desc.toLowerCase().includes(search.toLowerCase())
  );
  
  const grouped = filtered.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof formulas>);

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Formula Library</h1>
        <p className="text-gray-500">Search and reference mathematical formulas.</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <Input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search formulas by name, category, or description..."
          className="pl-10"
        />
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No formulas found matching "{search}".
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-bold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-gray-100">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((item, i) => (
                  <Card key={i} className="p-5 flex flex-col h-full hover:border-zinc-200 dark:hover:border-zinc-900/50 transition-colors card-3d">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{item.name}</h3>
                    <div className="flex-1 flex items-center justify-center py-6 overflow-x-auto text-lg text-zinc-600 dark:text-zinc-400">
                      <MathDisplay math={item.formula} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                      {item.desc}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
