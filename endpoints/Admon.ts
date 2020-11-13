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
    

    router.post("/", async (req, res) => {
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
    return router;
}
