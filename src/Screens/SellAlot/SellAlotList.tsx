import React, { createFactory, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import * as Factory from "../../../node_modules/factory.ts/lib/sync";
import { Head } from "../../Classes/DataStructures/Head";
import { MaterialButton } from "../../Components/Button";
import { List, ListRow } from "../../Components/List";
import { Modal, ModalData, ModalExitOptions } from "../../Components/Modal";
import * as faker from "faker";
import { MaterialInput } from "../../Components/Input";
import { toast } from "../../App";

interface SellAlotListProps extends RouteComponentProps{

}

interface SellAlotListState{
    modalData: ModalData | null,
    heads: Array<FilledHead>,
    modalFields: {
        weight:string | null
        standSellPrice:string | null
        finalSellPrice:string | null
    }
}

interface FilledHead{
    head: Head
    weight: string | null
    standSellPrice: string | null
    finalSellPrice: string | null
    isSelected: boolean
}


export class SellAlotList extends React.Component<SellAlotListProps,
                                                    SellAlotListState>{
    constructor(props: SellAlotListProps){
        super(props);

        let headFac = Factory.makeFactory<Head>({
            id: Factory.each(i => i.toString()),
            siniga: Factory.each(i => faker.random.alphaNumeric(8)),//(Math.random() * 1000).toFixed(0),
            alotName: "",
            idAlot: "1",
            idLocal: Factory.each(i => faker.random.alphaNumeric(6)),
            providerName: Factory.each(i=>faker.name.firstName()),
            sex: Factory.each(i=>Math.random()>0.5?"female":"male"),
            weight: Factory.each(i=>(Math.random() * 1000))
        })

        let filledHeadFac = Factory.makeFactory<FilledHead>({
            head: Factory.each(i=>headFac.build()),
            isSelected: false,
            finalSellPrice:null,
            standSellPrice: null,
            weight: null
        })

        this.state = {
            modalData: null,
            modalFields: {
                weight:null,finalSellPrice:null,standSellPrice:null
            },
            heads: filledHeadFac.buildList(100)
        }
    }

    isButtonClicked = (id: string, idx: number) => {
        let head = this.state.heads[parseInt(id)];
        this.setState({
            modalData: {
                title: `Cabeza: ${head.head.siniga}`,
                content: "",
                onFinish: (opt) => {
                    let heads = this.state.heads;
                    if(opt == ModalExitOptions.ACCEPT){
                        let modalFields = this.state.modalFields;
                        head = {...head, ...modalFields}
                        heads[parseInt(id)] = head;
                    }
                    this.setState({modalData: null, modalFields: {
                        finalSellPrice: null,
                        standSellPrice: null,
                        weight: null
                    }})
                },
            },
            modalFields: {...head}
        })
    }

    onAllSelected = (isSelected:boolean) => {
        let heads = this.state.heads;
        heads = heads.map((v)=>({...v, isSelected}))
        this.setState({heads})
    }

    onItemSelected = (id:string, isSelected: boolean) => {
        let heads = this.state.heads;
        heads[parseInt(id)].isSelected = isSelected;
        this.setState({heads})
    }

    onSubmit = () => {
        let selHeads = this.state.heads.filter(v=>v.isSelected);
        if(selHeads.length == 0){
            toast("Seleccione al menos una cabeza para vender");
            return;
        }
        let incorrect = selHeads.filter(v=>!(v.finalSellPrice&&v.weight&&v.standSellPrice));
        if(incorrect.length > 0){
            toast("Llene la información de las cabezas")
            return;
        }
        
        let path = this.props.match.url
        this.props.history.push({
            pathname:`${path}/report`,

        })
    }

    render():JSX.Element{        
        let rows = this.fromHeadsToRows(this.state.heads);
        return (
            <>
            <h2>Venta de lote</h2>
            <p>Seleccione las cabezas y sus respectivos datos de venta</p>
            <div className="row">
            <List headers={[ "SINIGA", "Id. local", "Proveedor", "Info. venta"]}
                    selectable={true}
                    onButtonClicked={this.isButtonClicked}
                    onItemSelected={this.onItemSelected}
                    onAllSelected={this.onAllSelected}
                    rows={rows}/>
            </div>
            <div className="row">
                <MaterialButton text="Aceptar" className="right" onClick={this.onSubmit}/>
                <MaterialButton text="Cancelar" className="right"/>
            </div>
            {this.state.modalData? <Modal data={
                {...this.state.modalData,
                    content: <HeadSellForm 
                            weight={this.state.modalFields.weight}
                            onWeightChange={(weight)=>{
                                if(isNaN(parseFloat(weight||""))) return;
                                this.setState((s) => ({modalFields: {...s.modalFields, weight}}))
                            }}
                            finalSellPrice={this.state.modalFields.finalSellPrice}
                            onFinalSellPriceChange={(finalSellPrice)=>{
                                if(isNaN(parseFloat(finalSellPrice||""))) return;
                                this.setState((s) => ({modalFields: {...s.modalFields, finalSellPrice}}))
                            }}
                            standSellPrice={this.state.modalFields.standSellPrice}
                            onStandSellPriceChange={(standSellPrice)=>{
                                if(isNaN(parseFloat(standSellPrice||""))) return;
                                this.setState((s) => ({modalFields: {...s.modalFields, standSellPrice}}))
                            }}
                        />
                }}/>: null}
            </>
        )
    }

    fromHeadsToRows = (heads: Array<FilledHead>) => {
        return heads.map((v, i) => ({
            id: i.toString(),
            columns: [
                v.head.siniga,
                v.head.idLocal,
                v.head.sex=="male"?"Macho":"Hembra",
                {type:"button", inputValue: "Info. venta"}
            ],
            isSelected: v.isSelected,
            styleClass: ((v.isSelected)? ((v.weight &&
                v.standSellPrice &&
                v.finalSellPrice)? "myList--row--color-good": "myList--row--color-bad"): "")
        } as ListRow))
    }
}

interface HeadSellFormProps{
    weight:string | null
    standSellPrice:string | null
    finalSellPrice:string | null
    onWeightChange: (weight: string|null) => void;
    onStandSellPriceChange: (standSellPrice: string|null)=>void;
    onFinalSellPriceChange: (finalSellPrice: string|null)=>void;
}

function HeadSellForm(props: HeadSellFormProps){

    return <>

        <MaterialInput value={props.weight || ""} onChange={(_, w)=>props.onWeightChange(w==""?null:w)} placeholder="Peso"/>
        <MaterialInput value={props.standSellPrice || ""} onChange={(_, s)=>props.onStandSellPriceChange(s==""?null:s)} placeholder="Precio de pie"/>
        <MaterialInput value={props.finalSellPrice || ""} onChange={(_, f)=>props.onFinalSellPriceChange(f==""?null:f)} placeholder="Precio final"/>

    </>
}