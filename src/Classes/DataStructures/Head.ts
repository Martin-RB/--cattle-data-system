export interface IN_Head{
    id: string,
    siniga: string,
    idLocal: string,
    sex: "male" | "female",
    idAlot: string
    alotName: string
    weight: number
    providerName: string
}

export interface OUT_Head{
    siniga: string,
    idLocal: string,
    sex: "male" | "female",
    idAlot: string
    sexClass: string
    weight: number
}