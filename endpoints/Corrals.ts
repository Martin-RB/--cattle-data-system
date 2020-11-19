import { Router } from "express";
import { Connection } from "mysql";
import { Telemetry } from "../Common/Telemetry";
import { doQuery, doEditElement, IQueryResult } from "../Common/AwaitableSQL";
import { OUT_Corral, IN_Corral, IN_Corral_Flex } from "../Common/DTO/Corral";
import { IN_Feeds, OUT_Feeds } from "../Common/DTO/Feeds";
// Feed corrals means:
// send id_corral, kgs
// We store that in  


export async function GetCorrals(dbConn: Connection, ids: Array<string>, idUser: string) {
    if (ids.length == 0) {
        return [];
    }

    let qr = await doQuery(
        dbConn,
        "SELECT * FROM corrals WHERE id_corrals IN (?) AND isEnabled = 1 AND id_user = ?",
        [ids, idUser]
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

export async function GetFeeds(dbConn: Connection, ids: Array<string>, idUser: string) {
    if (ids.length == 0) {
        return [];
    }

    let qr = await doQuery(
        dbConn,
        "SELECT * FROM feeds WHERE id_corrals IN (?) AND id_user = ?",
        [ids, idUser]
    );
    if (qr.error) {
        return qr.error;
    }
    let qrr = qr.result;

    let corrals = new Array<OUT_Feeds>();
    qrr.forEach((el: any) => {
        let corral: OUT_Feeds = {
            id_feeds: el.id_feeds,
            kg: el.kg,
            create_datetime: el.create_datetime
        };
        corrals.push(corral);
    });

    return corrals;
}

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

export function Corrals(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/alimentacion/:date", async (req, res) => {
        console.log("start");
        let params = req.params;
        let date = parseInt(params.date);
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
                GROUP BY c.id_corrals;`;*/
        // Deleted the elements WHERE isSold = 0 AND isClosed = 1) 
        // and WHERE isWorked = 0 
        let sql = `select c.id_corrals as idCorrals, c.name, f.*, a.id_alots is not null, l.id_lorries is not null, a.id_alots is not null OR l.id_lorries is not null
                FROM corrals c 
                    LEFT JOIN (SELECT * FROM alots) a ON c.id_corrals = a.id_corrals 
                    LEFT JOIN (Select * from lorries) l ON l.idStayCorral = c.id_corrals 
                    LEFT JOIN (SELECT * FROM feeds WHERE date >= ? AND date <= ?) f ON c.id_corrals = f.id_corrals 
                WHERE c.id_user = ? AND (a.id_alots is not null OR (l.id_lorries is not null and l.isWorked = 0)) 
                GROUP BY c.id_corrals;`;
        let sql_params = [dateMinor.getTime(), dateMajor.getTime(), req.cookies.idUser];

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
                id_corrals: el.idCorrals,
                name: el.name,
                kg: el.kg,
                create_datetime: el.date
            };
            feeds.push(feed);
        });
        res.send(feeds);
    });

    router.get("/", async (req, res) => {
        console.log("start");
        let qr = await doQuery(
            dbConn,
            "SELECT id_corrals FROM corrals WHERE isEnabled = 1 AND id_user = ?",
            [req.cookies.idUser]
        );
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
            qrr.map((v: any) => v.id_corrals),
            req.cookies.idUser
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

        let corralResponse = await GetCorrals(dbConn, [req.params.id], req.cookies.idUser);
        let responseCorr = corralResponse as Array<OUT_Corral>;

        if (responseCorr.length == undefined) {
            let error = corralResponse as { e: any; info: string };
            tl.reportInternalError(res, error.e);
            return;
        }
         if (responseCorr.length == 0) {
            tl.reportNotFoundError(
                res,
                req.params.id,
                "Corral no encontrado"
            );
        }

        res.send(responseCorr[0]);
    });
    // place post
    router.post("/alimentacion", async (req, res) => {
        console.log("here");
        // Create a table
        //let c = req.body as IN_Corral;

        let c = req.body as IN_Feeds[];
        let date = new Date().getTime().toString();
        //let date = (1).toString();
        console.log(date);
        // handle same day alimentacion with get

        let feedsArrs = c.map((v) => [req.cookies.idUser,v.idCorral,-1,v.idCorral, v.kg, date, date ,date]);
        let sql_params = feedsArrs.reduce((p,c) => p.concat(c), [])
        let values = c.reduce((p,c,i)=>{
            let ret = ""
            if(i != 0) ret += ","
            ret += "(?,(?),?,?, ?,?, ?, ?)";
            return p += ret
        }, "");

        let qr = await doQuery(
            dbConn,
            `INSERT INTO feeds 
                (id_user,id_alots , id_rations, id_corrals, kg , date, create_datetime, edit_datetime) 
                VALUES ${values};`,
            sql_params
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        //let insertId = qr.result.insertId;

        res.send();

    });

    // Get feeds info of the day only 
    // CHECK id_corrals of the day only and retrieve all
    // Make retrieval by id for verification
    //
   


    router.post("/", async (req, res) => {

        let c = req.body as IN_Corral;
        let date = new Date().getTime().toString();

        let qr = await doQuery(
            dbConn,
            `INSERT INTO corrals 
                                        (id_user, name, capacity, create_datetime, edit_datetime) VALUES 
                                        (?,?, ?, ?, ?);`,
            [req.cookies.idUser, c.name, c.headNum, date, date]
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
