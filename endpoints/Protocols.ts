import { Router } from "express";
import { Connection } from "mysql";
import { doQuery, IQueryResult, doEditElement } from "../Common/AwaitableSQL";
import {
    OUT_Medicine,
    IN_Medicine,
    IN_Medicine_Flex,
} from "../Common/DTO/Medicine";
import { Telemetry } from "../Common/Telemetry";
import {
    OUT_Protocol,
    IN_Protocol,
    IN_Protocol_Flex,
} from "../Common/DTO/Protocol";

export async function GetProtocol(dbConn: Connection, ids: Array<string>) {
    if (ids.length == 0) {
        return [];
    }
    let qrProtocols: IQueryResult | undefined;

    qrProtocols = await doQuery(
        dbConn,
        `SELECT p.name, p.id_protocols, COUNT(m.id_medicines) as meds_count, 
                                                    GROUP_CONCAT(m.name) as meds_name, GROUP_CONCAT(m.isPerHead = 1) as meds_isPerHead,
                                                    GROUP_CONCAT(m.presentation) as meds_presentation, GROUP_CONCAT(m.mlApplication) as meds_mlApplication,
                                                    GROUP_CONCAT(m.kgApplication) as meds_kgApplication, GROUP_CONCAT(m.actualCost) as meds_actualCost, 
                                                    GROUP_CONCAT(m.id_medicines) as meds_id 
                                            FROM protocols p 
                                            LEFT JOIN medicine_protocol mp ON p.id_protocols = mp.id_protocols 
                                            LEFT JOIN medicines m ON mp.id_medicines = m.id_medicines 
                                            WHERE p.id_protocols IN (?) AND 
                                                    (mp.create_datetime is null OR p.edit_datetime >= mp.create_datetime)
                                                    AND p.isEnabled = 1
                                            GROUP BY p.id_protocols;`,
        [ids]
    );

    if (qrProtocols.error) {
        return qrProtocols.error;
    }

    let qrrProtocols = qrProtocols!.result;

    // Porting
    let protocols = new Array<OUT_Protocol>();

    qrrProtocols.forEach((el: any) => {
        let medicines = new Array<OUT_Medicine>();
        //console.log("info agregar", el);
        if (el.meds_count > 0) {
            let meds_id_arr = el.meds_id.split(",");
            let meds_name_arr = el.meds_name.split(",");
            let meds_isPerHead_arr = el.meds_isPerHead.split(",");
            let meds_presentation_arr = el.meds_presentation.split(",");
            let meds_mlApplication_arr = el.meds_mlApplication.split(",");
            let meds_actualCost_arr = "";
            if (el.meds_actualCost != null) {
                meds_actualCost_arr = el.meds_actualCost.split(",");
            }
            let meds_kgApplication_arr = el.meds_kgApplication.split(",");

            for (let i = 0; i < el.meds_count; i++) {
                let medicine: OUT_Medicine = {
                    id: meds_id_arr[i],
                    name: meds_name_arr[i],
                    isPerHead: meds_isPerHead_arr[i] == 1,
                    presentation: parseFloat(meds_presentation_arr[i]),
                    mlApplication: parseFloat(meds_mlApplication_arr[i]),
                    cost: parseFloat(meds_actualCost_arr[i]),
                    kgApplication: parseFloat(meds_kgApplication_arr[i]),
                };
                medicines.push(medicine);
            }
        }

        let protocol: OUT_Protocol = {
            id: el.id_protocols,
            name: el.name,
            medicines: medicines,
        };
        protocols.push(protocol);
    });

    return protocols;
}

export function Protocols(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/", async (req, res) => {
        let qr = await doQuery(
            dbConn,
            `SELECT id_protocols 
                                        FROM protocols 
                                        WHERE isEnabled = 1;`,
            []
        );

        let ids = qr.result;
        let protocols = new Array<OUT_Protocol>();
        if (ids.length != 0) {
            let protResponse = await GetProtocol(
                dbConn,
                ids.map((v: any) => v.id_protocols)
            );
            let responseProts = protResponse as Array<OUT_Protocol>;

            if (responseProts.length == undefined) {
                let error = protResponse as { e: any; info: string };
                tl.reportInternalError(res, error.e);
                return;
            }
            protocols = responseProts;
        }

        res.send(protocols);
    });

    router.get("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let protResponse = await GetProtocol(dbConn, [req.params.id]);
        let responseProts = protResponse as Array<OUT_Protocol>;

        
        if (responseProts.length == 0) {
            tl.reportNotFoundError(
                res,
                req.params.id,
                "Protocolo no encontrado"
            );
        }
        res.send(responseProts[0]);
    });

    router.post("/", async (req, res) => {
        let p = req.body as IN_Protocol;
        let date = new Date().getTime();
        let qr: IQueryResult | undefined = undefined;
        let success = true;
        qr = await doQuery(
            dbConn,
            `INSERT INTO protocols 
                                    (id_user,name, create_datetime, edit_datetime)
                                    VALUES (?,?, ?, ?);`,
            [-1, p.name, date.toString(), date.toString()]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let idProtocol = qr.result.insertId;

        let medicines_string = ``;
        let medicines_args: Array<any> = [];

        p.medicines.forEach((el, i) => {
            if (i != 0) {
                medicines_string += ", ";
            }
            medicines_string += "(?,?,?,?)";
            medicines_args.push(-1, el, idProtocol, date);
        });

        qr = await doQuery(
            dbConn,
            `INSERT INTO medicine_protocol  
                                    (id_user, id_medicines, id_protocols, create_datetime) 
                                    VALUES ${medicines_string};`,
            medicines_args
        );
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }
        res.send({ id: idProtocol });
    });

    router.put("/:id", async (req, res) => {
        let p = req.body as IN_Protocol_Flex;
        let date = new Date().getTime();

        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr: IQueryResult;

        if (p.medicines) {
            let medicines_string = ``;
            let medicines_args: Array<any> = [];

            p.medicines.forEach((el, i) => {
                if (!el.id) {
                    throw "Medicines no id. Idx = " + i;
                }
                if (i != 0) {
                    medicines_string += ", ";
                }
                medicines_string += "(?,?,?)";
                medicines_args.push(el.id, req.params.id, date);
            });

            qr = await doQuery(
                dbConn,
                `INSERT INTO medicine_protocol  
                                        (id_medicines, id_protocols, create_datetime) 
                                        VALUES ${medicines_string};`,
                medicines_args
            );

            if (qr.error) {
                tl.reportInternalError(res, qr.error);
                return;
            }
        }

        qr = await doEditElement(
            dbConn,
            "protocols",
            req.params.id,
            [
                {
                    rowName: "name",
                    doEdit: p.name != undefined,
                    value: p.name! || '""',
                },
            ],
            date.toString()
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
            `UPDATE protocols 
                                    SET isEnabled = 0 
                                    WHERE id_protocols = ?;`,
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
