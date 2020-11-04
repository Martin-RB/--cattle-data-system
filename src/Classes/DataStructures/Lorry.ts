import { IN_Corral } from "./Corral";
import { IN_Origin } from "./Origin";
import { IN_Provider } from "./Provider";
import { IN_SexClass, OUT_SexClass } from "./SexClass";

export interface IN_Lorry{
    id: string
    origin: IN_Origin, 
    provider: IN_Provider, 
    entryCorral: IN_Corral, 
    plateNum: string, 
    maxHeads: number, 
    weight: number 
    arrivalDate: number, 
    openDays: number,
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