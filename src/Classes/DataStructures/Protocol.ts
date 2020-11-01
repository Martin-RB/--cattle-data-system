import { IN_Medicine, OUT_Medicine } from "./Medicine";

export interface IN_Protocol{
    id : string,
    name: string, 
    medicines: Array<IN_Medicine>;
}

export interface OUT_Protocol{
    name: string, 
    medicines: Array<string>;
}