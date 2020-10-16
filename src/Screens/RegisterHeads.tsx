import React, { useState, useContext } from "react";
import { MaterialInput } from "../Components/Input";
import { Radio } from "../Components/Radio";
import { MaterialButton } from "../Components/Button";
import { Select } from "../Components/Select";
import { List, ListRow } from "../Components/List";
import { Alot } from "../Classes/DataStructures/Alot";
import { IOption } from "../Classes/IOption";
import { useHistory } from "react-router-dom";
import { Lorry } from "../Classes/DataStructures/Lorry";
import { Head } from "../Classes/DataStructures/Head";
import { toast } from "../App";
import { Modal, ModalData } from "../Components/Modal";
import { ProtocolsContent } from "./config/Protocols";
import { DrugsContent } from "./config/Drugs";

interface RegisterHeadsState{
    lorries: Array<Lorry>
    alots: Array<Alot>
    selectedLorry: number
    selectedAlot: number
    siniga: string
    weight: string
    idLocal: string
    sex: "male" | "female" | ""
    heads: Array<Head>
}
interface RegisterHeadsProps{

}

export class RegisterHeads extends React.Component<RegisterHeadsProps, 
                                            RegisterHeadsState>{

    constructor(props: RegisterHeadsProps){
        super(props);
        this.state = {
            lorries: [],
            alots: [],
            selectedLorry: -1,
            selectedAlot: -1,
            siniga: "",
            weight: "",
            sex: "",
            heads: [],
            idLocal: ""
        }
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({
                lorries: [{id: "1", name: "Lorery1"}, {id: "2", name: "Lorery2"}]
            })
        }, 400)
        setTimeout(() => {
            this.setState({
                alots: [
                    {id: "1", 
                    name: "Alot1", 
                    heads: 4,
                    maxHeads: 39,
                    protocolName: "XD",
                    sex: "male",
                    maxWeight: 500,
                    minWeight: 200}, 
                    
                    {id: "2", 
                    name: "Alot 2", 
                    heads: 9,
                    maxHeads: 10,
                    protocolName: "XD",
                    sex: "male",
                    minWeight: 0,
                    maxWeight: 200}, 
                ]
            })
        }, 400)
    }

    onAlotAdded = (alot: Alot) => {
        let alots = this.state.alots;
        alots.push(alot)
        setTimeout(() => {
            this.setState({
                alots,
                selectedAlot: -1
            })
        },500);
    }

    onAddHead = () => {
        if(this.state.selectedLorry == -1 || this.state.selectedAlot == -1 ||
                    this.state.siniga == "" || this.state.weight == "" || 
                    this.state.idLocal == "" || this.state.sex == ""){
            toast("Llene todos los datos");
            return;
        }
        let alot = this.state.alots[this.state.selectedAlot];
        let head = {
            alotName: alot.name,
            idAlot: alot.id,
            idLocal: this.state.idLocal,
            sex: this.state.sex,
            siniga: this.state.siniga,
            weight: parseFloat(this.state.weight)
        } as Head;

        setTimeout(() => {
            let heads = this.state.heads;
            heads.push(head)
            this.setState({
                heads
            })
        }, 500)
    }

    onDeleteHead = (id: string) => {
        let i = parseInt(id);
        let heads = Object.assign(this.state, {}).heads;
        heads.splice(i, 1);
        this.setState({
            heads
        })
    }

    render():JSX.Element{
        let lorries = this.state.lorries.map((v,i)=>({key: i.toString(), 
                                                name: v.name} as IOption));

        let heads = this.state.heads.map((v, i) => (
                        {id: i.toString(), columns:
                            [v.siniga, v.idLocal, v.weight.toString()]
                        } as ListRow))
        return (
            <>
            <div className="row">
                <div className="col s12">
                    <h2>Trabajar cabezas</h2>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <Select placeholder="Seleccione jaula" 
                            elements={lorries} 
                            onChange={(v) => {this.setState({
                                selectedLorry: parseInt(v)
                            }); return true}}
                            value={this.state.selectedLorry.toString()}/>
                </div>
            </div>
            <div className="divider"></div>
            <div className="row">
                <div className="col s12 l6">
                    <MaterialInput placeholder="SINIGA"
                                    value={this.state.siniga}
                                    onChange={(_,v) => this.setState({
                                        siniga: v
                                    })}
                    />
                    <MaterialInput placeholder="Identificación local"
                                    value={this.state.idLocal}
                                    onChange={(_,v) => this.setState({
                                        idLocal: v
                                    })}/>
                    <div className="field--margin">
                        <Radio name="sex" 
                                checked={this.state.sex == "male"} 
                                onChange={() => this.setState({
                                    sex: "male"
                                })}
                                text="Macho"
                                value="male"/>
                    </div>
                    <div className="field--margin">
                        <Radio name="sex" 
                                checked={this.state.sex == "female"} 
                                onChange={() => this.setState({
                                    sex: "female"
                                })}
                                text="Hembra"
                                value="female"/>
                    </div>
                    <div className="field--margin">
                        <MaterialInput placeholder="Peso"
                                        type="number"
                                        value={this.state.weight}
                                        onChange={(_,v) => {
                                            if(isNaN(parseFloat(v))) return;
                                            this.setState({
                                                weight: v
                                            })
                                        }}/>
                    </div>
                    <div className="divider"></div>
                    <div className="section">
                        <AlotController alotSelected={this.state.selectedAlot}
                                        alots={this.state.alots}
                                        weight={parseFloat(this.state.weight)}
                                        sex={this.state.sex}
                                        onAlotSelected={(v) => {
                                            this.setState({
                                                selectedAlot: v
                                            })
                                            return true;
                                        }}
                                        onNewAlotAdded={(v) => this.onAlotAdded}
                                        />
                    </div>
                    <div className="divider"></div>
                    <div className="section row">
                        <MaterialButton text="Registrar cabeza" 
                                            className="right"
                                            onClick={this.onAddHead}/>
                    </div>
                    <div className="divider hide-on-large-only"></div>
                </div>
                <div className="col s12 l6">
                    <p>Cabezas registradas</p>
                    <List deletable={true}
                            editable={false}
                            headers={["Siniga", "Id local", "Peso"]}
                            rows={heads}
                            selectable={false}
                            onDeleteClicked={this.onDeleteHead}/>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <div className="divider"></div>
                    <div className="section">
                        <MaterialButton className="right" text="Terminar trabajo"/>
                    </div>
                </div>
            </div>
            </>
        );
    }

}

interface AlotControllerProps{
    sex: "male" | "female" | ""
    weight: number
    alots: Array<Alot>
    alotSelected: number
    onAlotSelected: (id: number) => boolean
    onNewAlotAdded: (alot: Alot) => void
}

interface AlotControllerState{
    showModal: boolean,
    
}

class AlotController extends React.Component
                                <AlotControllerProps,AlotControllerState>{

    constructor(props: AlotControllerProps){
        super(props);

        this.state = {showModal: false}
    }
    
    onAlotChanged = (id: string) => {
        let iid = parseInt(id);
        return this.props.onAlotSelected(iid);
    }

    getSortedAlots = () => {
        let alots = Object.assign(this.props.alots, {});
        alots = alots.filter(v=>v.heads<v.maxHeads);
        alots = alots.sort((a:Alot,b:Alot) => {
            return (a.sex == this.props.sex
                        && a.minWeight <= this.props.weight
                        && a.maxWeight >= this.props.weight)?1:-1;
        })
        return alots;
    }

    modalData = {
        content: 
            <DrugsContent badFields={[]}
                lockedFields={[]}
                value={{}}
                onChange={(a) => console.log(a)}
                />,
        onFinish: (a) => {console.log(a); this.setState({showModal: false})},
        title: "Agregando Lote",
        
    } as ModalData

    render():JSX.Element{
        
        let lotes = this.getSortedAlots().map((v,i) => ({key: i.toString(), 
                                                    name: v.name} as IOption));
        let alot:Alot|undefined = this.props.alots[this.props.alotSelected];
        let maxHeads = alot?.maxHeads?.toString() || "-";
        let heads = alot?.heads || "-";
        let maxWeight = alot?.maxWeight.toString() || "-";
        let minWeight = alot?.minWeight.toString() || "-";
        let protocol = alot?.protocolName || "-";
        return (
            <>
            <div className="inline-items">
                <Select elements={lotes} 
                        onChange={(v) => this.onAlotChanged(v)} 
                        placeholder="Lotes"
                        value={this.props.alotSelected.toString()}
                        className="inline"/>
                <MaterialButton text="Nuevo Lote" className="inline"
                                onClick={()=>this.setState({
                                    showModal: true
                                })}/>
            </div>
            <div>
                <p>Rango pesos: {minWeight} {" a "} {maxWeight}</p>
                <p>Capacidad: {heads}/{maxHeads}</p>
                <p>Protocolo a utilizar: {protocol}</p>
            </div>
            {this.state.showModal?
                <Modal data={this.modalData}/>
            :null}
            </>
        );
    }
}