"use strict";

var assert = require('assert');
var guess  = require('../date_guesser');

describe('Normalization', function () {
    describe('Containing symbols', function () {
        it("Should strip seperators", function () {
            assert.equal(guess.norm("10 20 2005"), "10 20 2005");
            assert.equal(guess.norm("10-20-2005"), "10 20 2005");
            assert.equal(guess.norm("10/20/2005"), "10 20 2005");
            assert.equal(guess.norm("10|20|2005"), "10 20 2005");
            assert.equal(guess.norm("10.20.2005"), "10 20 2005");
            assert.equal(guess.norm("10--20--2005"), "10 20 2005");
            assert.equal(guess.norm("10 - 20 - 2005"), "10 20 2005");
            assert.equal(guess.norm("10 20-2005"), "10 20 2005");
            assert.equal(guess.norm("10-jan-2005"), "10 jan 2005");
            assert.equal(guess.norm("10-jan.-2005"), "10 jan 2005");
            assert.equal(guess.norm("10.october.2005"), "10 october 2005");
        });

        it("Should strip brackets", function () {
            assert.equal(guess.norm("2 (jan) '05"), "2 jan '05");
            assert.equal(guess.norm("[10-02-2020]"), "10 2 2020");
        });

        it("Should keep apastrophe", function () {
            assert.equal(guess.norm("10 20 '05"), "10 20 '05");
        });
    });

    describe('Leading zeroes', function () {
        it("Should be removed", function () {
            assert.equal(guess.norm("10 2 '05"), "10 2 '05");
            assert.equal(guess.norm("10 02 '05"), "10 2 '05");
            assert.equal(guess.norm("01 02 2005"), "1 2 2005");
            assert.equal(guess.norm("01/02/2005"), "1 2 2005");
        });
    });

    describe('Casing', function () {
        it("Should be lower", function () {
            assert.equal(guess.norm("2 Jan 2010"), "2 jan 2010");
            assert.equal(guess.norm("2JAN2010"), "2 jan 2010");
        });
    });

});