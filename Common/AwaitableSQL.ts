import { Connection, FieldInfo } from "mysql";

export interface IQueryResult{
    con: Connection, result: any, error: {e: any, info: string} | null 
}

export interface IRowEdit{
    rowName: string,
    doEdit: boolean,
    value: any,
}

export function doQuery(con: Connection, sql: string, sql_params: Array<any>) {
    return new Promise<IQueryResult>((resolve, reject) =>{
        try {
            let sql_ = sql.replace(/(\n|\t)/gmi, "");
            con.query(sql_, sql_params, (error, result, fields) =>{
                if(error){
                    resolve({con, result, error:{
                                                    e: error, 
                                                    info: JSON.stringify({type: "Query", sql_, sql_params})
                                                }});
                    return;
                }
                resolve({con, result, error: null});
            })
        } catch (error) {
            reject({con, result:null, error: {e:error, info: {type: "Query", sql, sql_params}}});
        }
    })
}

export function doEditElement(con: Connection, table: string, id: string, rowsToEdit: Array<IRowEdit>, date: string){
    let caseWhen = ``;
    let values: any[] = [];
    rowsToEdit.forEach((el,i) => {
        caseWhen += `${el.rowName} = CASE WHEN ${el.doEdit?"True":"False"} THEN ? ELSE ${el.rowName} END, `;
        values.push(el.value);
    });
    values.push(date)
    let sql = `UPDATE ${table} SET ${caseWhen} edit_datetime = ? WHERE id_${table} = ${id}`;
    return doQuery(con, sql, values);
}