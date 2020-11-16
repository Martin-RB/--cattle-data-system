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
import { OUT_Head } from "../Common/DTO/Head";
import { Report } from "../Common/DTO/Report";

export async function GetAlots(dbConn: Connection, ids: Array<string>, justEnabled: boolean = true) {
    let qr = await doQuery(
        dbConn,
        `
        SELECT a.*, (a.isClosed = 1) as IsClosed, (a.isSold = 1) as IsSold, 
                GROUP_CONCAT(im.id_implants) as im_ids
        FROM alots a 
        LEFT JOIN implants im ON im.id_alots = a.id_alots 
        WHERE ${justEnabled? "a.isEnabled = 1 AND ": ""} a.id_alots IN (?) 
        GROUP BY a.id_alots;
        ;
    `,
        [ids]
    );

    if (qr.error) {
        console.log("entered", qr)
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
        console.log("aqui", ids);
        let alotResponse = await GetAlots(
            dbConn,
            ids,
            ids.map((v: any) => v.id_alots)
        );
        console.log("despues", alotResponse)
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
            SELECT id_alots FROM alots WHERE isEnabled = 1 AND isClosed = 0 AND isSold = 0;
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

    router.get("/:id/heads", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let qr = await doQuery(dbConn, 
            `SELECT h.*, a.name as alotName, c.name as corralName, 
                c.id_corrals, a.id_alots, p.name, p.id_providers, 
                p.name as providerName, wc.id_weight_class, 
                wc.name as weightClassName, (h.isSold = 1) as isSold, 
                (h.isDead = 1) as isDead FROM heads h 
                    INNER JOIN alots a ON h.idActialAlot = a.id_alots 
                    INNER JOIN corrals c ON c.id_corrals = a.id_corrals 
                    INNER JOIN lorries l ON l.id_lorries = h.id_lorries 
                    INNER JOIN providers p ON p.id_providers = l.id_providers 
                    INNER JOIN weight_class wc ON wc.id_weight_class = h.id_weight_class 
            WHERE h.idActialAlot = ?`, 
            [req.params.id])
        
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let heads = new Array<OUT_Head>();

        qr.result.forEach((el:any) => {
            heads.push({
                alotName: el.name,
                corralName: el.corralName,
                id: el.id_heads,
                idAlot: el.id_alots,
                idCorral: el.id_corrals,
                idLocal: el.localId,
                idProvider: el.id_providers,
                lastWeight: el.weight,
                providerName: el.providerName,
                sex: el.sex,
                idSexClass: el.id_weight_class,
                sexClassName: el.weightClassName,
                siniga: el.siniga,
                status: (el.isSold)?"sold":(el.isDead)?"dead":"ok",
            })
        });

        res.send(heads);
    });

    router.put("/:id/sell", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let heads: Array<{idHead: number, 
                        finalWeight: number, 
                        priceStand: number, 
                        priceTotal: number}> = req.body;
        
        let standPriceStr = "";
        let standPriceArg: Array<number> = [];
        let totalPriceStr = "";
        let totalPriceArg: Array<number> = [];
        let weightStr = "";
        let weightArg: Array<number> = [];
        let idsStr = "";
        let idsArg: Array<number> = [];

        let insWeightStr = "";
        let insWeightArg: number[][] = [];
        let date = new Date().getTime();

        heads.forEach((el, i) => {
            if(i != 0) idsStr += ","
            idsStr += "?"
            idsArg.push(el.idHead);
            standPriceStr += ` WHEN id_heads = ? THEN ? `;
            standPriceArg.push(el.idHead, el.priceStand)
            totalPriceStr += ` WHEN id_heads = ? THEN ? `;
            totalPriceArg.push(el.idHead,el.priceTotal);
            weightStr += ` WHEN id_heads = ? THEN ? `;
            weightArg.push(el.idHead, el.finalWeight);

            if(i != 0 && i < heads.length) insWeightStr += ","
            insWeightStr += "(?)"
            insWeightArg.push([el.idHead, el.finalWeight, date, -1]);
        });

        let args = [...standPriceArg, ...totalPriceArg, ...weightArg, ...idsArg]
        let upR = await doQuery(dbConn, 
            ` UPDATE heads SET isSold = 1, standPrice = CASE ${standPriceStr} END, totalPrice = CASE ${totalPriceStr} END, lastWeight = CASE ${weightStr} END WHERE id_heads IN (${idsStr})`,
            args)

        if (upR.error) {
            tl.reportInternalError(res, upR.error);
            return;
        }


        let insR = await doQuery(dbConn,
            ` INSERT INTO weight_history VALUES ${insWeightStr}`,
            insWeightArg)

        if (insR.error) {
            tl.reportInternalError(res, insR.error);
            return;
        }

        let alotResponse = await GetAlots(dbConn, [req.params.id], false);
        
        let responseAlot = alotResponse as Array<OUT_Alot>;

        if (responseAlot.length == undefined) {
            let error = alotResponse as { e: any; info: string };
            tl.reportInternalError(res, error.e);
            return;
        }

        let alot = responseAlot[0];

        let feedR = await doQuery(dbConn, 
            `
            SELECT IFNULL(SUM(kg), 0) as kg, IFNULL(SUM(cost),0) as costs 
            FROM feeds_history 
            WHERE id_heads IN (?) 
            GROUP BY id_heads`,
            [idsArg]);
        
        if (feedR.error) {
            tl.reportInternalError(res, feedR.error);
            return;
        }

        let feedData;
        if(feedR.result.length == 0){
            feedData = {costs: 0, kg: 0}
        }
        else{
            feedData = feedR.result[0];
        }

        

        let providersR = await doQuery(dbConn,
            `SELECT p.name as providerName, COUNT(id_heads) as headNumber 
            FROM providers p, lorries l, heads h
            WHERE h.id_heads IN (?) AND 
                h.id_lorries = l.id_lorries AND 
                p.id_providers = l.id_providers 
            GROUP BY p.name`,
            [idsArg])
        
        if (providersR.error) {
            tl.reportInternalError(res, providersR.error);
            return;
        }

        let providers = providersR.result.map((v:any) => {
            return {
                name: v.providerName, 
                numHeads: v.headNumber
            }
        })


        let headsPrice = heads.reduce((p,v) => p+v.priceTotal, 0);

        let result: Report = {
            alotName: alot.name,
            corralName: alot.hostCorral.name,
            feedCost: feedData.costs,
            feedKg: feedData.kg,
            headsPrice,
            headsSold: heads.length,
            headsTotal: parseInt(alot.maxHeadNum),
            providers,
            standPrice: standPriceArg.reduce((p,v) => p+v),
            total: headsPrice - parseFloat(feedData.costs),
        }

        res.send(result);
    })

    router.get("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let alots = new Array<OUT_Alot>();
        let alotResponse = await GetAlots(dbConn, [req.params.id]);
        let responseAlot = alotResponse as Array<OUT_Alot>;
        console.log("alot response", responseAlot)
        if (responseAlot.length == undefined) {
            console.log("error");
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
                [-1, idAlot, a.arrivalProtocol, p.day, date.toString()]
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
