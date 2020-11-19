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
exports.Implants = exports.GetImplants = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
var Protocols_1 = require("./Protocols");
function GetImplants(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, qrr, implants, i, el, protResponse, protocols, error, date, isNow, implant;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ids.length == 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT * \n                                    FROM implants i \n                                    WHERE id_implants IN (?);", [ids])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        return [2 /*return*/, qr.error];
                    }
                    qrr = qr.result;
                    implants = new Array();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < qrr.length)) return [3 /*break*/, 5];
                    el = qrr[i];
                    return [4 /*yield*/, Protocols_1.GetProtocol(dbConn, [el.id_protocols])];
                case 3:
                    protResponse = _a.sent();
                    protocols = protResponse;
                    if (protocols.length == undefined && protocols.length > 0) {
                        error = protResponse;
                        return [2 /*return*/, error];
                    }
                    date = new Date().getTime();
                    isNow = el.dateImplanted != null && el.dateToImplant != null;
                    isNow = isNow && (parseInt(el.dateToImplant) <= date);
                    implant = {
                        id: el.id_implants,
                        day: el.day,
                        protocol: protocols[0],
                        dateImplanted: el.dateImplanted != null ? el.dateImplanted : undefined,
                        dateToImplant: el.dateToImplant != null ? el.dateToImplant : undefined,
                        isNow: isNow
                    };
                    implants.push(implant);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, implants];
            }
        });
    });
}
exports.GetImplants = GetImplants;
function Implants(router, dbConn, tl) {
    var _this = this;
    router.get("/alot/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, qrr, implants, implantResponse, responseImpl, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT id_implants \n                                        FROM implants i \n                                        WHERE id_alots = ?;", [req.params.id])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    qrr = qr.result;
                    implants = new Array();
                    if (qrr.length == 0) {
                        res.send(implants);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, GetImplants(dbConn, qrr.map(function (v) { return v.id_implants; }))];
                case 2:
                    implantResponse = _a.sent();
                    responseImpl = implantResponse;
                    if (responseImpl.length == undefined) {
                        error = implantResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    res.send(responseImpl);
                    return [2 /*return*/];
            }
        });
    }); });
    /*     router.post("/", async (req, res) => {
            let p = req.body as IN_Implant;
            let date = new Date().getTime();
            let qr: IQueryResult | undefined = undefined;
    
            qr = await doQuery(dbConn, `INSERT INTO implants
                                        (id_alots, id_protocols, day, create_datetime)
                                        VALUES (?, ?, ?, ?);`,
                                        [p.idAlot, p.idProtocol, p.day, date.toString()]);
    
            if(qr.error){
                tl.reportInternalError(res, qr.error);
                return;
            }
    
            res.send();
        }); */
    router.put("/:id/implant", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var p, id, qr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = req.body;
                    id = req.params.id;
                    if (!id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "UPDATE implants \n                                        SET dateImplanted = ? \n                                        WHERE id_implants = ?", [p.date, id])];
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
exports.Implants = Implants;
