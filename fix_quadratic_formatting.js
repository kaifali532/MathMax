const fs = require('fs');
let content = fs.readFileSync('src/pages/QuadraticSolver.tsx', 'utf8');

// Replace .toFixed(4) with a clean formatter.
content = content.replace(/([a-zA-Z0-9]+)\.toFixed\(4\)/g, 'Number($1.toFixed(4))');

fs.writeFileSync('src/pages/QuadraticSolver.tsx', content);
