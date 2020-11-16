import cookieParser from "cookie-parser";
import { Router } from "express";
import { Connection } from "mysql";
import { doQuery, IQueryResult, doEditElement } from "../Common/AwaitableSQL";
import {
    IN_User,
    OUT_User,
    IN_UserLogin,
} from "../Common/DTO/User";
import { Telemetry } from "../Common/Telemetry";

export function Admon(router: Router, dbConn: Connection, tl: Telemetry) {
    

    router.post("/login", async (req, res) => {
        let m = req.body as IN_UserLogin;
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
                "SELECT id_user, password FROM user WHERE name = ? AND password = ? AND isAdmin = 1",
                [m.name, m.password]
            );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        if(qr.result.length == 0){
            tl.reportNotFoundError(res, qr.error, "Credenciales incorrectas");
            return;
        }
        
        let time = new Date().getTime();
        res.cookie("idUserAdmon", qr.result.id_user, {
            expires: new Date(time + 1000*60*10),
            path: "/"
        })

        res.send()
    });

    router.post("/users", async (req, res) => {
        let m = req.body as IN_User;
        let date = new Date().getTime();
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
            `INSERT INTO user 
                                    (name, password, email, businessName, create_datetime)
                                    VALUES (?,?, ?, ?, ?);`,
            [
                m.name,
                m.password,
                m.email,
                "nulo",
                date.toString()
            ]
            );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let idUser = qr.result.insertId;

        res.send();
    })

    router.get("/users", async (req, res) => {
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
                "SELECT id_user, name, email, (active = 1) as isActive FROM user WHERE isAdmin = 0",
                []
            );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let qrr = qr.result;
        // Porting
        let users = new Array<OUT_User>();

        qrr.forEach((el: any) => {
            let user: OUT_User = {
                id_user: el.id_user,
                name: el.name,
                email: el.email,
                isEnabled: el.isActive == "1"
            };
            users.push(user);
        });

        res.send(users);
    })

    router.put("/users/:id", async (req, res) => {
        let user = req.body as {isEnabled: boolean}
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
            `UPDATE user 
                                    SET active = ? 
                                    WHERE id_user = ?;`,
            [user.isEnabled?1:0, req.params.id]
            );


        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    })
    return router;
}
