const { create, all } = require('mathjs');
const math = create(all, { number: 'Fraction' });
console.log(math.format(math.evaluate('1/3')));
console.log(math.format(math.evaluate('1.5')));
console.log(math.format(math.evaluate('sin(30 deg)')));
console.log(math.format(math.evaluate('sqrt(144)')));
