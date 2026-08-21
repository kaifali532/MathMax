import React from 'react';
import { cn } from '../lib/utils';
import { Copy, Check } from 'lucide-react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-3d", className)} {...props} />
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'neon' }> = ({ className, variant = 'primary', children, ...props }) => {
  const isNeon = variant === 'neon';
  const baseClass = "relative px-4 py-2 rounded-xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group transform";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_4px_0_0_#4338ca] hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#4338ca] active:translate-y-[2px] active:shadow-[0_0px_0_0_#4338ca]",
    neon: "bg-indigo-600 text-white shadow-[0_4px_0_0_#4338ca] hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#4338ca,0_0_15px_rgba(99,102,241,0.5)] active:translate-y-[2px] active:shadow-[0_0px_0_0_#4338ca]",
    secondary: "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-[0_3px_0_0_#d1d5db] dark:shadow-[0_3px_0_0_#374151] hover:-translate-y-[1px] hover:shadow-[0_4px_0_0_#d1d5db] dark:hover:shadow-[0_4px_0_0_#374151] active:translate-y-[2px] active:shadow-[0_0px_0_0_#d1d5db] dark:active:shadow-[0_0px_0_0_#374151]",
    outline: "bg-transparent text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:-translate-y-[1px] hover:shadow-md active:translate-y-[1px] active:shadow-none",
    ghost: "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:-translate-y-[1px] active:translate-y-[1px]",
    danger: "bg-red-600 text-white hover:bg-red-500 shadow-[0_4px_0_0_#b91c1c] hover:-translate-y-[2px] hover:shadow-[0_6px_0_0_#b91c1c] active:translate-y-[2px] active:shadow-[0_0px_0_0_#b91c1c]"
  };

  if (isNeon) {
    return (
      <button className={cn(baseClass, variants[variant], "overflow-hidden border border-indigo-400 dark:border-indigo-500", className)} {...props}>
         <span className="absolute inset-[-150%] animate-[neon-spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#a855f7_85%,#ffffff_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
         <span className="absolute inset-[1.5px] bg-indigo-600 rounded-[10px] pointer-events-none transition-colors group-hover:bg-indigo-500" />
         <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  }

  return (
    <button className={cn(baseClass, variants[variant as keyof typeof variants], className)} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input 
    className={cn("w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 input-3d hover:border-gray-300 dark:hover:border-gray-600", className)}
    {...props}
  />
);

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label className={cn("block text-xs font-bold text-indigo-600 uppercase mb-1 tracking-widest", className)} {...props} />
);

export const CopyButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { text: string; variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'neon' }> = ({ text, className, variant = 'outline', ...props }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant={variant as any} className={className} onClick={handleCopy} {...props}>
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      {copied ? 'Copied ✓' : 'Copy'}
    </Button>
  );
}
