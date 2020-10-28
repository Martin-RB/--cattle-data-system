import { Router } from "express";
import { Connection } from "mysql";
import { Telemetry } from "../Common/Telemetry";
import { doQuery, doEditElement, IQueryResult } from "../Common/AwaitableSQL";
import { OUT_Corral, IN_Corral, IN_Corral_Flex } from "../Common/DTO/Corral";
// Feed corrals means:
// send id_corral, kgs
// We store that in  


export async function GetCorrals(dbConn: Connection, ids: Array<string>) {
    if (ids.length == 0) {
        return [];
    }

    let qr = await doQuery(
        dbConn,
        "SELECT * FROM corrals WHERE id_corrals IN (?)",
        [ids]
    );
    if (qr.error) {
        return qr.error;
    }
    let qrr = qr.result;

    let corrals = new Array<OUT_Corral>();
    qrr.forEach((el: any) => {
        let corral: OUT_Corral = {
            id: el.id_corrals,
            name: el.name,
            headNum: el.capacity,
        };
        corrals.push(corral);
    });

    return corrals;
}

export function Corrals(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/", async (req, res) => {
        console.log("start");
        let qr = await doQuery(
            dbConn,
            "SELECT id_corrals FROM corrals WHERE isEnabled = 1",
            []
        );
        console.log("bad");
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let corrals = new Array<OUT_Corral>();

        if (qrr.length == 0) {
            res.send(corrals);
            return;
        }

        let corralResponse = await GetCorrals(
            dbConn,
            qrr.map((v: any) => v.id_corrals)
        );
        console.log("res", corralResponse);
        let responseCorr = corralResponse as Array<OUT_Corral>;

        if (responseCorr.length == undefined) {
            let error = corralResponse as { e: any; info: string };
            tl.reportInternalError(res, error.e);
            return;
        }
        corrals = responseCorr;

        res.send(corrals);
    });

    router.get("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let corralResponse = await GetCorrals(dbConn, [req.params.id]);
        let responseCorr = corralResponse as Array<OUT_Corral>;

        if (responseCorr.length == undefined) {
            let error = corralResponse as { e: any; info: string };
            tl.reportInternalError(res, error.e);
            return;
        }

        res.send(responseCorr[0]);
    });
    // place post
    router.post("/alimentacion", async (req, res) => {
        console.log("here");
        // Create a table
        //let c = req.body as IN_Corral;
        // handle same day alimentacion with get
        let c = req.body;
        let date = new Date().getTime().toString();

        let qr = await doQuery(
            dbConn,
            `INSERT INTO feeds 
                                (id_user,id_alots , id_rations, id_corrals, kg , date, create_datetime, edit_datetime) VALUES 
                                        (?,?,?,?, ?,?, ?, ?);`,
            [c.id_user, c.id_alots, c.id_rations, c.id_corrals, c.kg, date, date, date]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let insertId = qr.result.insertId;

        res.send({ id: insertId });

    });




    router.post("/", async (req, res) => {

        let c = req.body as IN_Corral;
        let date = new Date().getTime().toString();

        let qr = await doQuery(
            dbConn,
            `INSERT INTO corrals 
                                        (id_user, name, capacity, create_datetime, edit_datetime) VALUES 
                                        (?,?, ?, ?, ?);`,
            [c.id_user, c.name, c.headNum, date, date]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let insertId = qr.result.insertId;

        qr = await doQuery(
            dbConn,
            `INSERT INTO corrals_capacities 
                                        VALUES(?, ?, ?);`,
            [insertId, c.headNum, date]
        );

        res.send({ id: insertId });
    });

    router.put("/:id", async (req, res) => {
        let c = req.body as IN_Corral_Flex;
        let date = new Date().getTime().toString();
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr: IQueryResult | undefined;

        if (c.headNum) {
            qr = await doQuery(
                dbConn,
                `INSERT INTO corrals_capacities 
                                        VALUES(?, ?, ?)`,
                [req.params.id, c.headNum, date]
            );
            if (qr.error) {
                tl.reportInternalError(res, qr.error);
                return;
            }
        }

        qr = await doEditElement(
            dbConn,
            "corrals",
            req.params.id,
            [
                {
                    rowName: "name",
                    doEdit: c.name ? true : false,
                    value: c.name || "",
                },
            ],
            date
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });

    router.delete("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doQuery(
            dbConn,
            `UPDATE corrals 
                                        SET isEnabled = 0
                                        WHERE id_corrals = ?`,
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
