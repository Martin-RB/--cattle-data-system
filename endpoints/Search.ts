import { Router } from "express";
import { Connection } from "mysql";
import {
    doQuery,
    IQueryResult,
    checkResponseErrors,
} from "../Common/AwaitableSQL";
import { Telemetry } from "../Common/Telemetry";
import { OUT_Corral, IN_Corral, IN_Corral_Flex } from "../Common/DTO/Corral";
import { OUT_Head } from "../Common/DTO/Head";
import { OUT_Alot, IN_Alot } from "../Common/DTO/Alot";
import { IN_Search} from "../Common/DTO/Search";
import { OUT_Implant } from "../Common/DTO/Implant";
import { OUT_Protocol } from "../Common/DTO/Protocol";
import { GetImplants } from "./Implants";
import { GetCorrals } from "./Corrals";
import { GetProtocol } from "./Protocols";

export async function GetCorralsQuery(dbConn: Connection, ids: Array<string>) {
	    let qr = await doQuery(
	        dbConn,
	        "SELECT * FROM corrals c WHERE isEnabled = 1 AND c.name LIKE (?) ",
	        [ids[0].concat('%')]
	    );
	    if (qr.error) {
	        return qr.error;
	    }
	    let qrr = qr.result;

	    let corrals = new Array<OUT_Corral>();
	    qrr.forEach((el: any) => {
	        let corral: OUT_Corral = {
	            id: el.id_corrals,
	            name: el.name,
	            headNum: el.capacity,
	        };
	        corrals.push(corral);
    	});

    	return corrals;
}

export async function GetHeadsQuery(dbConn: Connection, ids: Array<string>) {
	let qr = await doQuery(
	    dbConn,
	    "SELECT * FROM heads h WHERE h.siniga LIKE (?) ",
	    [ids[0].concat('%')]
	);
    if (qr.error) {
        return qr.error;
    }
    let heads = new Array<OUT_Head>();

        qr.result.forEach((el:any) => {
            heads.push({
                alotName: el.name,
                corralName: el.corralName,
                id: el.id_heads,
                idAlot: el.id_alots,
                idCorral: el.id_corrals,
                idLocal: el.localId,
                idProvider: el.id_providers,
                lastWeight: el.weight,
                providerName: el.providerName,
                sex: el.sex,
                idSexClass: el.id_weight_class,
                sexClassName: el.weightClassName,
                siniga: el.siniga,
                status: (el.isSold)?"sold":(el.isDead)?"dead":"ok",
            })
        });

        return heads;

}

export async function GetAloatsQuery(dbConn: Connection, ids: Array<string>) {
	let qr = await doQuery(
	    dbConn,
	    "SELECT * FROM alots a WHERE isEnabled = 1 AND a.name LIKE (?) ",
	    [ids[0].concat('%')]
	);
    if (qr.error) {
        return qr.error;
    }
    let qrr = qr.result;
    let alots = new Array<OUT_Alot>();

    for (let i = 0; i < qrr.length; i++) {
        const el = qrr[i];

        let im_ids =
            el.im_ids != null && el.im_ids.length > 0
                ? el.im_ids.split(",")
                : [];

        let [implResponse,
            protResponse,
            corrResponse] = await Promise.all([GetImplants(dbConn, im_ids),
                GetProtocol(dbConn, [el.idArrivalProtocol]),
                GetCorrals(dbConn, [el.id_corrals])]);

        /* let implResponse = await GetImplants(dbConn, im_ids);
        let protResponse = await GetProtocol(dbConn, [el.idArrivalProtocol]);
        let corrResponse = await GetCorrals(dbConn, [el.id_corrals]); */
        let errors = checkResponseErrors(
            implResponse,
            protResponse,
            corrResponse
        );
        if (errors != null) {
            return errors;
        }

        if ((protResponse as Array<OUT_Protocol>).length == 0) {
            return { e: "No Protocol", info: "No Protocol" };
        }
        if ((corrResponse as Array<OUT_Corral>).length == 0) {
            return { e: "No Corral", info: "No Corral" };
        }

        let alot: OUT_Alot = {
            id: el.id_alots,
            name: el.name,
            sex: el.sex,
            headNum: el.heads,
            maxHeadNum: el.maxHeads,
            reimplants: implResponse as Array<OUT_Implant>,
            arrivalProtocol: (protResponse as Array<OUT_Protocol>)[0],
            hostCorral: (corrResponse as Array<OUT_Corral>)[0],
            maxWeight: el.maxWeight,
            minWeight: el.minWeight,
        };
        alots.push(alot);
    }

    return alots;

}

export function Search(router: Router, dbConn: Connection, tl: Telemetry) {
    router.get("/", async (req, res) => {
    	let b = req.body as IN_Search;
    	let texto = b.search || "";

        let corrals = new Array<OUT_Corral>();
            let corralesResponse = await GetCorralsQuery(
                dbConn,
                [texto]
            );
            let respuestaCorral = corralesResponse as Array<OUT_Corral>;

            if (respuestaCorral.length == undefined) {
                let error = corralesResponse as { e: any; info: string };
                tl.reportInternalError(res, error.e);
                return;
            }
            corrals = respuestaCorral;




            let heads = new Array<OUT_Head>();
            let headResponse = await GetHeadsQuery(
                dbConn,
                [texto]
            );
            let respuestaHead = headResponse as Array<OUT_Head>;

            if (respuestaHead.length == undefined) {
                let error = headResponse as { e: any; info: string };
                tl.reportInternalError(res, error.e);
                return;
            }
            heads = respuestaHead;



        let alots = new Array<OUT_Alot>();
            let alotResponse = await GetAloatsQuery(
                dbConn,
                [texto]
            );
            let respuestaAlot = alotResponse as Array<OUT_Alot>;

            if (respuestaAlot.length == undefined) {
                let error = alotResponse as { e: any; info: string };
                tl.reportInternalError(res, error.e);
                return;
            }
            alots = respuestaAlot;


        res.send(alots);
    });


    return router;

}



