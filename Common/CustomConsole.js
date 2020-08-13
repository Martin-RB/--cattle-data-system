"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log("I: ", args);
}
exports.clog = clog;
function cerr() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log("E: ", args);
}
exports.cerr = cerr;
function cwar() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log("W: ", args);
}
exports.cwar = cwar;
