"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeOps = void 0;
var DateTimeOps = /** @class */ (function () {
    function DateTimeOps() {
    }
    DateTimeOps.daysBetween = function (date1, date2) {
        var day = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs((date1.getTime() - date2.getTime()) / day));
    };
    return DateTimeOps;
}());
exports.DateTimeOps = DateTimeOps;
