import React from 'react';
import { Card, Button } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import { Trash2, Copy, Clock, ExternalLink } from 'lucide-react';
import { PageType } from '../components/Layout';

export const History: React.FC<{ onNavigate: (page: PageType) => void }> = ({ onNavigate }) => {
  const { history, clearHistory, deleteHistoryItem } = useAppContext();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">History</h1>
          <p className="text-gray-500">Your recent calculations and solutions.</p>
        </div>
        {history.length > 0 && (
          <Button variant="danger" onClick={clearHistory}>
            <Trash2 size={16} /> Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <Clock size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400">No history yet</h2>
          <p className="text-gray-500 mt-2">Calculations you perform will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                    {item.module}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="font-medium text-base truncate mb-1 text-gray-900 dark:text-gray-100" title={item.problem}>
                  {item.problem}
                </div>
                <div className="text-sm text-gray-500 truncate" title={item.answer}>
                  {item.answer}
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <Button variant="outline" className="px-3" onClick={() => navigator.clipboard.writeText(item.answer)} title="Copy Answer">
                  <Copy size={16} />
                </Button>
                <Button variant="outline" className="px-3" onClick={() => onNavigate(item.module as PageType)} title="Open Tool">
                  <ExternalLink size={16} />
                </Button>
                <Button variant="ghost" className="px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => deleteHistoryItem(item.id)} title="Delete">
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
