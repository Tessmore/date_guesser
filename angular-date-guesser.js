
(function() {
    "use strict";

    var mod = angular.module("date-guesser", []);

    function normalize(date) {
        return (" " + date.toLowerCase())      // Easier boundary check
          .replace(/[^\w\s']/g, " ")           // 10-02-2010 -> 10 02 2010
          .replace(/([a-z]{1,})/g, " $1 ")     // 10okt2010  -> 10 okt 2010
          .replace(/ 0([1-9]{1,})/g, " $1")    // 10 02 2010 -> 10 2 2010
          .replace(/\b(e|th|rd)\b/g, "")
          .replace(/\s{2,}/g, " ")             // multi whitespace to single
          .trim();
    }

    function isYear(s) {
        return /[1-9][0-9]{3,}/.test(s);
    }

    function isShortYear(s) {
        return /'[0-9]{2,}/.test(s);
    }

    function isInt(s) {
        return /[0-9]+/.test(s);
    }

    function isNotNumeric(s) {
        return /[^0-9]/.test(s);
    }

    function allNumeric(list) {
        for (var i=0; i < list.length; i++) {
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
            "j"  : 1,  "jan" : 1, "yan": 1,
            "f"  : 2,  "feb" : 2, "fev": 2, "fév": 2,
            "mar": 3,  "mrt" : 3, "mär": 3,
            "apr": 4,  "avr" : 4,
            "may": 5,  "mei" : 5, "mai": 5,
            "jun": 6,  "juin": 6, "iyn": 6,
            "jul": 7,  "juil": 7, "iyl": 7,
            "aug": 8,  "aou" : 8, "aoû": 8, "avq": 8,
            "sep": 9,  "sen" : 9,
            "oct": 10, "okt" : 10,
            "nov": 11, "noy" : 11,
            "dec": 12, "déc" : 12, "dez": 12, "des": 12, "dek": 12
        };

        if (m in mapping) {
            return mapping[m];
        }
        else if (m.slice(0,3) in mapping) {
            return mapping[m.slice(0, 3)];
        }

        return -1;
    }

    // WTF-JS :
    //   31 feb is acceptable (ie passed on to march).
    //   32 feb is invalid
    function acceptableDayMonthCombo(day, month) {
        var feb = function(day) { return day <= 29; }
        var A = function(day) { return day <= 30; }
        var B = function(day) { return day <= 31; }

        var combo = {
            1 : A,
            2 : feb,
            3 : A,
            4 : B,
            5 : A,
            6 : B,
            7 : A,
            8 : B,
            9 : A,
            10: B,
            11: A,
            12: B
        };

        return combo.hasOwnProperty(month) && combo[month](day);
    }

    function endOfMonth(month) {
        var feb = 28;
        var A   = 30;
        var B   = 31;

        var combo = {
            1 : A,
            2 : feb,
            3 : A,
            4 : B,
            5 : A,
            6 : B,
            7 : A,
            8 : B,
            9 : A,
            10: B,
            11: A,
            12: B
        };

        if (! combo.hasOwnProperty(month) ) {
            return 0;
        }

        return combo[month];
    }

    // Parse the given date by first normalizing it and then looking for patterns
    // - cMonth (int) : If no month is found, use provided value in stead
    // - cDay (str 'start' or 'end') : if no day is found, should it be 1 or end of month

    function parse(date, cMonth, cDay) {
        var year = null, month = null, day = null;

        date = date.toString();

        // Assume empty & very long dates are invalid
        if (date.length === 0 || date.length > 20) {
            return false;
        }

        var parts = normalize(date).split(" ");

        // Find the year
        for (var i=0; i < parts.length; i++) {
            if (isYear(parts[i]) || isShortYear(parts[i])) {
                year = parts[i];

                if (isShortYear(year)) {
                    // 2015 + '12 ==> 2012
                    // 2122 + '92 ==> 2192
                    var tmp = new Date().getFullYear().toString().slice(0, 2)
                    year = tmp + parts[i].slice(1)
                }

                parts.splice(i, 1);
                break;
            }
        }

        // Find month by written name
        var foundMonth = false;

        for (var i=0; i < parts.length; i++) {
            if (isNotNumeric(parts[i])) {
                month = lookupMonth(parts[i]);

                if (month >= 0) {
                    foundMonth = true;
                    parts.splice(i, 1);
                    break;
                }
            }
        }

        // Filter all that cannot be day/month nr.
        parts = parts.filter(function(p) {
            return isInt(p) && +p <= 31;
        });

        // If the month is found, just pick the first number as the day
        if (foundMonth) {
            if (parts[0]) {
                day = +parts[0];
            }
            else if (cDay === "end") {
                day = endOfMonth(month);
            }
            else {
                day = 1;
            }
        }
        else if (parts.length >= 2) {
            month = -1;

            // TODO
            // Allow option to prefer MM-DD-YYYY over DD-MM-YYYY
            // - For now its DD-MM-YYYY

            if (isAmbiguousDate(parts[0], parts[1]) || +parts[0] > 12) {
                day = parts[0];
                month = parts[1];
            }
            else {
                day = parts[1];
                month = parts[0];
            }
        }
        // Assumes only a month number is provided
        else if (parts.length === 1 && +parts[0] <= 12) {
            month = +parts[0];
        }


        // Date validation
        if ((year && year > 1800) && ((!day && !month) || acceptableDayMonthCombo(day, month))) {
            // Set default day if nothing found
            if (!day) {
                day = (cDay === "end") ? endOfMonth(month||cMonth) : 1;
            }

            // Month is zero based index
            var current = new Date(year, (month||cMonth)-1, day);

            return current;
        }

        return false;
    }

     mod.factory("dateGuesser", function() {
        return {
            "parse": parse,
            "normalize": normalize
        };
    });
});
