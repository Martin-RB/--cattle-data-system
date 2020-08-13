import { Connection } from "mysql";
import { Router } from "express";
import { Telemetry } from "../Common/Telemetry";
import { doQuery, doEditElement } from "../Common/AwaitableSQL";
import { OUT_Origin, IN_Origin, IN_Origin_Flex } from "../Common/DTO/Origin";
import { OUT_Provider, IN_Provider, IN_Provider_Flex } from "../Common/DTO/Provider";

export function Providers(router: Router, dbConn: Connection, tl: Telemetry){
    router.get("/", async (req, res) => {
        let qr = await doQuery(dbConn, "SELECT * FROM providers WHERE isEnabled = 1", []);
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let providers = new Array<OUT_Provider>();
        qrr.forEach((el:any) => {
            let provider: OUT_Provider = {
                id: el.id_providers,
                name: el.name
            }
            providers.push(provider);
        });
        
        res.send(providers);
    });

    router.get("/:id", async (req, res) => {
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let qr = await doQuery(dbConn, `SELECT * 
                                        FROM providers 
                                        WHERE id_providers = ? AND isEnabled = 1`, 
                                        [req.params.id]);
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let providers = new Array<OUT_Provider>();
        qrr.forEach((el:any) => {
            let provider: OUT_Provider = {
                id: el.id_providers,
                name: el.name
            }
            providers.push(provider);
        });
        
        res.send(providers[0]);
    });

    router.post("/", async (req, res) => {
        let p = req.body as IN_Provider;
        let date = new Date().getTime().toString();

        let qr = await doQuery(dbConn, `INSERT INTO providers 
                                        (name, create_datetime, edit_datetime) VALUES 
                                        (?, ?, ?);`,
                                        [p.name, date, date]);
        
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });

    router.put("/:id", async (req,res) => {
        let b = req.body as IN_Provider_Flex;
        let date = new Date().getTime().toString();
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doEditElement(dbConn, "providers", req.params.id, [
            {rowName: "name", doEdit: b.name?true: false, value: b.name || ""}
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

        let qr = await doQuery(dbConn, `UPDATE providers 
                                        SET isEnabled = 0
                                        WHERE id_providers = ?`,
                                        [req.params.id]);
        
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    })
    return router;
}