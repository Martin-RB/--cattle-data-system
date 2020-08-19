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

app.use("/", Home(express.Router(), conn));
app.use("/medicines", Medicines(express.Router(), conn, new Telemetry("/medicines")));
app.use("/protocols", Protocols(express.Router(), conn, new Telemetry("/protocols")));
app.use("/breeds", Breeds(express.Router(), conn, new Telemetry("/breeds")));
app.use("/origins", Origins(express.Router(), conn, new Telemetry("/origins")));
app.use("/providers", Providers(express.Router(), conn, new Telemetry("/providers")));
app.use("/corrals", Corrals(express.Router(), conn, new Telemetry("/corrals")));
app.use("/implants", Implants(express.Router(), conn, new Telemetry("/implants")));


app.listen(1235, () => {
    console.log("Done on port: " + 1235);
})