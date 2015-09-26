Date Guesser
==================

Look for patterns in a string to guess the day, month and year of a given date.

You can install it with [npm](http://npmjs.org):
```
npm install date_guesser
```


### Usage

```javascript
var guess = require('date_guesser');

console.log(guess.parse("20-01-1998"))
//Tue Jan 20 1998 12:00:00 GMT+0100 (W. Europe Standard Time)

console.log(guess.parse("1 sept. 2004"))
//Wed Sep 01 2004 12:00:00 GMT+0200 (W. Europe Daylight Time)

console.log(guess.parse("June, 25th 2005"))
//Sat Jun 25 2005 12:00:00 GMT+0200 (W. Europe Daylight Time)

console.log(guess.parse("Aug. 2005"))
//Mon Aug 01 2005 12:00:00 GMT+0200 (W. Europe Daylight Time)

```
