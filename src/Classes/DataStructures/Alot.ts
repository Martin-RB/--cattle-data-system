import {  IImplant } from "./Implant";

export interface IAlot {
    name: string, 
    maxHeadNum: number, 
    sex: ("male" | "female"),
    maxWeight: number, 
    minWeight: number, 
    arrivalProtocol: number, 
    hostCorral: number, 
    reimplants: Array<IImplant> 
}