"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mysql = __importStar(require("mysql"));
var home_1 = require("./endpoints/home");
var Medicines_1 = require("./endpoints/Medicines");
var bodyParser = __importStar(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var Telemetry_1 = require("./Common/Telemetry");
var Protocols_1 = require("./endpoints/Protocols");
var app = express_1.default();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors_1.default());
var DATABASE = "test";
var conn = mysql.createConnection({
    host: "true-sandbox.cokvb4qleob2.us-west-2.rds.amazonaws.com",
    user: "dbtester",
    password: 'D:Htn&3G%u574GNz',
    database: DATABASE,
    multipleStatements: true
});
conn.connect(function (e) {
    if (e)
        throw e;
    console.log("Connected to db " + DATABASE);
});
app.use("/", home_1.Home(express_1.default.Router(), conn));
app.use("/medicines", Medicines_1.Medicines(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/medicines")));
app.use("/protocols", Protocols_1.Protocols(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/protocols")));
app.listen(1235, function () {
    console.log("Done on port: " + 1235);
});
