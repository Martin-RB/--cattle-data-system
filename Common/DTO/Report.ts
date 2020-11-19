export interface Report{
    alotName: string,
    corralName:string,
    headsSold: number
    headsTotal: number
    standPrice: number
    headsPrice: number
    feedKg: number
    feedCost: number
    providers: Array<{
        name: string,
        numHeads: number
    }>
    total: number
}