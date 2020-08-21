import { Connection } from "mysql";
import { Telemetry } from "../Common/Telemetry";
import { Router, response } from "express";
import { doQuery, IQueryResult } from "../Common/AwaitableSQL";
import { OUT_Alot, IN_Alot } from "../Common/DTO/Alot";
import { GetImplants } from "./Implants";
import { GetProtocol } from "./Protocols";
import { GetCorrals } from "./Corrals";
import { OUT_Implant } from "../Common/DTO/Implant";
import { OUT_Protocol } from "../Common/DTO/Protocol";
import { OUT_Corral } from "../Common/DTO/Corral";

export async function GetAlots(dbConn: Connection, ids: Array<string>){
    let qr = await doQuery(dbConn, `
        SELECT a.*, (a.isClosed = 1) as IsClosed, (a.isSold = 1) as IsSold, 
                GROUP_CONCAT(im.id_implants) as im_ids
        FROM alots a 
        LEFT JOIN implants im ON im.id_alots = a.id_alots 
        WHERE a.isEnabled = 1 AND a.id_alots IN (?) 
        GROUP BY a.id_alots;
        ;
    `, [ids]);

    if(qr.error){
        return qr.error;
    }


    let alots = new Array<OUT_Alot>();

    let qrr = qr.result;

    for (let i = 0; i < qrr.length; i++) {
        const el = qrr[i];
        
        let im_ids = (el.im_ids != null && el.im_ids.length > 0)?el.im_ids.split(","):[];

        let implResponse = await GetImplants(dbConn, im_ids);
        let protResponse = await GetProtocol(dbConn, [el.idArrivalProtocol])
        let corrResponse = await GetCorrals(dbConn, [el.id_corrals]);
        let errors = checkResponseErrors(implResponse, protResponse, corrResponse);
        if(errors != null){
            return errors;
        }

        if((protResponse as Array<OUT_Protocol>).length == 0){
            return {e: "No Protocol", info: "No Protocol"}
        }
        if((corrResponse as Array<OUT_Corral>).length == 0){
            return {e: "No Corral", info: "No Corral"}
        }

        let alot: OUT_Alot = {
            id: el.id_alots,
            name: el.name,
            sex: el.sex,
            headNum: el.heads,
            maxHeadNum: el.maxHeads,
            reimplants: implResponse as Array<OUT_Implant>,
            arrivalProtocol: (protResponse as Array<OUT_Protocol>)[0],
            hostCorral: (corrResponse as Array<OUT_Corral>)[0],
            maxWeight: el.maxWeight,
            minWeight: el.minWeight
        }
        alots.push(alot);
    }

    return alots;
}

function checkResponseErrors(implResponse:any, protResponse:any, corrResponse:any){
    let arr = [protResponse,corrResponse,implResponse];

    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        let _el = el as Array<any>;
        if(_el.length == undefined){
            let error = el as {e:any, info: string};
            return error;
        }
    }
    return null;
}

export function Alots(router: Router, dbConn: Connection, tl: Telemetry){    
    router.get("/", async (req, res) => {
        let qr = await doQuery(dbConn, `
            SELECT id_alots FROM alots WHERE isEnabled = 1;
        `, []);

        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        let ids = qr.result;
        let alots = new Array<OUT_Alot>();
        if(ids.length != 0){
            let alotResponse = await GetAlots(dbConn, ids.map((v:any) => v.id_alots));
            let responseAlot = (alotResponse as Array<OUT_Alot>);


            if(responseAlot.length == undefined){
                let error = alotResponse as {e:any, info: string};
                tl.reportInternalError(res, error.e);
                return;
            }
            alots = responseAlot;
        }

        res.send(alots);
    });

    router.get("/:id", async (req, res) => {
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let alots = new Array<OUT_Alot>();
        let alotResponse = await GetAlots(dbConn, [req.params.id]);
        let responseAlot = (alotResponse as Array<OUT_Alot>);

        if(responseAlot.length == undefined){
            let error = alotResponse as {e:any, info: string};
            tl.reportInternalError(res, error.e);
            return;
        }
        alots = responseAlot;

        res.send(alots[0]);
    });

    router.post("/", async (req, res) => {
        let a = req.body as IN_Alot;
        let date = new Date().getTime();
        let qr: IQueryResult | undefined = undefined;

        qr = await doQuery(dbConn, `
            INSERT INTO alots 
            (maxHeads, maxWeight, minWeight, 
                name, sex, id_corrals, 
                idArrivalProtocol, create_datetime, edit_datetime) 
            VALUES (?,?,?,?,?,?,?,?,?);
        `, [a.maxHeadNum, a.maxWeight, a.minWeight,
            a.name, a.sex, a.hostCorral,
            a.arrivalProtocol, date.toString(), date.toString()]);

        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        let idAlot = qr.result.insertId;

        for (let i = 0; i < a.reimplants.length; i++) {
            const p = a.reimplants[i];
            qr = await doQuery(dbConn, `
                INSERT INTO implants 
                (id_alots, id_protocols, day, create_datetime) 
                VALUES (?, ?, ?, ?);
            `, [idAlot, p.idProtocol, p.day, date.toString()]);

            if(qr.error){
                tl.reportInternalError(res, qr.error);
                return;
            }
        }

        

        res.send();
    });
    return router;
}