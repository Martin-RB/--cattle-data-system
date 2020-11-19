import { Router } from "express";
import { Connection } from "mysql";
import { Telemetry } from "../Common/Telemetry";
import { doQuery, IQueryResult } from "../Common/AwaitableSQL";
import { OUT_Implant, IN_Implant, IN_Implant_Implanted } from "../Common/DTO/Implant";
import { OUT_Protocol } from "../Common/DTO/Protocol";
import { GetProtocol } from "./Protocols";

export async function GetImplants(dbConn: Connection, ids: Array<string>, idUser: string){

    if(ids.length == 0){
        return [];
    }

    let qr = await doQuery(dbConn, `SELECT * 
                                    FROM implants i 
                                    WHERE id_implants IN (?) AND id_user = ?;`, [ids, idUser])
    
    if(qr.error){
        return qr.error;
    }

    let qrr = qr.result;
    let implants = new Array<OUT_Implant>();

    for (let i = 0; i < qrr.length; i++) {
        const el = qrr[i];
        
        let protResponse = await GetProtocol(dbConn, [el.id_protocols], idUser);
        let protocols = (protResponse as Array<OUT_Protocol>);

        if(protocols.length == undefined && protocols.length > 0){
            let error = protResponse as {e:any, info: string};
            return error;
        }

        let date = new Date().getTime();

        let isNow = el.dateImplanted != null && el.dateToImplant != null;
        isNow = isNow && (parseInt(el.dateToImplant) <= date);

        let implant: OUT_Implant = {
            id: el.id_implants,
            day: el.day,
            protocol: protocols[0],
            dateImplanted: el.dateImplanted!=null?el.dateImplanted:undefined,
            dateToImplant: el.dateToImplant!=null?el.dateToImplant:undefined,
            isNow
        }
        implants.push(implant);
    }
    return implants;

}

export function Implants(router: Router, dbConn: Connection, tl: Telemetry){
    router.get("/alot/:id", async (req, res) => {

        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doQuery(dbConn, `SELECT id_implants 
                                        FROM implants i 
                                        WHERE id_alots = ?;`, 
                                        [req.params.id]);
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let implants = new Array<OUT_Implant>();

        if(qrr.length == 0){
            res.send(implants);
            return;
        }

        let implantResponse = await GetImplants(dbConn, qrr.map((v:any)=>v.id_implants), req.cookies.idUser)
        let responseImpl = implantResponse as Array<OUT_Implant>;

        if(responseImpl.length == undefined){
            let error = implantResponse as {e:any, info: string};
            tl.reportInternalError(res, error.e);
            return;
        }
        
        res.send(responseImpl);
    });
/*     router.post("/", async (req, res) => {
        let p = req.body as IN_Implant;
        let date = new Date().getTime();
        let qr: IQueryResult | undefined = undefined;

        qr = await doQuery(dbConn, `INSERT INTO implants 
                                    (id_alots, id_protocols, day, create_datetime) 
                                    VALUES (?, ?, ?, ?);`, 
                                    [p.idAlot, p.idProtocol, p.day, date.toString()]);

        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    }); */

    router.put("/:id/implant", async (req, res) => {
        let p = req.body as IN_Implant_Implanted;
        let id = req.params.id;

        if(!id){
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doQuery(dbConn, `UPDATE implants 
                                        SET dateImplanted = ? 
                                        WHERE id_implants = ? AND id_user = ?`,
                                        [p.date, id, req.cookies.idUser]);

        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    })
    return router;
}