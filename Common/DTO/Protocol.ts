import { OUT_Medicine, IN_Medicine, IN_Medicine_Flex } from "./Medicine";

export interface OUT_Protocol {
	id?: string;
	name: string;
	medicines: Array<OUT_Medicine>;
}

export interface IN_Protocol {
	name: string;
	medicines: Array<IN_Medicine>;
	id_user: number;
}

export interface IN_Protocol_Flex {
	name?: string;
	medicines?: Array<IN_Medicine_Flex>;
}
