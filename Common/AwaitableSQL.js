"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResponseErrors = exports.doEditElement = exports.doQuery = void 0;
function doQuery(con, sql, sql_params) {
    return new Promise(function (resolve, reject) {
        try {
            var sql_1 = sql.replace(/(\n|\t)/gmi, "");
            var obj_1 = con.query(sql_1, sql_params, function (error, result, fields) {
                if (error) {
                    resolve({ obj: obj_1, con: con, result: result, error: {
                            e: error,
                            info: JSON.stringify({ type: "Query", sql_: sql_1, sql_params: sql_params })
                        } });
                    return;
                }
                resolve({ con: con, result: result, error: null, obj: obj_1 });
            });
        }
        catch (error) {
            reject({ con: con, result: null, error: { e: error, info: { type: "Query", sql: sql, sql_params: sql_params } } });
        }
    });
}
exports.doQuery = doQuery;
function doEditElement(con, table, id, rowsToEdit, date) {
    var caseWhen = "";
    var values = [];
    rowsToEdit.forEach(function (el, i) {
        caseWhen += el.rowName + " = CASE WHEN " + (el.doEdit ? "True" : "False") + " THEN ? ELSE " + el.rowName + " END, ";
        values.push(el.value);
    });
    values.push(date);
    var sql = "UPDATE " + table + " SET " + caseWhen + " edit_datetime = ? WHERE id_" + table + " = " + id;
    return doQuery(con, sql, values);
}
exports.doEditElement = doEditElement;
function checkResponseErrors() {
    var responses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        responses[_i] = arguments[_i];
    }
    var arr = responses;
    for (var i = 0; i < arr.length; i++) {
        var el = arr[i];
        var _el = el;
        if (_el.length == undefined) {
            var error = el;
            return error;
        }
    }
    return null;
}
exports.checkResponseErrors = checkResponseErrors;
