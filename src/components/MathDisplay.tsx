import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathDisplayProps {
  math: string;
  block?: boolean;
}

export const MathDisplay: React.FC<MathDisplayProps> = ({ math, block = false }) => {
  return block ? <BlockMath math={math} /> : <InlineMath math={math} />;
};
