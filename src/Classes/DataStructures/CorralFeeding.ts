import { IN_Corral } from "./Corral";

export interface IN_CorralFeeding{
    id_corrals: string
    create_datetime : number;
    id_feeds?: string;
    name: string
    kg: number
}

export interface OUT_CorralFeeding{
    idCorral: string,
	kg: number
}