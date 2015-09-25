"use strict";

var assert = require('assert');
var guess  = require('../date_guesser');

describe('Parsing dates', function () {
    describe('Simple dash seperated', function () {
        var res = guess.parse("10-20-2005");

        it("should get Date(20 oct. 2005)", function () {
            assert.equal(res.getDate(), 20);
            assert.equal(res.getMonth(), 9);
            assert.equal(res.getFullYear(), 2005);
        });
    });

    describe('Ambigious day and month', function () {
        var res = guess.parse("5 10 2005");

        it("should get Date(5 oct. 2005)", function () {
            assert.equal(res.getDate(), 5);
            assert.equal(res.getMonth(), 9);
            assert.equal(res.getFullYear(), 2005);
        });
    });

    describe('Non-ambigious day and month', function () {
        var res = guess.parse("22 5 2005");

        it("should get Date(22 may. 2005)", function () {
            assert.equal(res.getDate(), 22);
            assert.equal(res.getMonth(), 4);
            assert.equal(res.getFullYear(), 2005);
        });

        var res = guess.parse("5 22 2005");

        it("should get Date(22 may. 2005)", function () {
            assert.equal(res.getDate(), 22);
            assert.equal(res.getMonth(), 4);
            assert.equal(res.getFullYear(), 2005);
        });
    });

    describe('Written month', function () {
        var jan = guess.parse("22 jan 2005");
        it("should get Date(22 jan. 2005)", function () {
            assert.equal(jan.getDate(), 22);
            assert.equal(jan.getMonth(), 0);
            assert.equal(jan.getFullYear(), 2005);
        });

        var feb = guess.parse("Feb, 03 2008");
        it("should get Date(3 feb. 2008)", function () {
            assert.equal(feb.getDate(), 3);
            assert.equal(feb.getMonth(), 1);
            assert.equal(feb.getFullYear(), 2008);
        });
    });
});