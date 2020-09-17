import { OUT_Protocol } from "./Protocol";
import { OUT_Corral } from "./Corral";
import { OUT_Implant, IN_Implant } from "./Implant";

export interface OUT_Alot {
    id: string, 
    name: string, 
    maxHeadNum: string, 
    headNum: number, 
    sex: ("male" | "female"), // male, female
    maxWeight: number, 
    minWeight: number, 
    arrivalProtocol: OUT_Protocol, 
    hostCorral: OUT_Corral, 
    reimplants: Array<OUT_Implant> 
}

export interface IN_Alot {
    name: string, 
    maxHeadNum: number, 
    sex: ("male" | "female"),
    maxWeight: number, 
    minWeight: number, 
    arrivalProtocol: number, 
    hostCorral: number, 
    reimplants: Array<IN_Implant> 
}