
export interface IN_Head {
    id?: string,
    siniga: string,
    idLocal: string,
    status: "ok" | "sold" | "dead" ,
    sex: "male" | "female",
    idAlot: number,
    alotName: string,
    idCorral: number,
    corralName: string,
    lastWeight: number,
    idSexClass: number,
    sexClassName: string,
    idProvider: number,
    providerName: string
}    

export interface OUT_Head{
    id?: string,
    siniga: string,
    idLocal: string,
    sex: "male" | "female",
    idAlot: string
    sexClaas: number
    weight: number
}