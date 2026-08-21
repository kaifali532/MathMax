/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout, PageType } from './components/Layout';
import { Home } from './pages/Home';
import { ScientificCalculator } from './pages/ScientificCalculator';
import { AlgebraSolver } from './pages/AlgebraSolver';
import { PolynomialSolver } from './pages/PolynomialSolver';
import { QuadraticSolver } from './pages/QuadraticSolver';
import { AnglesTrig } from './pages/AnglesTrig';
import { Statistics } from './pages/Statistics';
import { GraphingCalculator } from './pages/GraphingCalculator';
import { Formulas } from './pages/Formulas';
import { History } from './pages/History';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'calculator':
        return <ScientificCalculator />;
      case 'algebra':
        return <AlgebraSolver />;
      case 'polynomial':
        return <PolynomialSolver />;
      case 'quadratic':
        return <QuadraticSolver />;
      case 'angles':
        return <AnglesTrig />;
      case 'statistics':
        return <Statistics />;
      case 'graphing':
        return <GraphingCalculator />;
      case 'formulas':
        return <Formulas />;
      case 'history':
        return <History onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

