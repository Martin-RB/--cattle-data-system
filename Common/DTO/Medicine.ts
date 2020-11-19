export interface OUT_Medicine {
    id: string;
    name: string;
    isPerHead: boolean;
    cost: number;
    presentation: number;
    mlApplication: number;
    kgApplication: number;
}

export interface IN_Medicine_Flex {
    id?: string;
    name?: string;
    isPerHead?: boolean;
    cost?: number;
    presentation?: number;
    mlApplication?: number;
    kgApplication?: number;
}

export interface IN_Medicine {
    name: string;
    isPerHead: boolean;
    cost: number;
    presentation: number;
    mlApplication: number;
    kgApplication: number;
}
