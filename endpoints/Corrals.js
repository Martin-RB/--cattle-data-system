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
exports.Corrals = exports.GetFeeds = exports.GetCorrals = void 0;
var AwaitableSQL_1 = require("../Common/AwaitableSQL");
// Feed corrals means:
// send id_corral, kgs
// We store that in  
function GetCorrals(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, qrr, corrals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ids.length == 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT * FROM corrals WHERE id_corrals IN (?) AND isEnabled = 1", [ids])];
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
exports.GetCorrals = GetCorrals;
function GetFeeds(dbConn, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, qrr, corrals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (ids.length == 0) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT * FROM feeds WHERE id_corrals IN (?)", [ids])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        return [2 /*return*/, qr.error];
                    }
                    qrr = qr.result;
                    corrals = new Array();
                    qrr.forEach(function (el) {
                        var corral = {
                            id_feeds: el.id_feeds,
                            kg: el.kg,
                            create_datetime: el.create_datetime
                        };
                        corrals.push(corral);
                    });
                    return [2 /*return*/, corrals];
            }
        });
    });
}
exports.GetFeeds = GetFeeds;
//NOt working
/*export async function verifyExistenceFeeds(dbConn: Connection, dateCheck: string) {
        //let params = req.params;
        let date = parseInt(dateCheck);
        let dateMinor = new Date(date);
        dateMinor.setHours(0,0,0,0);
        let dateMajor = new Date(date);
        dateMajor.setDate(dateMajor.getDate() + 1);
        dateMajor.setHours(0,0,0,0);
        dateMajor.setSeconds(dateMajor.getSeconds() - 1);

        /*let sql = `select c.id_corrals, c.name, f.*, a.id_alots is not null, l.id_lorries is not null, a.id_alots is not null OR l.id_lorries is not null
                FROM corrals c
                    LEFT JOIN (SELECT * FROM alots WHERE isSold = 0 AND isClosed = 1) a ON c.id_corrals = a.id_corrals
                    LEFT JOIN (Select * from lorries WHERE isWorked = 0) l ON l.idStayCorral = c.id_corrals
                    LEFT JOIN (SELECT * FROM feeds WHERE date >= ? AND date <= ?) f ON c.id_corrals = f.id_corrals
                WHERE a.id_alots is not null OR l.id_lorries is not null
                GROUP BY c.id_corrals;`;
                /
        // Deleted the elements WHERE isSold = 0 AND isClosed = 1)
        // and WHERE isWorked = 0
        let sql = `select c.id_corrals, c.name, f.*, a.id_alots is not null, l.id_lorries is not null, a.id_alots is not null OR l.id_lorries is not null
                FROM corrals c
                    LEFT JOIN (SELECT * FROM alots) a ON c.id_corrals = a.id_corrals
                    LEFT JOIN (Select * from lorries) l ON l.idStayCorral = c.id_corrals
                    LEFT JOIN (SELECT * FROM feeds WHERE date >= ? AND date <= ?) f ON c.id_corrals = f.id_corrals
                WHERE a.id_alots is not null OR l.id_lorries is not null
                GROUP BY c.id_corrals;`;
        let sql_params = [dateMinor.getTime(), dateMajor.getTime()];

        let qr = await doQuery(dbConn, sql, sql_params)
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;
        console.log("results", qrr);
        //parse the data to required format
        let feeds = new Array<OUT_Feeds>();
        qrr.forEach((el: any) => {
            let feed: OUT_Feeds = {
                id_feeds: el.id_feeds,
                id_corrals: el.id_corrals,
                name: el.name,
                kg: el.kg,
                create_datetime: el.date
            };
            feeds.push(feed);
        });

    return feeds;
}*/
function Corrals(router, dbConn, tl) {
    var _this = this;
    router.get("/alimentacion/:date", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var params, date, dateMinor, dateMajor, sql, sql_params, qr, qrr, feeds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("start");
                    params = req.params;
                    date = parseInt(params.date);
                    dateMinor = new Date(date);
                    dateMinor.setHours(0, 0, 0, 0);
                    dateMajor = new Date(date);
                    dateMajor.setDate(dateMajor.getDate() + 1);
                    dateMajor.setHours(0, 0, 0, 0);
                    dateMajor.setSeconds(dateMajor.getSeconds() - 1);
                    sql = "select c.id_corrals as idCorrals, c.name, f.*, a.id_alots is not null, l.id_lorries is not null, a.id_alots is not null OR l.id_lorries is not null\n                FROM corrals c \n                    LEFT JOIN (SELECT * FROM alots) a ON c.id_corrals = a.id_corrals \n                    LEFT JOIN (Select * from lorries) l ON l.idStayCorral = c.id_corrals \n                    LEFT JOIN (SELECT * FROM feeds WHERE date >= ? AND date <= ?) f ON c.id_corrals = f.id_corrals \n                WHERE a.id_alots is not null OR l.id_lorries is not null \n                GROUP BY c.id_corrals;";
                    sql_params = [dateMinor.getTime(), dateMajor.getTime()];
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, sql, sql_params)];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    qrr = qr.result;
                    console.log("results", qrr);
                    feeds = new Array();
                    qrr.forEach(function (el) {
                        var feed = {
                            id_feeds: el.id_feeds,
                            id_corrals: el.idCorrals,
                            name: el.name,
                            kg: el.kg,
                            create_datetime: el.date
                        };
                        feeds.push(feed);
                    });
                    res.send(feeds);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var qr, qrr, corrals, corralResponse, responseCorr, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("start");
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "SELECT id_corrals FROM corrals WHERE isEnabled = 1", [])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    qrr = qr.result;
                    corrals = new Array();
                    if (qrr.length == 0) {
                        res.send(corrals);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, GetCorrals(dbConn, qrr.map(function (v) { return v.id_corrals; }))];
                case 2:
                    corralResponse = _a.sent();
                    console.log("res", corralResponse);
                    responseCorr = corralResponse;
                    if (responseCorr.length == undefined) {
                        error = corralResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    corrals = responseCorr;
                    res.send(corrals);
                    return [2 /*return*/];
            }
        });
    }); });
    router.get("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var corralResponse, responseCorr, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, GetCorrals(dbConn, [req.params.id])];
                case 1:
                    corralResponse = _a.sent();
                    responseCorr = corralResponse;
                    if (responseCorr.length == undefined) {
                        error = corralResponse;
                        tl.reportInternalError(res, error.e);
                        return [2 /*return*/];
                    }
                    if (responseCorr.length == 0) {
                        tl.reportNotFoundError(res, req.params.id, "Corral no encontrado");
                    }
                    res.send(responseCorr[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    // place post
    router.post("/alimentacion", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var c, date, feedsArrs, sql_params, values, qr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("here");
                    c = req.body;
                    date = new Date().getTime().toString();
                    //let date = (1).toString();
                    console.log(date);
                    feedsArrs = c.map(function (v) { return [-1, v.idCorral, -1, v.idCorral, v.kg, date, date, date]; });
                    sql_params = feedsArrs.reduce(function (p, c) { return p.concat(c); }, []);
                    values = c.reduce(function (p, c, i) {
                        var ret = "";
                        if (i != 0)
                            ret += ",";
                        ret += "(?,(?),?,?, ?,?, ?, ?)";
                        return p += ret;
                    }, "");
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO feeds \n                (id_user,id_alots , id_rations, id_corrals, kg , date, create_datetime, edit_datetime) \n                VALUES " + values + ";", sql_params)];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    //let insertId = qr.result.insertId;
                    res.send();
                    return [2 /*return*/];
            }
        });
    }); });
    // Get feeds info of the day only 
    // CHECK id_corrals of the day only and retrieve all
    // Make retrieval by id for verification
    //
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var c, date, qr, insertId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    c = req.body;
                    date = new Date().getTime().toString();
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO corrals \n                                        (id_user, name, capacity, create_datetime, edit_datetime) VALUES \n                                        (?,?, ?, ?, ?);", [c.id_user, c.name, c.headNum, date, date])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    insertId = qr.result.insertId;
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO corrals_capacities \n                                        VALUES(?, ?, ?);", [insertId, c.headNum, date])];
                case 2:
                    qr = _a.sent();
                    res.send({ id: insertId });
                    return [2 /*return*/];
            }
        });
    }); });
    router.put("/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var c, date, qr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    c = req.body;
                    date = new Date().getTime().toString();
                    if (!req.params.id) {
                        tl.reportInternalError(res, "NO ID");
                        return [2 /*return*/];
                    }
                    if (!c.headNum) return [3 /*break*/, 2];
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "INSERT INTO corrals_capacities \n                                        VALUES(?, ?, ?)", [req.params.id, c.headNum, date])];
                case 1:
                    qr = _a.sent();
                    if (qr.error) {
                        tl.reportInternalError(res, qr.error);
                        return [2 /*return*/];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, AwaitableSQL_1.doEditElement(dbConn, "corrals", req.params.id, [
                        {
                            rowName: "name",
                            doEdit: c.name ? true : false,
                            value: c.name || "",
                        },
                    ], date)];
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
                    return [4 /*yield*/, AwaitableSQL_1.doQuery(dbConn, "UPDATE corrals \n                                        SET isEnabled = 0\n                                        WHERE id_corrals = ?", [req.params.id])];
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
exports.Corrals = Corrals;
