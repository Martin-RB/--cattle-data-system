import cookieParser, { JSONCookie } from "cookie-parser";
import { Router } from "express";
import { Connection } from "mysql";
import { doQuery, IQueryResult, doEditElement } from "../Common/AwaitableSQL";
import {
    IN_User,
    OUT_User,
    IN_UserLogin,
} from "../Common/DTO/User";
import { Telemetry } from "../Common/Telemetry";

export function Login(router: Router, dbConn: Connection, tl: Telemetry) {
    

    router.post("/", async (req, res) => {
        let m = req.body as IN_UserLogin;
        let qr: IQueryResult | undefined = undefined;
        
        qr = await doQuery(
            dbConn,
                "SELECT id_user, name, password, email, businessName, (active = 1) as isActive FROM user WHERE name = ? AND password = ?",
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

        console.log(qr.result);
        
        if(qr.result[0].isActive == "0"){
            tl.reportNotFoundError(res, qr.error, "Cuenta bloqueada");
            return;
        }
        
        
        let time = new Date().getTime();
        res.cookie("idUser", qr.result[0].id_user, {
            expires: new Date(time + 1000*60*60*24),
            path: "/"
        })
        .cookie("email", qr.result[0].email, {
            expires: new Date(time + 1000*60*60*24),
            path: "/"
        })
        .cookie("businessName", qr.result[0].businessName, {
            expires: new Date(time + 1000*60*60*24),
            path: "/"
        })
        .cookie("name", qr.result[0].name, {
            expires: new Date(time + 1000*60*60*24),
            path: "/"
        })
        .send()
    });

/*    router.post("/admon", async (req, res) => {
        let m = req.body as OUT_User;
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

    });

    router.delete("/admon/:id", async (req, res) => {
        if (!req.params.id) {
            tl.reportInternalError(res, "NO ID");
            return;
        }
        
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
            `UPDATE user 
                                    SET active = 0 
                                    WHERE id_user = ?;`,
            [req.params.id]
            );


        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        res.send();
    });

    router.get("/admon", async (req, res) => {
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
                "SELECT id_user, name, email, FROM user ",
                []
            );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let qrr = qr.result;
        // Porting
        let users = new Array<IN_User>();

        qrr.forEach((el: any) => {
            let user: IN_User = {
                id_user: el.id_user,
                name: el.name,
                email: el.email,
            };
            users.push(user);
        });

        res.send(users);

    }); */
    return router;
}
