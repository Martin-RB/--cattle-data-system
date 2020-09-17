import { Router } from "express";
import { Connection } from "mysql";
import { Telemetry } from "../Common/Telemetry";
import { doQuery, doEditElement } from "../Common/AwaitableSQL";
import { OUT_Breed, IN_Breed, IN_Breed_Flex } from "../Common/DTO/Breed";

export function Breeds(router: Router, dbConn: Connection, tl: Telemetry){
    router.get("/", async (req, res) => {
        let qr = await doQuery(dbConn, "SELECT * FROM breeds WHERE isEnabled = 1", []);
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let breeds = new Array<OUT_Breed>();
        qrr.forEach((el:any) => {
            let breed: OUT_Breed = {
                id: el.id_breeds,
                name: el.name
            }
            breeds.push(breed);
        });
        
        res.send(breeds);
    });

    router.get("/:id", async (req, res) => {
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let qr = await doQuery(dbConn, 
                        "SELECT * FROM breeds WHERE id_breeds = ? AND isEnabled = 1", 
                        [req.params.id]);
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let breeds = new Array<OUT_Breed>();
        qrr.forEach((el:any) => {
            let breed: OUT_Breed = {
                id: el.id_breeds,
                name: el.name
            }
            breeds.push(breed);
        });
        
        res.send(breeds[0]);
    });

    router.post("/", async (req, res) => {
        let b = req.body as IN_Breed;
        let date = new Date().getTime().toString();

        let qr = await doQuery(dbConn, `INSERT INTO breeds 
                                        (name, create_datetime, edit_datetime) VALUES 
                                        (?, ?, ?);`,
                                        [b.name, date, date]);
        
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });

    router.put("/:id", async (req,res) => {
        let b = req.body as IN_Breed_Flex;
        let date = new Date().getTime().toString();
        if(!req.params.id){
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doEditElement(dbConn, "breeds", req.params.id, [
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

        let qr = await doQuery(dbConn, `UPDATE breeds 
                                        SET isEnabled = 0
                                        WHERE id_breeds = ?`,
                                        [req.params.id]);
        
        if(qr.error){
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    })
    return router;
}