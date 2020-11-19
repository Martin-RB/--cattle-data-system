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
exports.Medicines = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
function Medicines(router, dbConn, tl) {
    var _this = this;
    router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, qrr, medicines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT *, (isPerHead = 1) as cisPerHead FROM medicines WHERE isEnabled = 1", [])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    qrr = qr.result;
                    medicines = new Array();
                    qrr.forEach(function (el) {
                        var medicine = {
                            id: el.id_medicines,
                            name: el.name,
                            isPerHead: el.cisPerHead == 1,
                            cost: el.actualCost,
                            presentation: el.presentation,
                            mlApplication: el.mlApplication,
                            kgApplication: el.kgApplication,
                        };
                        medicines.push(medicine);
                    });
                    res.send(medicines);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, qrr, medicines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT *, (isPerHead = 1) as cisPerHead FROM medicines WHERE isEnabled = 1 AND id_medicines = ?", [req.params.id])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    qrr = qr.result;
                    if (qrr.length == 0) {
                        tl.reportNotFoundError(res, req.params.id, "Medicamento no encontrado");
                    }
                    medicines = new Array();
                    qrr.forEach(function (el) {
                        var medicine = {
                            id: el.id_medicines,
                            name: el.name,
                            isPerHead: el.cisPerHead == 1,
                            cost: el.actualCost,
                            presentation: el.presentation,
                            mlApplication: el.mlApplication,
                            kgApplication: el.kgApplication,
                        };
                        medicines.push(medicine);
                    });
                    res.send(medicines[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var m, date, qr, idMedicine;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    m = req.body;
                    date = new Date().getTime();
                    qr = undefined;
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO medicines \n                                    (id_user, name, isPerHead, presentation, mlApplication, kgApplication, create_datetime, edit_datetime, actualCost)\n                                    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?);", [
                            -1,
                            m.name,
                            m.isPerHead ? 1 : 0,
                            ((_a = m.presentation) === null || _a === void 0 ? void 0 : _a.toString()) || 0,
                            ((_b = m.mlApplication) === null || _b === void 0 ? void 0 : _b.toString()) || 0,
                            ((_c = m.kgApplication) === null || _c === void 0 ? void 0 : _c.toString()) || 0,
                            date.toString(),
                            date.toString(),
                            m.cost,
                        ])];
                case 1:
                    qr = _d.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    idMedicine = qr.result.insertId;
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO medicine_costs \n                                    (id_user,id_medicines, cost, create_datetime) \n                                    VALUES (?,?, ?, ?);", [-1, idMedicine, m.cost, date])];
                case 2:
                    qr = _d.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    res.send({ id: idMedicine });
                    return [2 /*return*/];
            }
        });
    }); });
    router.put("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var m, date, qr;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    m = req.body;
                    date = new Date().getTime();
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    if (!m.cost) return [3 /*break*/, 2];
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO medicine_costs \n                                    (id_medicines, cost, create_datetime) \n                                    VALUES (?, ?, ?);", [req.params.id, m.cost.toString(), date.toString()])];
                case 1:
                    qr = _d.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    _d.label = 2;
                case 2: return [4 /*yield*/, AwaitableSQL_1.doEditElement(dbConn, "medicines", req.params.id, [
                        {
                            rowName: "name",
                            doEdit: m.name != undefined,
                            value: m.name || '""',
                        },
                        {
                            rowName: "isPerHead",
                            doEdit: m.isPerHead != undefined,
                            value: m.isPerHead ? 1 : 0,
                        },
                        {
                            rowName: "presentation",
                            doEdit: m.presentation != undefined,
                            value: ((_a = m.presentation) === null || _a === void 0 ? void 0 : _a.toString()) || '""',
                        },
                        {
                            rowName: "mlApplication",
                            doEdit: m.mlApplication != undefined,
                            value: ((_b = m.mlApplication) === null || _b === void 0 ? void 0 : _b.toString()) || '""',
                        },
                        {
                            rowName: "kgApplication",
                            doEdit: m.kgApplication != undefined,
                            value: ((_c = m.kgApplication) === null || _c === void 0 ? void 0 : _c.toString()) || '""',
                        },
                    ], date.toString())];
                case 3:
                    qr = _d.sent();
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
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "UPDATE medicines \n                                    SET isEnabled = 0 \n                                    WHERE id_medicines = ?;", [req.params.id])];
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
exports.Medicines = Medicines;
