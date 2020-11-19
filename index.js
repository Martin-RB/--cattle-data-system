"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
var Breeds_1 = require("./endpoints/Breeds");
var Origins_1 = require("./endpoints/Origins");
var Providers_1 = require("./endpoints/Providers");
var Corrals_1 = require("./endpoints/Corrals");
var Implants_1 = require("./endpoints/Implants");
var Alots_1 = require("./endpoints/Alots");
var Lorries_1 = require("./endpoints/Lorries");
var Search_1 = require("./endpoints/Search");
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
app.use(express_1.default.static(__dirname + "/html"));
app.use("/api/home", home_1.Home(express_1.default.Router(), conn));
app.use("/api/medicines", Medicines_1.Medicines(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/medicines")));
app.use("/api/protocols", Protocols_1.Protocols(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/protocols")));
app.use("/api/breeds", Breeds_1.Breeds(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/breeds")));
app.use("/api/origins", Origins_1.Origins(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/origins")));
app.use("/api/providers", Providers_1.Providers(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/providers")));
app.use("/api/corrals", Corrals_1.Corrals(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/corrals")));
app.use("/api/implants", Implants_1.Implants(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/implants")));
app.use("/api/alots", Alots_1.Alots(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/alots")));
app.use("/api/lorries", Lorries_1.Lorries(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/lorries")));
app.use("/api/search", Search_1.Search(express_1.default.Router(), conn, new Telemetry_1.Telemetry("/search")));
app.get('/*', function (req, res) {
    res.sendFile((__dirname + '/html/index.html'), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});
app.listen(8070, function () {
    console.log("Done on port: " + 8070);
});
