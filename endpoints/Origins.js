"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Origins = exports.GetOrigins = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
function GetOrigins(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, qrr, origins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n        SELECT * FROM origins WHERE id_origins IN (?);\n    ", [ids])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        return [2 /*return*/, qr.error];
                    }
                    qrr = qr.result;
                    origins = new Array();
                    qrr.forEach(function (el) {
                        var origin = {
                            id: el.id_origins,
                            locality: el.locality,
                            state: el.state
                        };
                        origins.push(origin);
                    });
                    return [2 /*return*/, origins];
            }
        });
    });
}
exports.GetOrigins = GetOrigins;
function Origins(router, dbConn, tl) {
    var _this = this;
    router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, ids, origins, originResponse, responseOrigin, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT id_origins FROM origins WHERE isEnabled = 1", [])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    ids = qr.result;
                    origins = new Array();
                    if (!(ids.length != 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, GetOrigins(dbConn, ids.map(function (v) { return v.id_origins; }))];
                case 2:
                    originResponse = _a.sent();
                    responseOrigin = originResponse;
                    if (responseOrigin.length == undefined) {
                        error = originResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    origins = responseOrigin;
                    _a.label = 3;
                case 3:
                    res.send(origins);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, qrr, origins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT * \n                                        FROM origins \n                                        WHERE id_origins = ? AND isEnabled = 1", [req.params.id])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    qrr = qr.result;
                    origins = new Array();
                    qrr.forEach(function (el) {
                        var origin = {
                            id: el.id_origins,
                            locality: el.locality,
                            state: el.state
                        };
                        origins.push(origin);
                    });
                    res.send(origins[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var b, date, qr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    b = req.body;
                    date = new Date().getTime().toString();
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO origins \n                                        (locality, state, create_datetime, edit_datetime) VALUES \n                                        (?, ?, ?, ?);", [b.locality, b.state, date, date])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    res.send();
                    return [2 /*return*/];
            }
        });
    }); });
    router.put("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var b, date, qr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    b = req.body;
                    date = new Date().getTime().toString();
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doEditElement(dbConn, "origins", req.params.id, [
                            { rowName: "locality", doEdit: b.locality ? true : false, value: b.locality || "" },
                            { rowName: "state", doEdit: b.state ? true : false, value: b.state || "" }
                        ], date)];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    res.send();
                    return [2 /*return*/];
            }
        });
    }); });
    router.delete("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "UPDATE origins \n                                        SET isEnabled = 0\n                                        WHERE id_origins = ?", [req.params.id])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    res.send();
                    return [2 /*return*/];
            }
        });
    }); });
    return router;
}
exports.Origins = Origins;
