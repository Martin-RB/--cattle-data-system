import { IN_WeightClassfy, OUT_WeightClassfy } from "./WeightClassfy";
import { OUT_Origin } from "./Origin";
import { OUT_Provider } from "./Provider";
import { OUT_Corral } from "./Corral";

export interface IN_Lorry{
    origin: number, 
    provider: number, 
    entryCorral: number, 
    plateNum: string, 
    maxHeads: number, 
    weight: number 
    arrivalDate: number, 
    femaleClassfies: Array<IN_WeightClassfy>, 
    maleClassfies: Array<IN_WeightClassfy>,
    id_user: number
}

export interface OUT_Lorry{
    id: string, 
    origin: OUT_Origin, 
    provider: OUT_Provider, 
    entryCorral: OUT_Corral, 
    plateNum: string, 
    maxHeads: number, 
    weight: number 
    openDays: number, 
    arrivalDate: number, 
    femaleClassfies: Array<OUT_WeightClassfy>, 
    maleClassfies: Array<OUT_WeightClassfy> 
}