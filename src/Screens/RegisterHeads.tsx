import React, { useState, useContext } from "react";
import { MaterialInput } from "../Components/Input";
import { Radio } from "../Components/Radio";
import { MaterialButton } from "../Components/Button";
import { Select } from "../Components/Select";
import { List, ListRow } from "../Components/List";
import { IN_Alot, OUT_Alot } from "../Classes/DataStructures/Alot";
import { IOption } from "../Classes/IOption";
import { useHistory } from "react-router-dom";
import { IN_Lorry } from "../Classes/DataStructures/Lorry";
import { OUT_Head } from "../Classes/DataStructures/Head";
import { toast } from "../App";
import { Modal, ModalData } from "../Components/Modal";
import { ProtocolsContent } from "./config/Protocols";
import { DrugsContent } from "./config/Drugs";
import { IN_SexClass } from "../Classes/DataStructures/SexClass";
import { DisplayableMedicine, MedicineDisplay } from "../Components/MedicineDisplay";
import { IImplant } from "~/Classes/DataStructures/Implant";
import url from "./ConfigI";
import { LotsContent } from "./config/Lots";

interface RegisterHeadsState{
    lorries: Array<IN_Lorry>
    alots: Array<IN_Alot>
    selectedLorry: number
    selectedAlot: number
    siniga: string
    weight: string
    idLocal: string
    sex: "male" | "female" | ""
    heads: Array<OUT_Head>,
    classes: Array<IN_SexClass>,
    selectedClass: number
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
            idLocal: "",
            classes: [],
            selectedClass: -1
        }
    }

    componentDidMount(){
        this.gatherAll();
    }

    onAlotAdded = (alot: OUT_Alot) => {

    }

    onAddHead = () => {
        if(this.state.selectedLorry == -1 || this.state.selectedAlot == -1 ||
                    this.state.siniga == "" || this.state.weight == "" || 
                    this.state.idLocal == "" || this.state.sex == ""){
            toast("Llene todos los datos");
            return;
        }
        let thisState = Object.assign(this.state, {});
        let alot = thisState.alots[this.state.selectedAlot];
        alot.headNum++;
        let classId = thisState.classes[thisState.selectedClass].id;
        let head = {
            idAlot: alot.id,
            idLocal: this.state.idLocal,
            sex: this.state.sex,
            siniga: this.state.siniga,
            weight: parseFloat(this.state.weight),
            sexClass: classId
        } as OUT_Head;
        
        let heads = this.state.heads;
        heads.push(head)
        this.setState({
            heads,
            alots: thisState.alots,
            weight: "",
            sex: "",
            siniga: "",
            idLocal: "",
            selectedAlot: -1
        })
    }

    onDeleteHead = (id: string) => {
        let i = parseInt(id);
        let thisState = Object.assign(this.state, {});
        let heads = thisState.heads;
        let alot = thisState.alots.find(a=>a.id==heads[i].idAlot)
        if(!alot) return;
        alot.headNum--;
        heads.splice(i, 1);
        this.setState({
            heads,
            alots: thisState.alots
        })
    }

    onChangeLorry = (id: string) => {
        let idx = parseInt(id);

        if(this.state.heads.length != 0){
            toast("Termine de registar las cabezas de esta jaula");
            return false;
        }
        
        this.setState({
            selectedLorry: idx,
            selectedClass: -1,
            classes: []
        });
        return true
    }

    onChangeSex = (sex: "female" | "male") =>{
        let idx = this.state.selectedLorry;
        let lorry = this.state.lorries[idx]
        if(!lorry){
            toast("Seleccione una jaula primero");
            return;
        }
        let classes = sex=="female"?lorry.femaleClassfies: lorry.maleClassfies        
        this.setState({
            sex,
            classes
        })
    }

    render():JSX.Element{
        let lorries = this.state.lorries.map((v,i)=>({key: i.toString(), 
                                                name: `${v.plateNum}, ${v.provider.name}`} as IOption));

        let heads = this.state.heads.map((v, i) => (
                        {id: i.toString(), columns:
                            [v.siniga, v.idLocal, v.sex[0].toUpperCase(), v.weight.toString()]
                        } as ListRow));

        let classes = this.state.classes.map((e,i) => ({
            key: i.toString(),
            name: e.name
        } as IOption))
        return (
            <>
            <div className="row">
                <div className="col s12">
                    <h2>Trabajar cabezas</h2>
                </div>
            </div>
            <div className="row">
                <div className="col s12">
                    <label>Jaula</label>
                    <Select placeholder="Seleccione jaula" 
                            elements={lorries} 
                            onChange={(v) => {return this.onChangeLorry(v);}}
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
                                onChange={() => this.onChangeSex("male")}
                                text="Macho"
                                value="male"/>
                    </div>
                    <div className="field--margin">
                        <Radio name="sex" 
                                checked={this.state.sex == "female"} 
                                onChange={() => this.onChangeSex("female")}
                                text="Hembra"
                                value="female"/>
                    </div>
                    <div className="field--margin">
                        <Select placeholder="Seleccione clasificación" 
                                    elements={classes} 
                                    value={this.state.selectedClass.toString()}
                                    onChange={(v) => { 
                                        this.setState({
                                            selectedClass: parseInt(v)
                                        });
                                        return true;}}/>
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
                        <MaterialButton className="right" text="Terminar trabajo"
                            onClick={() => {this.finishWork()}}/>
                    </div>
                </div>
            </div>
            </>
        );
    }
    gatherLorries = async () => {
        let response;
        let result : Array<IN_Lorry>
        try{
            response = fetch(url + "/lorries/notWorked", {
                method: 'GET', 
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            result = await (await response).json();
        }
        catch(e){
            console.log(e);
            result = [];
        }
        
        return result;;
    }

    gatherAlots = async () => {
        let response;
        let result : Array<IN_Alot>
        try{
            response = fetch(url + "/alots", {
                method: 'GET', 
                headers:{
                    'Content-Type': 'application/json'
                }
            });
            result = await (await response).json();
        }
        catch(e){
            console.log(e);
            result = [];
        }
        
        return result;
    }
    gatherAll = async () => {
        let [lorries, alots] = await Promise.all([this.gatherLorries(), this.gatherAlots()]);
        this.setState({
            lorries, alots
        })
    }

    finishWork = async () => {
        let data = this.state.heads;
        let idx = this.state.selectedLorry;
        let lorry = this.state.lorries[idx];
        if(data.length != lorry.maxHeads){
            toast(`Debe registrar ${lorry.maxHeads} cabezas en total`)
            return;
        }
        let response;
        let result = false;
        try{
            response = fetch(url + "/lorry/" + lorry.id, {
                method: 'POST', 
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            result = (await response).status == 200;
        }
        catch(e){
            console.log(e);
            result = false;
        }
        return result;
    }

}

interface AlotControllerProps{
    sex: "male" | "female" | ""
    weight: number
    alots: Array<IN_Alot>
    alotSelected: number
    onAlotSelected: (id: number) => boolean
    onNewAlotAdded: (alot: OUT_Alot) => void
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
        alots = alots.filter(v=>v.headNum<v.maxHeadNum);
        alots = alots.sort((a:IN_Alot,b:IN_Alot) => {
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
        
        let lotes = this.props.alots.map((v,i) => ({key: i.toString(), 
            name: v.name} as IOption));
        let alot:IN_Alot|undefined = this.props.alots[this.props.alotSelected];
        let maxHeads = alot?.maxHeadNum?.toString() || "-";
        let heads = alot?.headNum || "-";
        let maxWeight = alot?.maxWeight.toString() || "-";
        let minWeight = alot?.minWeight.toString() || "-";
        let protocol = alot?.arrivalProtocol.name || "-";
        
        let medicines = alot?.arrivalProtocol.medicines.map((med,i) => ({
            med, kg:this.props.weight
        } as DisplayableMedicine)) || []
        return (
            <>
            <div className="inline-items">
                <Select elements={lotes} 
                        onChange={(v) => this.onAlotChanged(v)} 
                        placeholder="Lotes"
                        value={this.props.alotSelected.toString()}
                        className="inline"/>
{/*                 <MaterialButton text="Nuevo Lote" className="inline"
                                onClick={()=>this.setState({
                                    showModal: true
                                })}/> */}
            </div>
            <div>
                <p>Rango pesos: {minWeight} {" a "} {maxWeight}</p>
                <p>Capacidad: {heads}/{maxHeads}</p>
                <p>Protocolo a utilizar: {protocol}</p>
            </div>
            <MedicineDisplay medicines={medicines}
                            protocolName={alot?.arrivalProtocol.name || ""}
                            />
            {this.state.showModal?
                <Modal data={this.modalData}/>
            :null}
            </>
        );
    }
}