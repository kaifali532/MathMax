import React, { useState, useMemo } from 'react';
import { Card, Button, Input } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import * as math from 'mathjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export const Statistics: React.FC = () => {
  const [input, setInput] = useState('12, 15, 18, 20, 20, 25, 30');
  const [data, setData] = useState<number[]>([]);
  const [error, setError] = useState('');
  const { addToHistory } = useAppContext();

  const handleCalculate = () => {
    try {
      setError('');
      const parsed = input.split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
      if (parsed.some(isNaN)) {
        throw new Error('All values must be valid numbers.');
      }
      if (parsed.length === 0) {
        throw new Error('Enter at least one number.');
      }
      setData(parsed.sort((a, b) => a - b));
      
      const mean = math.mean(parsed);
      addToHistory({
        problem: `Stats for: ${input.substring(0, 20)}...`,
        answer: `Mean: ${mean.toFixed(2)}, n: ${parsed.length}`,
        module: 'statistics'
      });
    } catch (err: any) {
      setError(err.message || 'Invalid input data.');
      setData([]);
    }
  };

  const stats = useMemo(() => {
    if (data.length === 0) return null;
    
    const count = data.length;
    const sum = math.sum(data);
    const mean = math.mean(data);
    const median = math.median(data);
    const modeStr = math.mode(data).join(', ');
    const min = math.min(data);
    const max = math.max(data);
    const range = max - min;
    const popVar = math.variance(data, 'uncorrected');
    const samVar = math.variance(data, 'unbiased');
    const popStd = math.std(data, 'uncorrected');
    const samStd = math.std(data, 'unbiased');
    
    // Quartiles
    const q1 = math.quantileSeq(data, 0.25);
    const q3 = math.quantileSeq(data, 0.75);
    const iqr = Number(q3) - Number(q1);

    return {
      count, sum, mean, median, modeStr, min, max, range, popVar, samVar, popStd, samStd, q1, q3, iqr
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (data.length === 0) return null;
    
    // Frequency map
    const freq: Record<number, number> = {};
    data.forEach(d => { freq[d] = (freq[d] || 0) + 1; });
    
    const labels = Object.keys(freq).sort((a,b) => Number(a) - Number(b));
    const values = labels.map(l => freq[Number(l)]);

    return {
      labels,
      datasets: [
        {
          label: 'Frequency',
          data: values,
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
          borderColor: 'rgb(79, 70, 229)',
          borderWidth: 1,
        }
      ]
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Frequency Distribution' }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Statistics</h1>
        <p className="text-gray-500">Calculate statistical measures and generate charts.</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Enter comma-separated data</label>
          <div className="flex gap-2">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="12, 15, 18, 20..."
              onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
            />
            <Button onClick={handleCalculate} variant="neon">Calculate</Button>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
      </Card>

      {stats && chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-2 text-gray-900 dark:text-gray-100">Descriptive Statistics</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Count (n)</span>
                <span className="font-medium text-lg text-gray-900 dark:text-gray-100">{stats.count}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Sum (Σx)</span>
                <span className="font-medium text-lg text-gray-900 dark:text-gray-100">{stats.sum}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Mean (μ, x̄)</span>
                <span className="font-medium text-lg text-indigo-600 dark:text-indigo-400">{Number(stats.mean).toFixed(4)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Median</span>
                <span className="font-medium text-lg text-emerald-600 dark:text-emerald-400">{Number(stats.median).toFixed(4)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Mode</span>
                <span className="font-medium text-lg text-purple-600 dark:text-purple-400">{stats.modeStr}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Range</span>
                <span className="font-medium text-lg text-gray-900 dark:text-gray-100">{stats.range}</span>
              </div>
              
              <div className="col-span-2 border-t border-gray-100 dark:border-gray-800 my-2"></div>
              
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Min</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{stats.min}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Max</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{stats.max}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Q1 (25th)</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{Number(stats.q1).toFixed(2)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Q3 (75th)</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{Number(stats.q3).toFixed(2)}</span>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">IQR (Interquartile Range)</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{stats.iqr.toFixed(2)}</span>
              </div>

              <div className="col-span-2 border-t border-gray-100 dark:border-gray-800 my-2"></div>

              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Pop. Variance (σ²)</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{Number(stats.popVar).toFixed(4)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Sample Variance (s²)</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{Number(stats.samVar).toFixed(4)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Pop. Std Dev (σ)</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{Number(stats.popStd).toFixed(4)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block text-xs uppercase tracking-wider">Sample Std Dev (s)</span>
                <span className="font-medium text-base text-gray-900 dark:text-gray-100">{Number(stats.samStd).toFixed(4)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 flex flex-col h-[500px] lg:h-auto">
            <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-2 text-gray-900 dark:text-gray-100">Chart</h3>
            <div className="flex-1 min-h-0 relative">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2 p-6">
            <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-gray-800 pb-4 mb-4 text-gray-900 dark:text-gray-100">Dataset Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 tracking-wider">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">#</th>
                    <th className="px-4 py-3">Value (x)</th>
                    <th className="px-4 py-3">Deviation (x - x̄)</th>
                    <th className="px-4 py-3 rounded-tr-lg">Sq. Deviation (x - x̄)²</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((val, idx) => {
                    const dev = val - Number(stats.mean);
                    const devSq = dev * dev;
                    return (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{idx + 1}</td>
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{val}</td>
                        <td className="px-4 py-2 text-gray-500">{dev.toFixed(4)}</td>
                        <td className="px-4 py-2 text-gray-500">{devSq.toFixed(4)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
