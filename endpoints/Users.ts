import { Router } from "express";
import { Connection } from "mysql";
import { doQuery, IQueryResult, doEditElement } from "../Common/AwaitableSQL";
import {
    IN_User,
    OUT_User,
    OUT_User_name,
} from "../Common/DTO/User";
import { Telemetry } from "../Common/Telemetry";

export function Users(router: Router, dbConn: Connection, tl: Telemetry) {
    

    router.post("/login", async (req, res) => {
        let m = req.body as OUT_User_name;
        let qr: IQueryResult | undefined = undefined;
        qr = await doQuery(
            dbConn,
            
                "SELECT password, FROM user WHERE name = ?",
                [m.name]
            );

        if (qr.error) {
            tl.reportInternalError(res, qr.error);
            return;
        }

        let pass = qr.result.password;

        if(m.password == pass){
            res.send({login: true});
        }
        else{
            res.send({login: false});
        }
    });


    router.post("/admon", async (req, res) => {
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

        res.send({ id: idUser });
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

    });
    return router;
}
