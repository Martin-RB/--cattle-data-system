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
exports.Protocols = exports.GetProtocol = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
function GetProtocol(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qrProtocols, qrrProtocols, protocols;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ids.length == 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT p.name, p.id_protocols, COUNT(m.id_medicines) as meds_count, \n                                                    GROUP_CONCAT(m.name) as meds_name, GROUP_CONCAT(m.isPerHead = 1) as meds_isPerHead,\n                                                    GROUP_CONCAT(m.presentation) as meds_presentation, GROUP_CONCAT(m.mlApplication) as meds_mlApplication,\n                                                    GROUP_CONCAT(m.kgApplication) as meds_kgApplication, GROUP_CONCAT(m.actualCost) as meds_actualCost, \n                                                    GROUP_CONCAT(m.id_medicines) as meds_id \n                                            FROM protocols p \n                                            LEFT JOIN medicine_protocol mp ON p.id_protocols = mp.id_protocols \n                                            LEFT JOIN medicines m ON mp.id_medicines = m.id_medicines \n                                            WHERE p.id_protocols IN (?) AND \n                                                    (mp.create_datetime is null OR p.edit_datetime >= mp.create_datetime)\n                                                    AND p.isEnabled = 1\n                                            GROUP BY p.id_protocols;", [ids])];
                case 1:
                    qrProtocols = _a.sent();
                    if (qrProtocols.error) {
                        return [2 /*return*/, qrProtocols.error];
                    }
                    qrrProtocols = qrProtocols.result;
                    protocols = new Array();
                    qrrProtocols.forEach(function (el) {
                        var medicines = new Array();
                        //console.log("info agregar", el);
                        if (el.meds_count > 0) {
                            var meds_id_arr = el.meds_id.split(",");
                            var meds_name_arr = el.meds_name.split(",");
                            var meds_isPerHead_arr = el.meds_isPerHead.split(",");
                            var meds_presentation_arr = el.meds_presentation.split(",");
                            var meds_mlApplication_arr = el.meds_mlApplication.split(",");
                            var meds_actualCost_arr = "";
                            if (el.meds_actualCost != null) {
                                meds_actualCost_arr = el.meds_actualCost.split(",");
                            }
                            var meds_kgApplication_arr = el.meds_kgApplication.split(",");
                            for (var i = 0; i < el.meds_count; i++) {
                                var medicine = {
                                    id: meds_id_arr[i],
                                    name: meds_name_arr[i],
                                    isPerHead: meds_isPerHead_arr[i] == 1,
                                    presentation: parseFloat(meds_presentation_arr[i]),
                                    mlApplication: parseFloat(meds_mlApplication_arr[i]),
                                    cost: parseFloat(meds_actualCost_arr[i]),
                                    kgApplication: parseFloat(meds_kgApplication_arr[i]),
                                };
                                medicines.push(medicine);
                            }
                        }
                        var protocol = {
                            id: el.id_protocols,
                            name: el.name,
                            medicines: medicines,
                        };
                        protocols.push(protocol);
                    });
                    return [2 /*return*/, protocols];
            }
        });
    });
}
exports.GetProtocol = GetProtocol;
function Protocols(router, dbConn, tl) {
    var _this = this;
    router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, ids, protocols, protResponse, responseProts, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT id_protocols \n                                        FROM protocols \n                                        WHERE isEnabled = 1;", [])];
                case 1:
                    qr = _a.sent();
                    ids = qr.result;
                    protocols = new Array();
                    if (!(ids.length != 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, GetProtocol(dbConn, ids.map(function (v) { return v.id_protocols; }))];
                case 2:
                    protResponse = _a.sent();
                    responseProts = protResponse;
                    if (responseProts.length == undefined) {
                        error = protResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    protocols = responseProts;
                    _a.label = 3;
                case 3:
                    res.send(protocols);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var protResponse, responseProts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, GetProtocol(dbConn, [req.params.id])];
                case 1:
                    protResponse = _a.sent();
                    responseProts = protResponse;
                    if (responseProts.length == 0) {
                        tl.reportNotFoundError(res, req.params.id, "Protocolo no encontrado");
                    }
                    res.send(responseProts[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var p, date, qr, success, idProtocol, medicines_string, medicines_args;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = req.body;
                    date = new Date().getTime();
                    qr = undefined;
                    success = true;
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO protocols \n                                    (id_user,name, create_datetime, edit_datetime)\n                                    VALUES (?,?, ?, ?);", [-1, p.name, date.toString(), date.toString()])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    idProtocol = qr.result.insertId;
                    medicines_string = "";
                    medicines_args = [];
                    p.medicines.forEach(function (el, i) {
                        if (i != 0) {
                            medicines_string += ", ";
                        }
                        medicines_string += "(?,?,?,?)";
                        medicines_args.push(-1, el, idProtocol, date);
                    });
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO medicine_protocol  \n                                    (id_user, id_medicines, id_protocols, create_datetime) \n                                    VALUES " + medicines_string + ";", medicines_args)];
                case 2:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    res.send({ id: idProtocol });
                    return [2 /*return*/];
            }
        });
    }); });
    router.put("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var p, date, qr, medicines_string_1, medicines_args_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    p = req.body;
                    date = new Date().getTime();
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    if (!p.medicines) return [3 /*break*/, 2];
                    medicines_string_1 = "";
                    medicines_args_1 = [];
                    p.medicines.forEach(function (el, i) {
                        if (!el.id) {
                            throw "Medicines no id. Idx = " + i;
                        }
                        if (i != 0) {
                            medicines_string_1 += ", ";
                        }
                        medicines_string_1 += "(?,?,?)";
                        medicines_args_1.push(el.id, req.params.id, date);
                    });
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO medicine_protocol  \n                                        (id_medicines, id_protocols, create_datetime) \n                                        VALUES " + medicines_string_1 + ";", medicines_args_1)];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, AwaitableSQL_1.doEditElement(dbConn, "protocols", req.params.id, [
                        {
                            rowName: "name",
                            doEdit: p.name != undefined,
                            value: p.name || '""',
                        },
                    ], date.toString())];
                case 3:
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
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "UPDATE protocols \n                                    SET isEnabled = 0 \n                                    WHERE id_protocols = ?;", [req.params.id])];
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
exports.Protocols = Protocols;
