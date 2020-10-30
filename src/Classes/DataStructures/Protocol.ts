import { IMedicine } from "./Medicine";

export interface IProtocol{
     

    id? : string,
    name: string, 
    medicines: Array<IMedicine>;
    id_user: number,
}