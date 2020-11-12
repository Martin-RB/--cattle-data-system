import { ISexClass } from "./SexClass";

export interface IN_Head{
    id: string
    siniga: string
    idLocal: string
    status: "ok" | "sold" | "dead"
    sex: "male" | "female"
    idAlot: number
    alotName: string | null
    idCorral: number
    corralName: string | null
    sexClass: ISexClass
    lastWeight: number
    idProvider: number
    providerName: string
}

export interface OUT_Head{
    siniga: string
    idLocal: string
    sex: "male" | "female"
    idAlot: number
    sexClass: number
    weight: number
}

export interface OUT_PricedHead{
    idHead: string
    priceStand: number
    priceTotal: number
    finalWeight: number
}