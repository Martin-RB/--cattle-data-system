import { Router } from "express";
import { Connection } from "mysql";
import { doQuery, IQueryResult, doEditElement } from "../Common/AwaitableSQL";
import {
    OUT_Medicine,
    IN_Medicine,
    IN_Medicine_Flex,
} from "../Common/DTO/Medicine";
import { Telemetry } from "../Common/Telemetry";

export function Medicines(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/", async (req, res) => {
        let qr = await doQuery(
            dbConn,
            "SELECT *, (isPerHead = 1) as cisPerHead FROM medicines WHERE isEnabled = 1",
            []
        );
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;
        // Porting
        let medicines = new Array<OUT_Medicine>();

        qrr.forEach((el: any) => {
            let medicine: OUT_Medicine = {
                id: el.id_medicines,
                name: el.name,
                isPerHead: el.cisPerHead == 1,
                cost: el.actualCost,
                presentation: el.presentation,
                mlApplication: el.mlApplication,
                kgApplication: el.kgApplication,
            };
            medicines.push(medicine);
        });

        res.send(medicines);
    });

    router.get("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let qr = await doQuery(
            dbConn,
            "SELECT *, (isPerHead = 1) as cisPerHead FROM medicines WHERE isEnabled = 1 AND id_medicines = ?",
            [req.params.id]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        if (qrr.length == 0) {
            tl.reportNotFoundError(
                res,
                req.params.id,
                "Medicamento no encontrado"
            );
        }

        // Porting
        let medicines = new Array<OUT_Medicine>();

        qrr.forEach((el: any) => {
            let medicine: OUT_Medicine = {
                id: el.id_medicines,
                name: el.name,
                isPerHead: el.cisPerHead == 1,
                cost: el.actualCost,
                presentation: el.presentation,
                mlApplication: el.mlApplication,
                kgApplication: el.kgApplication,
            };
            medicines.push(medicine);
        });

        res.send(medicines[0]);
    });

    router.post("/", async (req, res) => {
        let m = req.body as IN_Medicine;
        let date = new Date().getTime();
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
            `INSERT INTO medicines 
                                    (id_user, name, isPerHead, presentation, mlApplication, kgApplication, create_datetime, edit_datetime, actualCost)
                                    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                m.id_user,
                m.name,
                m.isPerHead ? 1 : 0,
                m.presentation.toString(),
                m.mlApplication.toString(),
                m.kgApplication.toString(),
                date.toString(),
                date.toString(),
                m.cost,
            ]
        );
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let idMedicine = qr.result.insertId;

        qr = await doQuery(
            dbConn,
            `INSERT INTO medicine_costs 
                                    (id_user,id_medicines, cost, create_datetime) 
                                    VALUES (?,?, ?, ?);`,
            [1, idMedicine, m.cost, date]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });

    router.put("/:id", async (req, res) => {
        let m = req.body as IN_Medicine_Flex;
        let date = new Date().getTime();

        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr: IQueryResult | undefined;

        if (m.cost) {
            qr = await doQuery(
                dbConn,
                `INSERT INTO medicine_costs 
                                    (id_medicines, cost, create_datetime) 
                                    VALUES (?, ?, ?);`,
                [req.params.id, m.cost.toString(), date.toString()]
            );

            if (qr.error) {
                tl.reportInternalError(res, qr.error);
                return;
            }
        }

        qr = await doEditElement(
            dbConn,
            "medicines",
            req.params.id,
            [
                {
                    rowName: "name",
                    doEdit: m.name != undefined,
                    value: m.name! || '""',
                },
                {
                    rowName: "isPerHead",
                    doEdit: m.isPerHead != undefined,
                    value: m.isPerHead ? 1 : 0,
                },
                {
                    rowName: "presentation",
                    doEdit: m.presentation != undefined,
                    value: m.presentation?.toString() || '""',
                },
                {
                    rowName: "mlApplication",
                    doEdit: m.mlApplication != undefined,
                    value: m.mlApplication?.toString() || '""',
                },
                {
                    rowName: "kgApplication",
                    doEdit: m.kgApplication != undefined,
                    value: m.kgApplication?.toString() || '""',
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

        let qr: IQueryResult | undefined;

        qr = await doQuery(
            dbConn,
            `UPDATE medicines 
                                    SET isEnabled = 0 
                                    WHERE id_medicines = ?;`,
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
