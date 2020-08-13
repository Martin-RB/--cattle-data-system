import { cerr } from "./CustomConsole";
import { Response } from "express";

export class Telemetry{

    constructor(private endpoint: string){

    }

    reportInternalError = (response: Response, data: any) => {
        let date = new Date().getTime();
        cerr(`${this.endpoint} :: ${date} >> Internal error`);
        console.log(data);
        console.log("***************************************************");
        response.statusMessage = "Ocurrió un error, contacte administrador: " + date;
        response.setHeader("ERROR_TEXT", response.statusMessage);
        response.status(500);
        response.send(response.statusMessage);
    }
    reportCustomError = (response: Response, data: any, message: string) => {
        let date = new Date().getTime();
        cerr(`${this.endpoint} :: ${date} >> Error: ${message}`);
        console.log(data);
        console.log("***************************************************");
        response.statusMessage = `${message}: ${date}`;
        response.setHeader("ERROR_TEXT", response.statusMessage);
        response.status(500);
        response.send(response.statusMessage);
    }
    reportNotFoundError = (response: Response, data: any, message: string) => {
        let date = new Date().getTime();
        cerr(`${this.endpoint} :: ${date} >> NotFound: ${message}`);
        console.log(data);
        console.log("***************************************************");
        response.statusMessage = `${message}: ${date}`;
        response.setHeader("ERROR_TEXT", response.statusMessage);
        response.status(404);
        response.send(response.statusMessage);
    }
}