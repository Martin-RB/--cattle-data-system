"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function doQuery(con, sql, sql_params) {
    return new Promise(function (resolve, reject) {
        try {
            var sql_1 = sql.replace(/(\n|\t)/gmi, "");
            con.query(sql_1, sql_params, function (error, result, fields) {
                if (error) {
                    reject({ e: error, info: JSON.stringify({ type: "Query", sql_: sql_1, sql_params: sql_params }) });
                    return;
                }
                resolve({ con: con, result: result, fields: fields });
            });
        }
        catch (error) {
            reject({ e: error, info: { type: "Query", sql: sql, sql_params: sql_params } });
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
