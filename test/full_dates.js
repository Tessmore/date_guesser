"use strict";

var assert = require('assert');
var guess  = require('../date-guesser');

function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}

describe('Original dates', function () {
    describe('Empty', function () {
        var res = guess.parse("");

        it("should get an invalid date", function () {
            assert.equal(isValidDate(res), false);
        });
    });

    describe('Ignore timestamp', function () {
        var res = guess.parse("24 10 2015 17:46:40");

        it("should get Date(24 oct. 2015)", function () {
            assert.equal(res.getDate(), 24);
            assert.equal(res.getMonth(), 9);
            assert.equal(res.getFullYear(), 2015);
        });
    });

    describe('Allow/keep already partial valid date', function () {
        var res = guess.parse("Sat Oct 24 2015");

        it("should get Date(24 oct. 2015)", function () {
            assert.equal(res.getDate(), 24);
            assert.equal(res.getMonth(), 9);
            assert.equal(res.getFullYear(), 2015);
        });
    });

    describe('Allow/keep already valid date', function () {
        var res = guess.parse("Sat Oct 24 2015 17:46:40 GMT+0200 (W. Europe Daylight Time)");

        it("should get Date(24 oct. 2015)", function () {
            assert.equal(res.getDate(), 24);
            assert.equal(res.getMonth(), 9);
            assert.equal(res.getFullYear(), 2015);
        });
    });

});