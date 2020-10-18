import { OUT_Protocol } from "./Protocol";

export interface OUT_Implant {
	id: string;
	dateImplanted?: number;
	dateToImplant?: number;
	day: number;
	isNow: boolean;
	protocol: OUT_Protocol;
}

export interface IN_Implant {
	day: number;
	idProtocol: number;
	id_user: number;
}

export interface IN_Implant_Implanted {
	date: number;
}
