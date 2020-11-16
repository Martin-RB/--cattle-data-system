import { IN_Corral } from "./Corral";
import {  IImplant } from "./Implant";
import { IN_Protocol } from "./Protocol";

export interface IN_Alot {
    id: string;
    name: string, 
    maxHeadNum: number,
    headNum: number;
    sex: ("male" | "female"),
    maxWeight: number, 
    minWeight: number, 
    arrivalProtocol?: IN_Protocol, 
    hostCorral?: IN_Corral, 
    reimplants?: Array<IImplant>
}

export interface OUT_Alot {
    name: string, 
    maxHeadNum: number, 
    sex: ("male" | "female"),
    maxWeight: number, 
    minWeight: number, 
    arrivalProtocol: number, 
    hostCorral: number, 
    reimplants: Array<IImplant>
}