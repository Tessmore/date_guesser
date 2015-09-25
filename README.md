Date guesser
==================

Look for patterns in a string to guess the day, month and year for a date.

Use [npm](http://npmjs.org):
    $ npm install date_guesser


```javascript
var guess = require('date_guesser');

console.log(guess("20-01-1998"))      // 20  jan.  1998
console.log(guess("1 sept. 2004"))    // 1   sep.  2004
console.log(guess("June, 25th 2005")) // 25  june  2005

```

## Options

... TODO