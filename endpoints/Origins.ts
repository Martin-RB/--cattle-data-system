import { Connection } from "mysql";
import { Router } from "express";
import { Telemetry } from "../Common/Telemetry";
import { doQuery, doEditElement } from "../Common/AwaitableSQL";
import { OUT_Origin, IN_Origin, IN_Origin_Flex } from "../Common/DTO/Origin";

export function Origins(router: Router, dbConn: Connection, tl: Telemetry){
    router.get("/", async (req, res) => {
        let qr = await doQuery(dbConn, "SELECT * FROM origins WHERE isEnabled = 1", []);
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let origins = new Array<OUT_Origin>();
        qrr.forEach((el:any) => {
            let origin: OUT_Origin = {
                id: el.id_origins,
                locality: el.locality,
                state: el.state
            }
            origins.push(origin);
        });
        
        res.send(origins);
    });

    router.get("/:id", async (req, res) => {
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let qr = await doQuery(dbConn, `SELECT * 
                                        FROM origins 
                                        WHERE id_origins = ? AND isEnabled = 1`, 
                                        [req.params.id]);
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let origins = new Array<OUT_Origin>();
        qrr.forEach((el:any) => {
            let origin: OUT_Origin = {
                id: el.id_origins,
                locality: el.locality,
                state: el.state
            }
            origins.push(origin);
        });
        
        res.send(origins[0]);
    });

    router.post("/", async (req, res) => {
        let b = req.body as IN_Origin;
        let date = new Date().getTime().toString();

        let qr = await doQuery(dbConn, `INSERT INTO origins 
                                        (locality, state, create_datetime, edit_datetime) VALUES 
                                        (?, ?, ?, ?);`,
                                        [b.locality, b.state, date, date]);
        
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });

    router.put("/:id", async (req,res) => {
        let b = req.body as IN_Origin_Flex;
        let date = new Date().getTime().toString();
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doEditElement(dbConn, "origins", req.params.id, [
            {rowName: "locality", doEdit: b.locality?true: false, value: b.locality || ""},
            {rowName: "state", doEdit: b.state?true: false, value: b.state || ""}
        ], date);

        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });

    router.delete("/:id", async (req, res) => {
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doQuery(dbConn, `UPDATE origins 
                                        SET isEnabled = 0
                                        WHERE id_origins = ?`,
                                        [req.params.id]);
        
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    })
    return router;
}