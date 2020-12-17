import React, { useState, useContext } from "react";
import { MaterialInput } from "../Components/Input";
import { Radio } from "../Components/Radio";
import { MaterialButton } from "../Components/Button";
import { Select } from "../Components/Select";
import { List, ListRow } from "../Components/List";
import { IN_Alot } from "../Classes/DataStructures/Alot";
import { IOption } from "../Classes/IOption";
import { useHistory } from "react-router-dom";
import { IN_Lorry } from "../Classes/DataStructures/Lorry";
import { OUT_Head } from "../Classes/DataStructures/Head";
import { toast, toggleLoadingScreen } from "../App";
import { Modal, ModalData, ModalExitOptions } from "../Components/Modal";
import { ProtocolsContent } from "./config/Protocols";
import { DrugsContent } from "./config/Drugs";
import { IN_SexClass } from "../Classes/DataStructures/SexClass";
import { MedicineDisplay, DisplayableMedicine } from "../Components/MedicineDisplay";
import { IImplant } from "~/Classes/DataStructures/Implant";
import url from "./ConfigI";
import { DateInput } from "../Components/DateInput";
import { TimeInput } from "../Components/TimeInput";
import { DateOptions } from "../Configs";
import { TextInput } from "../../node_modules/react-materialize/lib/index";
import {v4 as uuid} from "uuid";
import { ServerComms, ServerError } from "../Classes/ServerComms";

interface RegisterHeadsState{
    lorries: Array<IN_Lorry>
    alots: Array<IN_Alot>
    idxSelectedLorry: number
    idxSelectedAlot: number
    siniga: string
    weight: string
    idLocal: string
    sex: "male" | "female" | ""
    heads: Array<OUT_Head>,
    classes: Array<IN_SexClass>,
    idxSelectedClass: number
    date: Date,
    modalData: ModalData | null
}
interface RegisterHeadsProps{

}


export class WorkHeads extends React.Component<RegisterHeadsProps, RegisterHeadsState>{

    constructor(props: RegisterHeadsProps){
        super(props);
        this.state = {
            lorries: [],
            alots: [],
            idxSelectedLorry: -1,
            idxSelectedAlot: -1,
            siniga: "",
            weight: "",
            sex: "",
            heads: [],
            idLocal: "",
            classes: [],
            idxSelectedClass: -1,
            date: new Date(),
            modalData: null
        }
    }

    getLorries= async() =>{
        let resp = await ServerComms.getInstance().get<IN_Lorry[]>("/lorries");
        if(resp.success){
            let lorries = resp.content as IN_Lorry[];
            this.setState({
                lorries
            })
        }
        else{
            toast((resp.content as ServerError).message)
        }
    }

    getAlots = async () =>{
        let resp = await ServerComms.getInstance().get<IN_Alot[]>("/alots");
        if(resp.success){
            let alots = resp.content as IN_Alot[];
            this.setState({
                alots
            })
        }
        else{
            toast((resp.content as ServerError).message)
        }
    }

    getAll = async () => {
        toggleLoadingScreen(true);
        await Promise.all([this.getLorries(), this.getAlots()])
        toggleLoadingScreen(false);
    }

    componentDidMount(){
        this.getAll()
    }

    onAlotAdded = (alot: IN_Alot) => {
        let alots = this.state.alots;
        alots.push(alot)
        setTimeout(() => {
            this.setState({
                alots,
                idxSelectedAlot: -1
            })
        },500);
    }

    onAddHead = () => {
        if(this.state.idxSelectedLorry == -1 || this.state.idxSelectedAlot == -1 || 
                    this.state.idxSelectedClass == -1 ||
                    this.state.siniga == "" || this.state.weight == "" || 
                    this.state.idLocal == "" || this.state.sex == ""){
            toast("Llene todos los datos");
            return;
        }
        let weight = parseFloat(this.state.weight)
        if(weight == NaN){
            toast("El peso debe de ser un numero")
            return;
        }
        
        let alots = [...this.state.alots];
        let alot =  alots[this.state.idxSelectedAlot];
        alot.headNum++;
        let head = {
            idAlot: parseInt(alot.id),
            idLocal: this.state.idLocal,
            sex: this.state.sex,
            siniga: this.state.siniga,
            weight: weight,
            sexClass: parseInt(this.state.classes[this.state.idxSelectedClass].id)

        } as OUT_Head;

        let heads = this.state.heads;
        heads.push(head)
        this.setState({
            alots,
            heads,
            weight: "",
            sex: "",
            siniga: "",
            idLocal: "",
            idxSelectedAlot: -1,
            idxSelectedClass: -1
        })


    }

    onDeleteHead = (idx: number) => {
        let i = idx
        let heads = Object.assign(this.state, {}).heads;
        let alots = [...this.state.alots];
        let alot = alots.find((v) => heads[i].idAlot == parseInt(v.id))
        if(alot) alot.headNum--;
        heads.splice(i, 1);
        this.setState({
            heads,
            alots
        })
    }

    onChangeLorry = (idx: number) => {
        console.log("LRRY NEW IDX", idx);
        
        if(this.state.heads.length > 0){
            let data = {
                title: "Aviso",
                content: "Cambiar la jaula seleccionada borrará las cabezas actualmente registradas. Desea continuar?",
                hasOptions: true,
                onFinish: (status) => {
                    let accepted = {
                        ...this.state
                    };
                    if(status == ModalExitOptions.ACCEPT){
                        accepted = ({
                            ...accepted,
                            ...{idxSelectedLorry: idx,
                            idxSelectedClass: -1,
                            heads: new Array<OUT_Head>()}
                        });
                    }
                    this.setState({
                        ...accepted,
                        modalData: null
                    })
                }
            } as ModalData
    
            this.setState({
                modalData: data,
            })
        }
        else{
            this.setState({
                idxSelectedLorry: idx,
                idxSelectedClass: -1,
                heads: []
            });
        }
    }

    onFinishWork: () => void = async () =>{
        if(this.state.heads.length > 0){
            let res;
            try {   
                res = await fetch(url + "/lorries/" + 
                        this.state.lorries[
                            this.state.idxSelectedLorry
                        ].id + "/heads" , { 
                    method: 'POST', 
                    body: JSON.stringify(this.state.heads),
                    credentials: "include",
                    headers:{
                        'Content-Type': 'application/json'
                    }
                });
                
                if(res.ok){
                    this.setState({
                        heads: []
                    })
                }
            } catch (error) {
                console.log(error)
            }
        } else{
            toast("Registra al menos una cabeza")
        }
    }

    render():JSX.Element{
        let lorries = this.state.lorries.map((v,i)=>({key: i.toString(), 
                                                name: new Date(v.arrivalDate).toISOString().substring(0,10) + "  "+ v.plateNum } as IOption));

        let heads = this.state.heads.map((v, i) => (
                        {id: i.toString(), columns:
                            [v.siniga, v.idLocal, v.sex[0].toUpperCase(), v.weight.toString()]
                        } as ListRow));

        let classes = this.state.classes.map((e,i) => ({
            key: i.toString(),
            name: e.name
        } as IOption))
        let lorry = this.state.lorries[this.state.idxSelectedLorry]
        return (
            <>
            <h2>Trabajar cabezas</h2>
            <div className="row">
                <div className="col s12">
                    <label>Jaula</label>
                    <Select placeholder="Seleccione jaula" 
                        elements={lorries} 
                        className="inline"
                        onChange={(v) => {this.onChangeLorry(v); return true}}
                        value={this.state.idxSelectedLorry}/>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <DateInput label="Fecha de ingreso" 
                        disabled={this.state.idxSelectedLorry == -1}
                        id="fecha" 
                        options={DateOptions}
                        onChange={(date) => this.setState({
                            date
                        })} 
                        value={this.state.date}
                        />
                </div>
                
            </div>
            <div className="divider"></div>
            <div className="row">
                <div className="col s12 l6">
                    <TextInput label="SINIGA"
                    disabled={this.state.idxSelectedLorry == -1}
                        id={uuid()}
                        noLayout
                        value={this.state.siniga}
                        onChange={({target:{value:siniga}}) => this.setState({
                            siniga
                        })}/>
                    <TextInput label="Identificación local"
                    disabled={this.state.idxSelectedLorry == -1}
                        noLayout
                        id={uuid()}
                        value={this.state.idLocal}
                        onChange={({target:{value:idLocal}}) => this.setState({
                            idLocal
                        })}/>
                    <div className="field--margin">
                        <Radio name="sex" 
                        disabled={this.state.idxSelectedLorry == -1}
                            checked={this.state.sex == "male"} 
                            onChange={() => {
                                this.setState({
                                sex: "male",
                                classes: lorry?lorry.maleClassfies:[]
                            })}}
                            text="Macho"
                            value="male"/>
                    </div>
                    <div className="field--margin">
                        <Radio name="sex" 
                            disabled={this.state.idxSelectedLorry == -1}
                            checked={this.state.sex == "female"} 
                            onChange={() => this.setState({
                                sex: "female",
                                classes: lorry?lorry.femaleClassfies:[]
                            })}
                            text="Hembra"
                            value="female"/>
                    </div>
                    <div className="field--margin">
                        <label htmlFor="">Clasificación</label>
                        <Select placeholder="Seleccione clasificación" 
                            disabled={this.state.idxSelectedLorry == -1}
                            elements={classes} 
                            value={this.state.idxSelectedClass}
                            className="inline"
                            onChange={(idxSelectedClass) => { 
                                this.setState({
                                    idxSelectedClass
                                });
                                return true;}}/>
                    </div>
                    <div className="field--margin">
                        <TextInput label="Peso"
                            disabled={this.state.idxSelectedLorry == -1}
                            id={uuid()}
                            noLayout
                            type="number"
                            value={(this.state.weight.toString())}
                            onChange={({target:{value:weight}}) => {
                                this.setState({
                                    weight
                                })
                            }}/>
                    </div>
                    <div className="divider"></div>
                    <div className="section">
                        <AlotController idxAlotSelected={this.state.idxSelectedAlot}
                            alots={this.state.alots}
                            disabled={this.state.idxSelectedLorry == -1}
                            weight={this.state.weight}
                            sex={this.state.sex}
                            onAlotSelected={(v) => {
                                this.setState({
                                    idxSelectedAlot: v
                                })
                                return true;
                            }}
                            onNewAlotAdded={(v) => this.onAlotAdded}
                            />
                    </div>
                    <div className="divider"></div>
                    <div className="section row">
                        <MaterialButton text="Registrar cabeza" 
                            disabled={this.state.idxSelectedLorry == -1}
                            className="right"
                            onClick={this.onAddHead}/>
                    </div>
                    <div className="divider hide-on-large-only"></div>
                </div>
                <div className="col s12 l6">
                    <p>Cabezas registradas</p>
                    <List deletable={true}
                        editable={true}
                        headers={["Siniga", "Id local", "Sexo", "Peso"]}
                        rows={heads}
                        selectable={false}
                        onDeleteClicked={this.onDeleteHead}
                        viewable={false}/>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <div className="divider"></div>
                    <div className="section">
                        <MaterialButton className="right" text="Terminar trabajo" onClick={this.onFinishWork}/>
                    </div>
                </div>
            </div>
            {this.state.modalData? <Modal data={this.state.modalData}/>: null}
            </>
        );
    }

}

interface AlotControllerProps{
    sex: "male" | "female" | ""
    weight: string
    alots: Array<IN_Alot>
    idxAlotSelected: number
    disabled?: boolean
    onAlotSelected: (id: number) => boolean
    onNewAlotAdded: (alot: IN_Alot) => void
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
    
    onAlotChanged = (idx: number) => {
        let iid = idx;
        return this.props.onAlotSelected(iid);
    }

    getSortedAlots = () => {
        let alots = Object.assign(this.props.alots, {});
        alots = alots.filter(v=>v.headNum<v.maxHeadNum);
        /* alots = alots.sort((a:IN_Alot,b:IN_Alot) => {
            return (a.sex == this.props.sex
                        && a.minWeight <= this.props.weight
                        && a.maxWeight >= this.props.weight)?1:-1;
        }) */
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
        
        let lotes = this.props.alots.map((v,i) => ({key: i.toString(), 
                                                    name: v.name} as IOption));
        let alot:IN_Alot|undefined = this.props.alots[
            this.props.idxAlotSelected
        ];
        let maxHeads = alot?.maxHeadNum?.toString() || "-";
        let heads = alot?.headNum ?? "-";
        let maxWeight = alot?.maxWeight.toString() || "-";
        let minWeight = alot?.minWeight.toString() || "-";
        let protocol = alot?.arrivalProtocol?.name || "-";
        let meds = alot?.arrivalProtocol?.medicines
        let displayMeds =  meds?.map((v,i) => (
            {med : 
                {
                    ...v
                }, 
            kg : 500 }))
        return (
            <>
            <div className="inline-items">
                <Select elements={lotes} 
                        disabled={this.props.disabled}
                        onChange={(v) => this.onAlotChanged(v)} 
                        placeholder="Lotes"
                        value={this.props.idxAlotSelected}
                        className="inline"/>
            </div>
            <div>
                <p>Rango pesos: {minWeight} {" a "} {maxWeight}</p>
                <p>Capacidad: {heads}/{maxHeads}</p>
                <p>Protocolo a utilizar: {protocol}</p>
            </div>
            <MedicineDisplay medicines={displayMeds==undefined? []: displayMeds}
                            protocolName={protocol}
                            disabled={alot?.arrivalProtocol == undefined}
                            />
            {this.state.showModal?
                <Modal data={this.modalData}/>
            :null}
            </>
        );
    }
}