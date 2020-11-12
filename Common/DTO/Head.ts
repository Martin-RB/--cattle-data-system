import { OUT_WeightClassfy } from "./WeightClassfy";

export interface OUT_Head{
    id: string
    siniga: string
    idLocal: string
    status: "ok" | "sold" | "dead"
    sex: "male" | "female"
    idAlot: number
    alotName: string | null
    idCorral: number
    corralName: string | null
    idSexClass: number
    sexClassName: string
    lastWeight: number
    idProvider: number
    providerName: string
}

export interface IN_Head{
    siniga: string
    idLocal: string
    sex: "male" | "female"
    idAlot: number
    sexClass: number
    weight: number
}

export interface IN_PricedHead{
    idHead: number
    priceStand: number
    priceTotal: number
    finalWeight: number
}