import { IN_Corral } from "./Corral";
import {  IImplant } from "./Implant";
import { IN_Protocol } from "./Protocol";

export interface IN_Alot {
    id: string;
    name: string, 
    sex: ("male" | "female"),
    headNum: number,
    maxHeadNum: number, 
    reimplants: Array<IImplant>
    arrivalProtocol: IN_Protocol, 
    hostCorral: IN_Corral, 
    
    maxWeight: number, 
    minWeight: number, 
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