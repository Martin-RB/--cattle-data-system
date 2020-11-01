export interface IN_Medicine{
    id: string,
    name: string,
    isPerHead: boolean,
    cost: number
    presentation: number
    mlApplication: number 
    kgApplication: number
}

export interface OUT_Medicine{
    name: string,
    isPerHead: boolean,
    cost: number
    presentation: number
    mlApplication: number 
    kgApplication: number
}