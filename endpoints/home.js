"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Home(router, dbConn) {
    router.get("/", function (req, res) {
        res.send("XDD");
    });
    return router;
}
exports.Home = Home;
