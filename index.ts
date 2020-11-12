import express from "express";
import * as mysql from "mysql";
import { Home } from "./endpoints/home";
import { Medicines } from "./endpoints/Medicines";
import * as bodyParser from "body-parser";
import cors from "cors";
import { Telemetry } from "./Common/Telemetry";
import { Protocols } from "./endpoints/Protocols";
import { Breeds } from "./endpoints/Breeds";
import { Origins } from "./endpoints/Origins";
import { Providers } from "./endpoints/Providers";
import { Corrals } from "./endpoints/Corrals";
import { Implants } from "./endpoints/Implants";
import { Alots } from "./endpoints/Alots";
import { Lorries } from "./endpoints/Lorries";
import { Users } from "./endpoints/Users";

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let DATABASE = "test";
let conn = mysql.createConnection({
    host: "true-sandbox.cokvb4qleob2.us-west-2.rds.amazonaws.com",
    user: "dbtester",
    password: 'D:Htn&3G%u574GNz',
    database: DATABASE,
    multipleStatements: true
});

conn.connect((e) => {
    if(e) throw e;
    console.log("Connected to db " + DATABASE);
})

app.use(express.static(__dirname + "/html"));

app.use("/api/home", Home(express.Router(), conn));
app.use("/api/medicines", Medicines(express.Router(), conn, new Telemetry("/medicines")));
app.use("/api/protocols", Protocols(express.Router(), conn, new Telemetry("/protocols")));
app.use("/api/breeds", Breeds(express.Router(), conn, new Telemetry("/breeds")));
app.use("/api/origins", Origins(express.Router(), conn, new Telemetry("/origins")));
app.use("/api/providers", Providers(express.Router(), conn, new Telemetry("/providers")));
app.use("/api/corrals", Corrals(express.Router(), conn, new Telemetry("/corrals")));
app.use("/api/implants", Implants(express.Router(), conn, new Telemetry("/implants")));
app.use("/api/alots", Alots(express.Router(), conn, new Telemetry("/alots")));
app.use("/api/lorries", Lorries(express.Router(), conn, new Telemetry("/lorries")));
app.use("/api/login", Users(express.Router(), conn, new Telemetry("/login")));
app.use("/api/admon", Users(express.Router(), conn, new Telemetry("/admon")));

app.get('/*', function(req, res) {
    res.sendFile((__dirname + '/html/index.html'), function(err: any) {
        if (err) {
            res.status(500).send(err)
        }
    });
});


app.listen(8070, () => {
    console.log("Done on port: " + 8070);
})