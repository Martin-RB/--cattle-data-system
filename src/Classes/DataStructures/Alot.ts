import {  IImplant } from "./Implant";

export interface IAlot {
    id?: string;
    name: string, 
    maxHeadNum: number, 
    sex: ("male" | "female"),
    maxWeight: number, 
    minWeight: number, 
    arrivalProtocol: number, 
    hostCorral: number, 
    reimplants: Array<IImplant>
    id_user: number 
}