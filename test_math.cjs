const math = require('mathjs');
console.log(math.format(math.fraction(1/3)));
console.log(math.format(math.evaluate('1/3'), { fraction: 'ratio' }));
