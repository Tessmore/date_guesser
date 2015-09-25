"use strict";

var assert = require('assert');
var guess  = require('../lib/date');

describe('Date with seperator', function () {
    describe('Dash', function () {
        var res = guess("10-20-2005");

        it("should get Date(20 oct. 2005)", function () {
            assert.equal(res.getDate(), 20);
            assert.equal(res.getMonth(), 10);
            assert.equal(res.getFullYear(), 2005);
        });
    });
});