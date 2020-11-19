"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = void 0;
function Home(router, dbConn) {
    router.get("/", function (req, res) {
        res.send("No me jakies xdddd");
    });
    return router;
}
exports.Home = Home;
