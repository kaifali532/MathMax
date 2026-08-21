const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// I will just rewrite it to be clean.
const lines = content.split('\n');
const fixedLines = [];
let skip = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const handleSetTheme =') && i > 50) {
    skip = true;
  }
  if (skip) {
    if (lines[i] === '  };') {
      skip = false;
    }
    continue;
  }
  fixedLines.push(lines[i]);
}

fs.writeFileSync('src/context/AppContext.tsx', fixedLines.join('\n'));
