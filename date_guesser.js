"use strict";

;(function() {
    var normalize = function(date) {
        return (" " + date.toLowerCase())      // Easier boundary check
          .replace(/[^\w\s']/g, ' ')           // 10-02-2010 -> 10 02 2010
          .replace(/([a-zA-Z]{1,})/g, " $1 ")  // 10okt2010  -> 10 okt 2010
          .replace(/ 0([1-9]{1,})/g, " $1")    // 10 02 2010 -> 10 2 2010
          .replace(/\s{2,}/g, ' ')             // multi whitespace to single
          .trim();
    }

    var guesser = {
        parse : function(date) {
            var current = new Date();
            var day, month, year;

            return current;
        },

        norm: normalize
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = guesser;
        }
        exports.date_guesser = guesser;
    }
    else {
        this.date_guesser = guesser;
    }
}).call(this);