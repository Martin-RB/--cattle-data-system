import { Connection } from "mysql";
import { Router } from "express";
import { Telemetry } from "../Common/Telemetry";
import { doQuery, doEditElement } from "../Common/AwaitableSQL";
import { OUT_Origin, IN_Origin, IN_Origin_Flex } from "../Common/DTO/Origin";
import {
    OUT_Provider,
    IN_Provider,
    IN_Provider_Flex,
} from "../Common/DTO/Provider";

export async function GetProviders(dbConn: Connection, ids: Array<string>, idUser: string) {
    let qr = await doQuery(
        dbConn,
        `
        SELECT * FROM providers WHERE id_providers IN (?) AND isEnabled = 1 AND id_user = ?;
    `,
        [ids, idUser]
    );

    if (qr.error) {
        return qr.error;
    }
    let qrr = qr.result;

    let providers = new Array<OUT_Provider>();
    qrr.forEach((el: any) => {
        let provider: OUT_Provider = {
            id: el.id_providers,
            name: el.name,
        };
        providers.push(provider);
    });
    return providers;
}

export function Providers(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/", async (req, res) => {
        let qr = await doQuery(
            dbConn,
            "SELECT id_providers FROM providers WHERE isEnabled = 1 AND id_user = ?",
            [req.cookies.idUser]
        );
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let ids = qr.result;
        let providers = new Array<OUT_Provider>();
        if (ids.length != 0) {
            let providerResponse = await GetProviders(
                dbConn,
                ids.map((v: any) => v.id_providers),
                req.cookies.idUser
            );
            let responseProvider = providerResponse as Array<OUT_Provider>;

            if (responseProvider.length == undefined) {
                let error = providerResponse as { e: any; info: string };
                tl.reportInternalError(res, error.e);
                return;
            }
            providers = responseProvider;
        }

        res.send(providers);
    });

    router.get("/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        let qr = await doQuery(
            dbConn,
            `SELECT * 
                                        FROM providers 
                                        WHERE id_providers = ? AND isEnabled = 1 AND id_user = ?`,
            [req.params.id, req.cookies.idUser]
        );
        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }
        let qrr = qr.result;

        let providers = new Array<OUT_Provider>();
        qrr.forEach((el: any) => {
            let provider: OUT_Provider = {
                id: el.id_providers,
                name: el.name,
            };
            providers.push(provider);
        });
        if (providers.length == 0) {
            tl.reportNotFoundError(
                res,
                req.params.id,
                "Proveedor no encontrado"
            );
        }

        res.send(providers[0]);
    });

    router.post("/", async (req, res) => {
        let p = req.body as IN_Provider;
        let date = new Date().getTime().toString();

        let qr = await doQuery(
            dbConn,
            `INSERT INTO providers 
                                        (id_user, name, create_datetime, edit_datetime) VALUES 
                                        (?, ?, ?, ?);`,
            [req.cookies.idUser, p.name, date, date]
        );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }
        let insertId = qr.result.insertId;

        res.send({ id: insertId });
    });

    router.put("/:id", async (req, res) => {
        let b = req.body as IN_Provider_Flex;
        let date = new Date().getTime().toString();
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }

        let qr = await doEditElement(
            dbConn,
            "providers",
            req.params.id,
            [
                {
                    rowName: "name",
                    doEdit: b.name ? true : false,
                    value: b.name || "",
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
            `UPDATE providers 
                                        SET isEnabled = 0
                                        WHERE id_providers = ?`,
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
