import { OUT_Corral, IN_Corral, IN_Corral_Flex } from "./Corral";
import { OUT_Head } from "./Head";
import { OUT_Alot, IN_Alot } from "./Alot";

export interface OUT_Search {
    alots: Array<OUT_Alot>;
    corrals: Array<OUT_Corral>;
    heads: Array<OUT_Head>;
}

export interface IN_Search {
    search?: string;
}