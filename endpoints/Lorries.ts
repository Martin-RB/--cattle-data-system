import { Connection } from "mysql";
import { doQuery, checkResponseErrors } from "../Common/AwaitableSQL";
import { OUT_Lorry, IN_Lorry, } from "../Common/DTO/Lorry";
import { OUT_WeightClassfy } from "../Common/DTO/WeightClassfy";
import { GetCorrals } from "./Corrals";
import { GetOrigins } from "./Origins";
import { OUT_Corral } from "../Common/DTO/Corral";
import { OUT_Origin } from "../Common/DTO/Origin";
import { OUT_Provider } from "../Common/DTO/Provider";
import { IN_Heads } from "../Common/DTO/Heads";
import { DateTimeOps } from "../Common/DateTimeOps";
import { GetProviders } from "./Providers";
import { Router } from "express";
import { Telemetry } from "../Common/Telemetry";

export async function GetLorries(dbConn: Connection, ids: Array<string>, idUser: string) {
    if (ids.length == 0) {
        return [];
    }
    let qr = await doQuery(
        dbConn,
        `
        SELECT l.*, COUNT(wc.id_weight_class) as cls_cnt, GROUP_CONCAT(wc.id_weight_class) as cls_ids, GROUP_CONCAT(wc.name) as cls_names,
            GROUP_CONCAT(wc.heads) as cls_heads, GROUP_CONCAT(wc.cost) as cls_cost, GROUP_CONCAT(wc.sex) as cls_sex 
        FROM lorries l 
        LEFT JOIN weight_class wc ON wc.id_lorries = l.id_lorries 
        WHERE l.id_lorries IN (?) 
        GROUP BY l.id_lorries; 
    `,
        [ids]
    );

    if (qr.error) {
        return qr.error;
    }
    let qrr = qr.result;

    let lorries = new Array<OUT_Lorry>();

    for (let i = 0; i < qrr.length; i++) {
        const el = qrr[i];
        let classes = new Array<OUT_WeightClassfy>();
        if (el.cls_cnt > 0) {
            let cls_ids = el.cls_ids.split(",");
            let cls_names = el.cls_names.split(",");
            let cls_heads = el.cls_heads.split(",");
            let cls_cost = el.cls_cost.split(",");
            let cls_sex = el.cls_sex.split(",");

            for (let i = 0; i < el.cls_cnt; i++) {
                let clss: OUT_WeightClassfy = {
                    cost: cls_cost[i],
                    heads: cls_heads[i],
                    id: cls_ids[i],
                    name: cls_names[i],
                    sex: cls_sex[i],
                };
                classes.push(clss);
            }
        }

        let corralResponse = await GetCorrals(dbConn, [el.idStayCorral], idUser);
        let originResponse = await GetOrigins(dbConn, [el.id_origins], idUser);
        let providerResponse = await GetProviders(dbConn, [el.id_providers], idUser);
        let errors = checkResponseErrors(
            corralResponse,
            originResponse,
            providerResponse
        );
        if (errors != null) {
            return errors;
        }

        /*if ((corralResponse as Array<OUT_Corral>).length == 0) {
            return { e: "No Corral", info: "No Protocol" };
        }
        if ((originResponse as Array<OUT_Origin>).length == 0) {
            return { e: "No Origin", info: "No Corral" };
        }
        if ((providerResponse as Array<OUT_Provider>).length == 0) {
            return { e: "No Provider", info: "No Corral" };
        }*/

        let openDays = -1;
        if (el.workDate != null) {
            openDays = DateTimeOps.daysBetween(
                new Date(el.workDate),
                new Date(el.arrivalDate)
            );
        }

        let lorry: OUT_Lorry = {
            femaleClassfies: classes.filter((el) => el.sex == "female"),
            maleClassfies: classes.filter((el) => el.sex == "male"),
            arrivalDate: el.arrivalDate,
            entryCorral: (corralResponse as Array<OUT_Corral>)[0],
            origin: (originResponse as Array<OUT_Origin>)[0],
            provider: (providerResponse as Array<OUT_Provider>)[0],
            id: el.id_lorries,
            maxHeads: el.heads,
            plateNum: el.plate,
            weight: el.arrivalWeight,
            openDays: openDays,
        };

        lorries.push(lorry);
    }

    return lorries;
}

export function Lorries(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/", async (req, res) => {
        /*let qr = await doQuery(
            dbConn,
            `
            DELETE FROM lorries;
        `,
            []
        );*/
        let qr = await doQuery(
            dbConn,
            `
            SELECT id_lorries FROM lorries;
        `,
            []
        );
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let ids = qr.result;
        console.log(ids);

        let lorries = new Array<OUT_Lorry>();
        if (ids.length != 0) {
            let lorriesResponse = await GetLorries(
                dbConn,
                ids.map((v: any) => v.id_lorries),
                req.cookies.idUser
            );
            let responseLorries = lorriesResponse as Array<OUT_Lorry>;

            if (responseLorries.length == undefined) {
                let error = lorriesResponse as { e: any; info: string };
                tl.reportInternalError(res, error.e);
                return;
            }
            lorries = responseLorries;
        }

        res.send(lorries);
    });

    router.get("/notWorked", async (req, res) => {
        let qr = await doQuery(
            dbConn,
            `
            SELECT id_lorries FROM lorries
            WHERE isWorked = 0 AND id_user = ?;
        `,
            [req.cookies.idUser]
        );
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let ids = qr.result;

        let lorries = new Array<OUT_Lorry>();
        if (ids.length != 0) {
            let lorriesResponse = await GetLorries(
                dbConn,
                ids.map((v: any) => v.id_lorries),
                req.cookies.idUser
            );
            let responseLorries = lorriesResponse as Array<OUT_Lorry>;

            if (responseLorries.length == undefined) {
                let error = lorriesResponse as { e: any; info: string };
                tl.reportInternalError(res, error.e);
                return;
            }
            lorries = responseLorries;
        }

        res.send(lorries);
    });

    router.get("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let protResponse = await GetLorries(dbConn, [req.params.id], req.cookies.idUser);
        let responseProts = protResponse as Array<OUT_Lorry>;

        if (responseProts.length == undefined) {
            let error = protResponse as { e: any; info: string };
            tl.reportInternalError(res, error.e);
            return;
        }
        res.send(responseProts[0]);
    });

    router.post("/", async (req, res) => {
        let p = req.body as IN_Lorry;
        let date = new Date().getTime().toString();

        let qr = await doQuery(
            dbConn,
            `
            INSERT INTO lorries 
                (id_user,plate, id_origins, id_providers, heads, 
                    arrivalWeight, idStayCorral, arrivalDate,
                    create_datetime, edit_datetime) 
                VALUES (?,?,?,?,?,?,?,?,?,?);
        `,
            [
                req.cookies.idUser,
                p.plateNum,
                -1,
                p.provider,
                p.maxHeads,
                p.weight,
                p.entryCorral,
                p.arrivalDate,
                date,
                date,
            ]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let idLorry = qr.result.insertId;

        let values_str = "";
        let values_arr = [];
        let classfyQr = null;
        if(p.maleClassfies.length > 0){
            for (let i = 0; i < p.maleClassfies.length; i++) {
                if (i != 0) {
                    values_str += ",";
                }
                const el = p.maleClassfies[i];
                values_arr.push(req.cookies.idUser,idLorry, el.name, -1, el.cost, "male", date);
                values_str += "(?,?,?,?,?,?,?)";
            }

            classfyQr = await doQuery(
                dbConn,
                `
                INSERT INTO weight_class 
                    (id_user,id_lorries, name, heads, cost, sex, create_datetime) VALUES 
                    :values:;
            `.replace(":values:", values_str),
                values_arr
            );

            if (classfyQr.error) {
                tl.reportInternalError(res, classfyQr.error);
                console.log(classfyQr.obj.sql);

                return;
            }
        }
        // agregar female
        if(p.femaleClassfies.length > 0){
            values_str = "";
            values_arr = [];
            for (let i = 0; i < p.femaleClassfies.length; i++) {
                if (i != 0) {
                    values_str += ",";
                }
                const el = p.femaleClassfies[i];
                values_arr.push(req.cookies.idUser,idLorry, el.name, -1, el.cost, "female", date);
                values_str += "(?,?,?,?,?,?,?)";
            }
            classfyQr = await doQuery(
                dbConn,
                `
                INSERT INTO weight_class 
                    (id_user,id_lorries, name, heads, cost, sex, create_datetime) VALUES 
                    :values:;
            `.replace(":values:", values_str),
                values_arr
            );

            if (classfyQr.error) {
                tl.reportInternalError(res, classfyQr.error);
                console.log(classfyQr.obj.sql);

                return;
            }

        }
        

        res.send({id: idLorry});
    });
    // Place the get all for a specific ID. 
    // Post the heads of the jaulas
    router.post('/:id/heads', async (req, res) => {
        let data = req.body as IN_Heads[];
        let date = new Date().getTime().toString();
        let lorryID = req.params.id;
        console.log(lorryID);
        let sql = "";
        let sql_params = [];
        //let searchArr = ['idBreed', 'idAlot', 'siniga', 'localID', 'sex', 'weight'];
        // post 1 by one
        // Use the in and out
        /*sql = `
        INSERT INTO Heads 
            (id_breeds, idActualAlot, siniga, localID, sex, weight, id_lorries) 
            VALUES (?,?,?,?,?,?,?)";`;*/
       
        let valuesStr = "";
        let valuesArr: string[] = [];
        data.forEach((el, i) => {
            if(i != 0) valuesStr += ","
            valuesStr += "(?,?,?,?,?,?,?,?,?,?,?,?)";
            valuesArr.push(req.cookies.idUser, "-1", lorryID , el.idAlot??"NULL" , el.siniga, el.idLocal, el.sex, el.weight.toString(), date, date, "-1", el.sexClass.toString())
        });
       sql = `
            INSERT INTO heads 
                (id_user,id_breeds,id_lorries, idActialAlot, siniga, localId, 
                    sex, weight, create_datetime, edit_datetime, weightRatio, id_weight_class) 
                VALUES ${valuesStr};
        `
       sql_params = [];
        let qr = await doQuery(dbConn, sql, valuesArr);

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        sql = `
            UPDATE lorries SET isWorked = 1 WHERE id_lorries = ?
        `
        let qrr = await doQuery(dbConn, sql, [lorryID]);
        // 
        if (qrr.error) {
            tl.reportInternalError(res, qrr.error);
            return;
        }
        res.send();

    });

    return router;
}
