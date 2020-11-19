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
exports.Search = exports.GetAloatsQuery = exports.GetHeadsQuery = exports.GetCorralsQuery = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
var Implants_1 = require("./Implants");
var Corrals_1 = require("./Corrals");
var Protocols_1 = require("./Protocols");
function GetCorralsQuery(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, qrr, corrals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT * FROM corrals c WHERE isEnabled = 1 AND c.name LIKE (?) ", [ids[0].concat('%')])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        return [2 /*return*/, qr.error];
                    }
                    qrr = qr.result;
                    corrals = new Array();
                    qrr.forEach(function (el) {
                        var corral = {
                            id: el.id_corrals,
                            name: el.name,
                            headNum: el.capacity,
                        };
                        corrals.push(corral);
                    });
                    return [2 /*return*/, corrals];
            }
        });
    });
}
exports.GetCorralsQuery = GetCorralsQuery;
function GetHeadsQuery(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, heads;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT * FROM heads h WHERE h.siniga LIKE (?) ", [ids[0].concat('%')])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        return [2 /*return*/, qr.error];
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
                    return [2 /*return*/, heads];
            }
        });
    });
}
exports.GetHeadsQuery = GetHeadsQuery;
function GetAloatsQuery(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, qrr, alots, i, el, im_ids, _a, implResponse, protResponse, corrResponse, errors, alot;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT * FROM alots a WHERE isEnabled = 1 AND a.name LIKE (?) ", [ids[0].concat('%')])];
                case 1:
                    qr = _b.sent();
                    if (qr.error) {
                        return [2 /*return*/, qr.error];
                    }
                    qrr = qr.result;
                    alots = new Array();
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
exports.GetAloatsQuery = GetAloatsQuery;
function Search(router, dbConn, tl) {
    var _this = this;
    router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var b, texto, corrals, corralesResponse, respuestaCorral, error, heads, headResponse, respuestaHead, error, alots, alotResponse, respuestaAlot, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    b = req.body;
                    texto = b.search || "";
                    corrals = new Array();
                    return [4 /*yield*/, GetCorralsQuery(dbConn, [texto])];
                case 1:
                    corralesResponse = _a.sent();
                    respuestaCorral = corralesResponse;
                    if (respuestaCorral.length == undefined) {
                        error = corralesResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    corrals = respuestaCorral;
                    heads = new Array();
                    return [4 /*yield*/, GetHeadsQuery(dbConn, [texto])];
                case 2:
                    headResponse = _a.sent();
                    respuestaHead = headResponse;
                    if (respuestaHead.length == undefined) {
                        error = headResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    heads = respuestaHead;
                    alots = new Array();
                    return [4 /*yield*/, GetAloatsQuery(dbConn, [texto])];
                case 3:
                    alotResponse = _a.sent();
                    respuestaAlot = alotResponse;
                    if (respuestaAlot.length == undefined) {
                        error = alotResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    alots = respuestaAlot;
                    res.send({ alots: alots, heads: heads, corrals: corrals });
                    return [2 /*return*/];
            }
        });
    }); });
    return router;
}
exports.Search = Search;
