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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alots = exports.GetAlots = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
var Implants_1 = require("./Implants");
var Protocols_1 = require("./Protocols");
var Corrals_1 = require("./Corrals");
function GetAlots(dbConn, ids, justEnabled) {
    if (justEnabled === void 0) { justEnabled = true; }
    return __awaiter(this, void 0, void 0, function () {
        var qr, alots, qrr, i, el, im_ids, _a, implResponse, protResponse, corrResponse, errors, alot;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n        SELECT a.*, (a.isClosed = 1) as IsClosed, (a.isSold = 1) as IsSold, \n                GROUP_CONCAT(im.id_implants) as im_ids\n        FROM alots a \n        LEFT JOIN implants im ON im.id_alots = a.id_alots \n        WHERE " + (justEnabled ? "a.isEnabled = 1 AND " : "") + " a.id_alots IN (?) \n        GROUP BY a.id_alots;\n        ;\n    ", [ids])];
                case 1:
                    qr = _b.sent();
                    if (qr.error) {
                        console.log("entered", qr);
                        return [2 /*return*/, qr.error];
                    }
                    alots = new Array();
                    qrr = qr.result;
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < qrr.length)) return [3 /*break*/, 5];
                    el = qrr[i];
                    im_ids = el.im_ids != null && el.im_ids.length > 0
                        ? el.im_ids.split(",")
                        : [];
                    return [4 /*yield*/, Promise.all([Implants_1.GetImplants(dbConn, im_ids),
                            Protocols_1.GetProtocol(dbConn, [el.idArrivalProtocol]),
                            Corrals_1.GetCorrals(dbConn, [el.id_corrals])])];
                case 3:
                    _a = _b.sent(), implResponse = _a[0], protResponse = _a[1], corrResponse = _a[2];
                    errors = AwaitableSQL_1.checkResponseErrors(implResponse, protResponse, corrResponse);
                    if (errors != null) {
                        return [2 /*return*/, errors];
                    }
                    if (protResponse.length == 0) {
                        return [2 /*return*/, { e: "No Protocol", info: "No Protocol" }];
                    }
                    if (corrResponse.length == 0) {
                        return [2 /*return*/, { e: "No Corral", info: "No Corral" }];
                    }
                    alot = {
                        id: el.id_alots,
                        name: el.name,
                        sex: el.sex,
                        headNum: el.heads,
                        maxHeadNum: el.maxHeads,
                        reimplants: implResponse,
                        arrivalProtocol: protResponse[0],
                        hostCorral: corrResponse[0],
                        maxWeight: el.maxWeight,
                        minWeight: el.minWeight,
                    };
                    alots.push(alot);
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, alots];
            }
        });
    });
}
exports.GetAlots = GetAlots;
function Alots(router, dbConn, tl) {
    var _this = this;
    router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, ids, alots, alotResponse, responseAlot, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n            SELECT id_alots FROM alots WHERE isEnabled = 1;\n        ", [])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    ids = qr.result;
                    console.log("ids", ids);
                    ids = ids.map(function (v) { return v.id_alots; });
                    alots = new Array();
                    console.log("aqui", ids);
                    return [4 /*yield*/, GetAlots(dbConn, ids, ids.map(function (v) { return v.id_alots; }))];
                case 2:
                    alotResponse = _a.sent();
                    console.log("despues", alotResponse);
                    responseAlot = alotResponse;
                    if (responseAlot.length == undefined) {
                        error = alotResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    res.send(responseAlot);
                    return [2 /*return*/];
            }
        });
    }); });
    // just changed the SELECT STATEMENT
    router.get("/available", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, ids, alots, ans, i, alotResponse, responseAlot, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n            SELECT id_alots FROM alots WHERE isEnabled = 1 AND isClosed = 0 AND isSold = 0;\n        ", [])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    ids = qr.result;
                    console.log("ids", ids);
                    alots = new Array();
                    ans = [];
                    if (!(ids.length != 0)) return [3 /*break*/, 5];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < ids.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, GetAlots(dbConn, ids[0].id_alots
                        //ids.map((v: any) => v.id_alots)
                        )];
                case 3:
                    alotResponse = _a.sent();
                    responseAlot = alotResponse;
                    if (responseAlot.length == undefined) {
                        error = alotResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    //alots = responseAlot;
                    ans.push(responseAlot);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    res.send(ans);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id/heads", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, heads;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT h.*, a.name as alotName, c.name as corralName, \n                c.id_corrals, a.id_alots, p.name, p.id_providers, \n                p.name as providerName, wc.id_weight_class, \n                wc.name as weightClassName, (h.isSold = 1) as isSold, \n                (h.isDead = 1) as isDead FROM heads h \n                    INNER JOIN alots a ON h.idActialAlot = a.id_alots \n                    INNER JOIN corrals c ON c.id_corrals = a.id_corrals \n                    INNER JOIN lorries l ON l.id_lorries = h.id_lorries \n                    INNER JOIN providers p ON p.id_providers = l.id_providers \n                    INNER JOIN weight_class wc ON wc.id_weight_class = h.id_weight_class \n            WHERE h.idActialAlot = ?", [req.params.id])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    heads = new Array();
                    qr.result.forEach(function (el) {
                        heads.push({
                            alotName: el.name,
                            corralName: el.corralName,
                            id: el.id_heads,
                            idAlot: el.id_alots,
                            idCorral: el.id_corrals,
                            idLocal: el.localId,
                            idProvider: el.id_providers,
                            lastWeight: el.weight,
                            providerName: el.providerName,
                            sex: el.sex,
                            idSexClass: el.id_weight_class,
                            sexClassName: el.weightClassName,
                            siniga: el.siniga,
                            status: (el.isSold) ? "sold" : (el.isDead) ? "dead" : "ok",
                        });
                    });
                    res.send(heads);
                    return [2 /*return*/];
            }
        });
    }); });
    router.put("/:id/sell", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var heads, standPriceStr, standPriceArg, totalPriceStr, totalPriceArg, weightStr, weightArg, idsStr, idsArg, insWeightStr, insWeightArg, date, args, upR, insR, alotResponse, responseAlot, error, alot, feedR, feedData, providersR, providers, headsPrice, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    heads = req.body;
                    standPriceStr = "";
                    standPriceArg = [];
                    totalPriceStr = "";
                    totalPriceArg = [];
                    weightStr = "";
                    weightArg = [];
                    idsStr = "";
                    idsArg = [];
                    insWeightStr = "";
                    insWeightArg = [];
                    date = new Date().getTime();
                    heads.forEach(function (el, i) {
                        if (i != 0)
                            idsStr += ",";
                        idsStr += "?";
                        idsArg.push(el.idHead);
                        standPriceStr += " WHEN id_heads = ? THEN ? ";
                        standPriceArg.push(el.idHead, el.priceStand);
                        totalPriceStr += " WHEN id_heads = ? THEN ? ";
                        totalPriceArg.push(el.idHead, el.priceTotal);
                        weightStr += " WHEN id_heads = ? THEN ? ";
                        weightArg.push(el.idHead, el.finalWeight);
                        if (i != 0 && i < heads.length)
                            insWeightStr += ",";
                        insWeightStr += "(?)";
                        insWeightArg.push([el.idHead, el.finalWeight, date, -1]);
                    });
                    args = __spreadArrays(standPriceArg, totalPriceArg, weightArg, idsArg);
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, " UPDATE heads SET isSold = 1, standPrice = CASE " + standPriceStr + " END, totalPrice = CASE " + totalPriceStr + " END, lastWeight = CASE " + weightStr + " END WHERE id_heads IN (" + idsStr + ")", args)];
                case 1:
                    upR = _a.sent();
                    if (upR.error) {
                        tl.reportInternalError(res, upR.error);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, " INSERT INTO weight_history VALUES " + insWeightStr, insWeightArg)];
                case 2:
                    insR = _a.sent();
                    if (insR.error) {
                        tl.reportInternalError(res, insR.error);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, GetAlots(dbConn, [req.params.id], false)];
                case 3:
                    alotResponse = _a.sent();
                    responseAlot = alotResponse;
                    if (responseAlot.length == undefined) {
                        error = alotResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    alot = responseAlot[0];
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n            SELECT IFNULL(SUM(kg), 0) as kg, IFNULL(SUM(cost),0) as costs \n            FROM feeds_history \n            WHERE id_heads IN (?) \n            GROUP BY id_heads", [idsArg])];
                case 4:
                    feedR = _a.sent();
                    if (feedR.error) {
                        tl.reportInternalError(res, feedR.error);
                        return [2 /*return*/];
                    }
                    if (feedR.result.length == 0) {
                        feedData = { costs: 0, kg: 0 };
                    }
                    else {
                        feedData = feedR.result[0];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT p.name as providerName, COUNT(id_heads) as headNumber \n            FROM providers p, lorries l, heads h\n            WHERE h.id_heads IN (?) AND \n                h.id_lorries = l.id_lorries AND \n                p.id_providers = l.id_providers \n            GROUP BY p.name", [idsArg])];
                case 5:
                    providersR = _a.sent();
                    if (providersR.error) {
                        tl.reportInternalError(res, providersR.error);
                        return [2 /*return*/];
                    }
                    providers = providersR.result.map(function (v) {
                        return {
                            name: v.providerName,
                            numHeads: v.headNumber
                        };
                    });
                    headsPrice = heads.reduce(function (p, v) { return p + v.priceTotal; }, 0);
                    result = {
                        alotName: alot.name,
                        corralName: alot.hostCorral.name,
                        feedCost: feedData.costs,
                        feedKg: feedData.kg,
                        headsPrice: headsPrice,
                        headsSold: heads.length,
                        headsTotal: parseInt(alot.maxHeadNum),
                        providers: providers,
                        standPrice: standPriceArg.reduce(function (p, v) { return p + v; }),
                        total: headsPrice - parseFloat(feedData.costs),
                    };
                    res.send(result);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var alots, alotResponse, responseAlot, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    alots = new Array();
                    return [4 /*yield*/, GetAlots(dbConn, [req.params.id])];
                case 1:
                    alotResponse = _a.sent();
                    responseAlot = alotResponse;
                    console.log("alot response", responseAlot);
                    if (responseAlot.length == undefined) {
                        console.log("error");
                        error = alotResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    alots = responseAlot;
                    res.send(alots[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var a, date, qr, idAlot, i, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a = req.body;
                    date = new Date().getTime();
                    qr = undefined;
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n            INSERT INTO alots \n            (id_user, maxHeads, maxWeight, minWeight, \n                name, sex, id_corrals, \n                idArrivalProtocol, create_datetime, edit_datetime) \n            VALUES (?,?,?,?,?,?,?,?,?,?);\n        ", [
                            -1,
                            a.maxHeadNum,
                            a.maxWeight,
                            a.minWeight,
                            a.name,
                            a.sex,
                            a.hostCorral,
                            a.arrivalProtocol,
                            date.toString(),
                            date.toString(),
                        ])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    idAlot = qr.result.insertId;
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < a.reimplants.length)) return [3 /*break*/, 5];
                    p = a.reimplants[i];
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n                INSERT INTO implants \n                (id_user,id_alots, id_protocols, day, create_datetime) \n                VALUES (?,?, ?, ?, ?);\n            ", [-1, idAlot, a.arrivalProtocol, p.day, date.toString()])];
                case 3:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    res.send({ id: idAlot });
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
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "UPDATE alots\n                                    SET isEnabled = 0 \n                                    WHERE id_alots = ?;", [req.params.id])];
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
exports.Alots = Alots;
