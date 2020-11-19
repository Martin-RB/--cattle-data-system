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
exports.Lorries = exports.GetLorries = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
var Corrals_1 = require("./Corrals");
var Origins_1 = require("./Origins");
var DateTimeOps_1 = require("../Common/DateTimeOps");
var Providers_1 = require("./Providers");
function GetLorries(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, qrr, lorries, i, el, classes, cls_ids, cls_names, cls_heads, cls_cost, cls_sex, i_1, clss, corralResponse, originResponse, providerResponse, errors, openDays, lorry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ids.length == 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n        SELECT l.*, COUNT(wc.id_weight_class) as cls_cnt, GROUP_CONCAT(wc.id_weight_class) as cls_ids, GROUP_CONCAT(wc.name) as cls_names,\n            GROUP_CONCAT(wc.heads) as cls_heads, GROUP_CONCAT(wc.cost) as cls_cost, GROUP_CONCAT(wc.sex) as cls_sex \n        FROM lorries l \n        LEFT JOIN weight_class wc ON wc.id_lorries = l.id_lorries \n        WHERE l.id_lorries IN (?) \n        GROUP BY l.id_lorries; \n    ", [ids])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        return [2 /*return*/, qr.error];
                    }
                    qrr = qr.result;
                    lorries = new Array();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < qrr.length)) return [3 /*break*/, 7];
                    el = qrr[i];
                    classes = new Array();
                    if (el.cls_cnt > 0) {
                        cls_ids = el.cls_ids.split(",");
                        cls_names = el.cls_names.split(",");
                        cls_heads = el.cls_heads.split(",");
                        cls_cost = el.cls_cost.split(",");
                        cls_sex = el.cls_sex.split(",");
                        for (i_1 = 0; i_1 < el.cls_cnt; i_1++) {
                            clss = {
                                cost: cls_cost[i_1],
                                heads: cls_heads[i_1],
                                id: cls_ids[i_1],
                                name: cls_names[i_1],
                                sex: cls_sex[i_1],
                            };
                            classes.push(clss);
                        }
                    }
                    return [4 /*yield*/, Corrals_1.GetCorrals(dbConn, [el.idStayCorral])];
                case 3:
                    corralResponse = _a.sent();
                    return [4 /*yield*/, Origins_1.GetOrigins(dbConn, [el.id_origins])];
                case 4:
                    originResponse = _a.sent();
                    return [4 /*yield*/, Providers_1.GetProviders(dbConn, [el.id_providers])];
                case 5:
                    providerResponse = _a.sent();
                    errors = AwaitableSQL_1.checkResponseErrors(corralResponse, originResponse, providerResponse);
                    if (errors != null) {
                        return [2 /*return*/, errors];
                    }
                    openDays = -1;
                    if (el.workDate != null) {
                        openDays = DateTimeOps_1.DateTimeOps.daysBetween(new Date(el.workDate), new Date(el.arrivalDate));
                    }
                    lorry = {
                        femaleClassfies: classes.filter(function (el) { return el.sex == "female"; }),
                        maleClassfies: classes.filter(function (el) { return el.sex == "male"; }),
                        arrivalDate: el.arrivalDate,
                        entryCorral: corralResponse[0],
                        origin: originResponse[0],
                        provider: providerResponse[0],
                        id: el.id_lorries,
                        maxHeads: el.heads,
                        plateNum: el.plate,
                        weight: el.arrivalWeight,
                        openDays: openDays,
                    };
                    lorries.push(lorry);
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/, lorries];
            }
        });
    });
}
exports.GetLorries = GetLorries;
function Lorries(router, dbConn, tl) {
    var _this = this;
    router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, ids, lorries, lorriesResponse, responseLorries, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n            SELECT id_lorries FROM lorries;\n        ", [])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    ids = qr.result;
                    console.log(ids);
                    lorries = new Array();
                    if (!(ids.length != 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, GetLorries(dbConn, ids.map(function (v) { return v.id_lorries; }))];
                case 2:
                    lorriesResponse = _a.sent();
                    responseLorries = lorriesResponse;
                    if (responseLorries.length == undefined) {
                        error = lorriesResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    lorries = responseLorries;
                    _a.label = 3;
                case 3:
                    res.send(lorries);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/notWorked", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, ids, lorries, lorriesResponse, responseLorries, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n            SELECT id_lorries FROM lorries\n            WHERE isWorked = 0;\n        ", [])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    ids = qr.result;
                    lorries = new Array();
                    if (!(ids.length != 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, GetLorries(dbConn, ids.map(function (v) { return v.id_lorries; }))];
                case 2:
                    lorriesResponse = _a.sent();
                    responseLorries = lorriesResponse;
                    if (responseLorries.length == undefined) {
                        error = lorriesResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    lorries = responseLorries;
                    _a.label = 3;
                case 3:
                    res.send(lorries);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var protResponse, responseProts, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, GetLorries(dbConn, [req.params.id])];
                case 1:
                    protResponse = _a.sent();
                    responseProts = protResponse;
                    if (responseProts.length == undefined) {
                        error = protResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    res.send(responseProts[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var p, date, qr, idLorry, values_str, values_arr, classfyQr, i, el, i, el;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = req.body;
                    date = new Date().getTime().toString();
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n            INSERT INTO lorries \n                (id_user,plate, id_origins, id_providers, heads, \n                    arrivalWeight, idStayCorral, arrivalDate,\n                    create_datetime, edit_datetime) \n                VALUES (?,?,?,?,?,?,?,?,?,?);\n        ", [
                            -1,
                            p.plateNum,
                            -1,
                            p.provider,
                            p.maxHeads,
                            p.weight,
                            p.entryCorral,
                            p.arrivalDate,
                            date,
                            date,
                        ])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    idLorry = qr.result.insertId;
                    values_str = "";
                    values_arr = [];
                    classfyQr = null;
                    if (!(p.maleClassfies.length > 0)) return [3 /*break*/, 3];
                    for (i = 0; i < p.maleClassfies.length; i++) {
                        if (i != 0) {
                            values_str += ",";
                        }
                        el = p.maleClassfies[i];
                        values_arr.push(-1, idLorry, el.name, -1, el.cost, "male", date);
                        values_str += "(?,?,?,?,?,?,?)";
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n                INSERT INTO weight_class \n                    (id_user,id_lorries, name, heads, cost, sex, create_datetime) VALUES \n                    :values:;\n            ".replace(":values:", values_str), values_arr)];
                case 2:
                    classfyQr = _a.sent();
                    if (classfyQr.error) {
                        tl.reportInternalError(res, classfyQr.error);
                        console.log(classfyQr.obj.sql);
                        return [2 /*return*/];
                    }
                    _a.label = 3;
                case 3:
                    if (!(p.femaleClassfies.length > 0)) return [3 /*break*/, 5];
                    values_str = "";
                    values_arr = [];
                    for (i = 0; i < p.femaleClassfies.length; i++) {
                        if (i != 0) {
                            values_str += ",";
                        }
                        el = p.femaleClassfies[i];
                        values_arr.push(-1, idLorry, el.name, -1, el.cost, "female", date);
                        values_str += "(?,?,?,?,?,?,?)";
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "\n                INSERT INTO weight_class \n                    (id_user,id_lorries, name, heads, cost, sex, create_datetime) VALUES \n                    :values:;\n            ".replace(":values:", values_str), values_arr)];
                case 4:
                    classfyQr = _a.sent();
                    if (classfyQr.error) {
                        tl.reportInternalError(res, classfyQr.error);
                        console.log(classfyQr.obj.sql);
                        return [2 /*return*/];
                    }
                    _a.label = 5;
                case 5:
                    res.send({ id: idLorry });
                    return [2 /*return*/];
            }
        });
    }); });
    // Place the get all for a specific ID. 
    // Post the heads of the jaulas
    router.post('/:id/heads', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var data, date, lorryID, sql, sql_params, qr, idHeads;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = req.body;
                    date = new Date().getTime().toString();
                    lorryID = req.params.id;
                    console.log(lorryID);
                    sql = "";
                    sql_params = [];
                    //let searchArr = ['idBreed', 'idAlot', 'siniga', 'localID', 'sex', 'weight'];
                    // post 1 by one
                    // Use the in and out
                    /*sql = `
                    INSERT INTO Heads
                        (id_breeds, idActualAlot, siniga, localID, sex, weight, id_lorries)
                        VALUES (?,?,?,?,?,?,?)";`;*/
                    sql = "\n            INSERT INTO heads \n                (id_user,id_breeds,id_lorries, idActialAlot, siniga, localID, \n                    sex, weight, create_datetime, edit_datetime, weightRatio, id_weight_class) \n                VALUES (?,?,?,?,?,?,?,?,?,?,?,?);\n        ";
                    sql_params = [-1, -1, lorryID, data.idAlot, data.siniga, data.localID, data.sex, data.weight, date, date, -1, data.sexClass];
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, sql, sql_params)];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    idHeads = qr.result.insertId;
                    res.send({ id: idHeads });
                    return [2 /*return*/];
            }
        });
    }); });
    return router;
}
exports.Lorries = Lorries;
