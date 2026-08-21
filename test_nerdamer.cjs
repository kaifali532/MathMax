const nerdamer = require('nerdamer/all.min.js');
let diff = nerdamer('-3');
console.log(diff.variables());
console.log(diff.eq(0));
