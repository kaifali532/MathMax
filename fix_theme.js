const fs = require('fs');
const glob = require('glob');

// We don't have glob installed probably, let's just use recursive read
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Convert most indigo to zinc
    // e.g. text-indigo-600 -> text-zinc-800 dark:text-zinc-200
    // bg-indigo-50 -> bg-zinc-100
    // ring-indigo-500 -> ring-zinc-500
    // We will do a simple text replace
    
    // Instead of simple replace, let's just sed all indigo to zinc.
    // Wait, zinc is good for neutral, but Apple often uses blue for focus rings.
    // Let's replace indigo-500/600/700 with zinc-800 (light) and zinc-200 (dark).
    // It's easier to just do a global replace of 'indigo-' to 'zinc-'.
    
    content = content.replace(/indigo-/g, 'zinc-');
    
    fs.writeFileSync(file, content);
});
console.log("Done");
