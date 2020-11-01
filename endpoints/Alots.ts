import { Connection } from "mysql";
import { Telemetry } from "../Common/Telemetry";
import { Router, response } from "express";
import {
    doQuery,
    IQueryResult,
    checkResponseErrors,
} from "../Common/AwaitableSQL";
import { OUT_Alot, IN_Alot } from "../Common/DTO/Alot";
import { GetImplants } from "./Implants";
import { GetProtocol } from "./Protocols";
import { GetCorrals } from "./Corrals";
import { OUT_Implant } from "../Common/DTO/Implant";
import { OUT_Protocol } from "../Common/DTO/Protocol";
import { OUT_Corral } from "../Common/DTO/Corral";

export async function GetAlots(dbConn: Connection, ids: Array<string>) {
    let qr = await doQuery(
        dbConn,
        `
        SELECT a.*, (a.isClosed = 1) as IsClosed, (a.isSold = 1) as IsSold, 
                GROUP_CONCAT(im.id_implants) as im_ids
        FROM alots a 
        LEFT JOIN implants im ON im.id_alots = a.id_alots 
        WHERE a.isEnabled = 1 AND a.id_alots IN (?) 
        GROUP BY a.id_alots;
        ;
    `,
        [ids]
    );

    if (qr.error) {
        return qr.error;
    }

    let alots = new Array<OUT_Alot>();

    let qrr = qr.result;

    for (let i = 0; i < qrr.length; i++) {
        const el = qrr[i];

        let im_ids =
            el.im_ids != null && el.im_ids.length > 0
                ? el.im_ids.split(",")
                : [];

        let [implResponse,
            protResponse,
            corrResponse] = await Promise.all([GetImplants(dbConn, im_ids),
                GetProtocol(dbConn, [el.idArrivalProtocol]),
                GetCorrals(dbConn, [el.id_corrals])]);

        /* let implResponse = await GetImplants(dbConn, im_ids);
        let protResponse = await GetProtocol(dbConn, [el.idArrivalProtocol]);
        let corrResponse = await GetCorrals(dbConn, [el.id_corrals]); */
        let errors = checkResponseErrors(
            implResponse,
            protResponse,
            corrResponse
        );
        if (errors != null) {
            return errors;
        }

        if ((protResponse as Array<OUT_Protocol>).length == 0) {
            return { e: "No Protocol", info: "No Protocol" };
        }
        if ((corrResponse as Array<OUT_Corral>).length == 0) {
            return { e: "No Corral", info: "No Corral" };
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
            minWeight: el.minWeight,
        };
        alots.push(alot);
    }

    return alots;
}

export function Alots(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/", async (req, res) => {
        let qr = await doQuery(
            dbConn,
            `
            SELECT id_alots FROM alots WHERE isEnabled = 1;
        `,
            []
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let ids = qr.result;
        console.log("ids", ids);
        ids = (ids as Array<{id_alots: number}>).map(v=>v.id_alots);
        
        let alots = new Array<OUT_Alot>();

        let alotResponse = await GetAlots(
            dbConn,
            ids
            //ids.map((v: any) => v.id_alots)
        );
        let responseAlot = alotResponse as Array<OUT_Alot>;

        if (responseAlot.length == undefined) {
            let error = alotResponse as { e: any; info: string };
            tl.reportInternalError(res, error.e);
            return;
        }
        
        res.send(responseAlot);
        //res.send(alots);
    });
    // just changed the SELECT STATEMENT
    router.get("/available", async (req, res) => {
        let qr = await doQuery(
            dbConn,
            `
            SELECT id_alots FROM alots WHERE isEnabled = 1 AND isClosed = 0;
        `,
            []
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let ids = qr.result;
        console.log("ids", ids);
        let alots = new Array<OUT_Alot>();
        let ans = [];
        if (ids.length != 0) {
            for(let i = 0; i < ids.length; i++){
                let alotResponse = await GetAlots(
                    dbConn,
                    ids[0].id_alots
                    //ids.map((v: any) => v.id_alots)
                );
                let responseAlot = alotResponse as Array<OUT_Alot>;

                if (responseAlot.length == undefined) {
                    let error = alotResponse as { e: any; info: string };
                    tl.reportInternalError(res, error.e);
                    return;
                }
                //alots = responseAlot;
                ans.push(responseAlot);
            }
        }
        res.send(ans);
        //res.send(alots);
    });

    router.get("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let alots = new Array<OUT_Alot>();
        let alotResponse = await GetAlots(dbConn, [req.params.id]);
        let responseAlot = alotResponse as Array<OUT_Alot>;

        if (responseAlot.length == undefined) {
            let error = alotResponse as { e: any; info: string };
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

        qr = await doQuery(
            dbConn,
            `
            INSERT INTO alots 
            (id_user, maxHeads, maxWeight, minWeight, 
                name, sex, id_corrals, 
                idArrivalProtocol, create_datetime, edit_datetime) 
            VALUES (?,?,?,?,?,?,?,?,?,?);
        `,
            [
                -1,
                a.maxHeadNum,
                a.maxWeight,
                a.minWeight,
                a.name,
                a.sex,
                a.hostCorral,
                a.arrivalProtocol,
                date.toString(),
                date.toString(),
            ]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let idAlot = qr.result.insertId;

        for (let i = 0; i < a.reimplants.length; i++) {
            const p = a.reimplants[i];
            qr = await doQuery(
                dbConn,
                `
                INSERT INTO implants 
                (id_user,id_alots, id_protocols, day, create_datetime) 
                VALUES (?,?, ?, ?, ?);
            `,
                [-1, idAlot, p.idProtocol, p.day, date.toString()]
            );

            if (qr.error) {
                tl.reportInternalError(res, qr.error);
                return;
            }
        }

        res.send({ id: idAlot });
    });

    router.delete("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr: IQueryResult | undefined;

        qr = await doQuery(
            dbConn,
            `UPDATE alots
                                    SET isEnabled = 0 
                                    WHERE id_alots = ?;`,
            [req.params.id]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });
    return router;
}
