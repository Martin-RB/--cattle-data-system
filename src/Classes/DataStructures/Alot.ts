import {  IImplant } from "./Implant";

export interface IAlot {
    id: string,
    name: string, 
    maxHeadNum: number, 
    heads: number,
    sex: ("male" | "female"),
    maxWeight: number, 
    minWeight: number, 
    arrivalProtocol: number, 
    hostCorral: number, 
    protocolName: string,
    reimplants: Array<IImplant> 
}