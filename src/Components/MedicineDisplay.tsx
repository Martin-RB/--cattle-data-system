import React from "react";
import { MaterialButton } from "./Button";
import { IN_Medicine } from "../Classes/DataStructures/Medicine";
import { Modal, ModalData } from "./Modal";
import { List, ListRow } from "./List";

export interface  DisplayableMedicine{
    kg?: number
    med: IN_Medicine
}

export interface MedicineDisplayProps{
    medicines: Array<DisplayableMedicine>
    buttonText?: string
    protocolName: string
}

export interface MedicineDisplayState{
    isModalOpen: boolean
}

export class MedicineDisplay extends React.Component<MedicineDisplayProps, MedicineDisplayState>{

    constructor(props: MedicineDisplayProps){
        super(props)

        this.state = {isModalOpen: false}
    }

    render(): JSX.Element{

        let modalData: ModalData = {
            content: <>
                <List headers={["Nombre", "Cantidad"]} rows={
                    this.props.medicines.map((v, i) => (
                        {
                            id: i.toString(), 
                            columns: [v.med.name, (v.med.isPerHead)?
                                "Dosis":(v.med.mlApplication/v.med.kgApplication
                                        *(v.kg!=undefined?v.kg:1)).toFixed(2)]
                    } as ListRow))
                }/>
            </>,
            title: `Protocolo "${this.props.protocolName}"`,
            onFinish: () => {
                this.setState({
                    isModalOpen: false
                })
            }
        }


        return (
            <>
            <MaterialButton text={this.props.buttonText?this.props.buttonText:"Medicinas"}
                            onClick={() => {
                                this.setState({
                                    isModalOpen: true
                                })
                            }}/>
            {this.state.isModalOpen?<Modal data={modalData}/>:null}
            </>
        );
    }
}