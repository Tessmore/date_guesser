"use strict";

var assert = require('assert');
var guess  = require('../date_guesser');

describe('Date with seperator', function () {
    describe('Dash', function () {
        console.log(guess.parse("10 10 2010"))
        //var res = guess.parse("10-20-2005");
        var res = new Date();
        it("should get Date(20 oct. 2005)", function () {
            console.log(res);

            assert.equal(res.getDate(), 20);
            assert.equal(res.getMonth(), 10);
            assert.equal(res.getFullYear(), 2005);
        });
    });
});