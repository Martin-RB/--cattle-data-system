import { Router } from "express";
import { Connection } from "mysql";

export function Home(router: Router, dbConn: Connection){
    router.get("/", (req, res) => {
        res.send("XDD");
    });
    return router;
}