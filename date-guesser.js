"use strict";

;(function() {
    var guesser = {
        parse : function(date, cMonth, cDay) {
            // Set fallback date to first day of the year
            var current = new Date();
                current.setHours(12);
                current.setMinutes(0);
                current.setSeconds(0);
                current.setMonth(cMonth||0);
                current.setDate(cDay||1);

            var parts = normalize(date).split(" ");

            // Find the year : easiest
            for (var i=0; i<parts.length; i++) {
                if (isYear(parts[i]) || isShortYear(parts[i])) {
                    var year = parts[i];
                    if (isShortYear(year)) {
                        // 2015 + '12 ==> 2012
                        // 2122 + '92 ==> 2192
                        year = current
                            .getFullYear()
                            .toString()
                            .slice(0, 2) + parts[i].slice(1);
                    }

                    current.setFullYear(year);
                    parts.splice(i, 1);
                    break;
                }
            }

            var day = 1, month = -1;
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
                    day = parts[1]||1; month = parts[0];
                }
                else {
                    day = parts[0]||1; month = parts[1];
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

    function normalize(date) {
        return (" " + date.toLowerCase())      // Easier boundary check
          .replace(/[^\w\s']/g, ' ')           // 10-02-2010 -> 10 02 2010
          .replace(/([a-z]{1,})/g, " $1 ")  // 10okt2010  -> 10 okt 2010
          .replace(/ 0([1-9]{1,})/g, " $1")    // 10 02 2010 -> 10 2 2010
          .replace(/\b(e|th|rd)\b/g, "")
          .replace(/\s{2,}/g, ' ')             // multi whitespace to single
          .trim();
    }

    function isYear(s) {
        return /[1-9][0-9]{3,}/.test(s);
    }

    function isShortYear(s) {
        return /'[0-9]{2,}/.test(s);
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

    function isAmbiguousDate(a, b) {
        return +a <= 12 && +b <= 12;
    }

    function lookupMonth(m) {
        var mapping = {
            "j": 1, "jan": 1, "yan": 1,

            "f": 2, "feb": 2, "fev": 2, "fév": 2,

            "mar": 3, "mrt": 3, "mär": 3,

            "apr": 4, "avr": 4,

            "may": 5, "mei": 5, "mai": 5,

            "jun": 6, "juin": 6, "iyn": 6,

            "jul": 7, "juil": 7, "iyl": 7,

            "aug":8, "aou": 8, "aoû": 8, "avq": 8,

            "sep":9, "sen": 9,

            "oct":10, "okt": 10,

            "nov":11, "noy": 11,

            "dec":12, "déc": 12, "dez": 12, "des": 12, "dek": 12
        };

        if (m in mapping) {
            return mapping[m];
        }
        else if (m.slice(0,3) in mapping) {
            return mapping[m.slice(0, 3)];
        }

        return -1;
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