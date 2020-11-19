"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telemetry = void 0;
var CustomConsole_1 = require("./CustomConsole");
var Telemetry = /** @class */ (function () {
    function Telemetry(endpoint) {
        var _this = this;
        this.endpoint = endpoint;
        this.reportInternalError = function (response, data) {
            var date = new Date().getTime();
            CustomConsole_1.cerr(_this.endpoint + " :: " + date + " >> Internal error");
            console.log(data);
            console.log("***************************************************");
            response.statusMessage = "Ocurrió un error, contacte administrador: " + date;
            response.setHeader("ERROR_TEXT", response.statusMessage);
            response.status(500);
            response.send(response.statusMessage);
        };
        this.reportCustomError = function (response, data, message) {
            var date = new Date().getTime();
            CustomConsole_1.cerr(_this.endpoint + " :: " + date + " >> Error: " + message);
            console.log(data);
            console.log("***************************************************");
            response.statusMessage = message + ": " + date;
            response.setHeader("ERROR_TEXT", response.statusMessage);
            response.status(500);
            response.send(response.statusMessage);
        };
        this.reportNotFoundError = function (response, data, message) {
            var date = new Date().getTime();
            CustomConsole_1.cerr(_this.endpoint + " :: " + date + " >> NotFound: " + message);
            console.log(data);
            console.log("***************************************************");
            response.statusMessage = message + ": " + date;
            response.setHeader("ERROR_TEXT", response.statusMessage);
            response.status(404);
            response.send(response.statusMessage);
        };
    }
    return Telemetry;
}());
exports.Telemetry = Telemetry;
