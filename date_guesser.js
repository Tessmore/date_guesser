"use strict";

;(function() {
    function isYear(s) {
        return /[1-9][0-9]{3,}/.test(s);
    }

    function isMonth(s) {

    }

    function isNotNumeric(s) {
        return /[^0-9]/.test(s);
    }

    function allNumeric(list) {
        for (var i=0; i<list.length; i++) {
            if (isNotNumeric(list[i])) {
                return false;
            }
        }
        return true;
    }

    var guesser = {
        parse : function(date) {
            var current = new Date();
            var parts = normalize(date).split(" ");

            // Find the year : easiest
            for (var i=0; i<parts.length; i++) {
                if (isYear(parts[i])) {
                    current.setFullYear(parts[i]);
                    parts.splice(i, 1);
                    break;
                }
            }

            var day, month = -1;
            if (allNumeric(parts)) {
                // TODO: Guess standards based on country (i.e dmy, ymd versus m, dy)
                if (isAmbiguousDate(parts[0], parts[1]) || +parts[0] > 12) {
                    day = parts[0]; month = parts[1];
                }
                else {
                    day = parts[1]; month = parts[0];
                }
            }
            // Assume one of the two contains day as a number.
            else {
                if (isNotNumeric(parts[0])) {
                    day = parts[1]; month = parts[0];
                }
                else {
                    day = parts[0]; month = parts[1];
                }

                month = lookupMonth(month);
            }


            current.setDate(day);

            if (month > 0) {
                // Zero based
                current.setMonth(+month - 1);
            }

            return current;
        },

        norm: normalize
    };

    function lookupMonth(m) {
        var mapping = {
            "jan": 1,

            "feb": 2, "fev": 2, "fév": 2,

            "mar": 3, "mrt": 3, "märz": 3,

            "apr": 4, "avr": 4,

            "may": 5, "mei": 5, "mai": 5,

            "jun": 6, "juin": 6,

            "jul": 7, "juil": 7,

            "aug":8, "aout": 8, "août": 8,

            "sep":9,

            "oct":10, "okt": 10,

            "nov":11,

            "dec":12, "déc": 12, "dez": 12
        };

        if (m in mapping) {
            return mapping[m];
        }
        else if (m.slice(0,3) in mapping) {
            return mapping[m.slice(0, 3)];
        }

        return -1;
    }

    function normalize(date) {
        return (" " + date.toLowerCase())      // Easier boundary check
          .replace(/[^\w\s']/g, ' ')           // 10-02-2010 -> 10 02 2010
          .replace(/([a-zA-Z]{1,})/g, " $1 ")  // 10okt2010  -> 10 okt 2010
          .replace(/ 0([1-9]{1,})/g, " $1")    // 10 02 2010 -> 10 2 2010
          .replace(/\s{2,}/g, ' ')             // multi whitespace to single
          .trim();
    }

    function isAmbiguousDate(a, b) {
        return +a <= 12 && +b <= 12;
    }

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