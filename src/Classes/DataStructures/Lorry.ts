import { IN_SexClass, OUT_SexClass } from "./SexClass";

export interface IN_Lorry{
    id: string
    plateNum: string,
    maxHeads: number,
    provider: number,
    entryCorral: number,
    origin: number, 
    weight: number 
    arrivalDate: number, 
    femaleClassfies: Array<IN_SexClass>, 
    maleClassfies: Array<IN_SexClass>,
}

export interface OUT_Lorry{
    provider: number,
    entryCorral: number,
    plateNum: string,   
    maxHeads: number, 
    weight: number 
    arrivalDate: number, 
    maleClassfies: Array<OUT_SexClass>, 
    femaleClassfies: Array<OUT_SexClass> 
    
}