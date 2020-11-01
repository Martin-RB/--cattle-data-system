import { IN_SexClass, OUT_SexClass } from "./SexClass";

export interface IN_Lorry{
    id: string
    origin: number, 
    provider: number, 
    entryCorral: number, 
    plateNum: string, 
    maxHeads: number, 
    weight: number 
    arrivalDate: number, 
    femaleClassfies: Array<IN_SexClass>, 
    maleClassfies: Array<IN_SexClass>,
}

export interface OUT_Lorry{
    plateNum: string, 
    maxHeads: number, 
    provider: number, 
    maleClassfies: Array<OUT_SexClass>, 
    femaleClassfies: Array<OUT_SexClass>
    entryCorral: number, 
    weight: number 
    arrivalDate: number, 
}