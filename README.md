Date Guesser
==================

The default javascript `Date.parse('Aug 9, 1995')` is quite decent, but gives up too soon.
The following are all invalid dates or parsed wrong:

```
new Date(Date.parse('19/8/1995'));
new Date(Date.parse('2th Sept 2010'));
new Date(Date.parse('Okt 2014')); // Gives Jan 01 2014
```

To parse a date is no easy feat, given timezones and different formatting styles. This script looks for patterns in a string
to guess the date a little better with European formats.


### Usage

You can install it with [npm](http://npmjs.org):

```
npm install date_guesser
```


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
