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
import { toast } from "../App";
import { Modal, ModalData } from "../Components/Modal";
import { ProtocolsContent } from "./config/Protocols";
import { DrugsContent } from "./config/Drugs";
import { IN_SexClass } from "../Classes/DataStructures/SexClass";
import { MedicineDisplay, DisplayableMedicine } from "../Components/MedicineDisplay";
import { IImplant } from "~/Classes/DataStructures/Implant";
import url from "./ConfigI";

interface RegisterHeadsState{
    lorries: Array<IN_Lorry>
    alots: Array<IN_Alot>
    selectedLorry: string
    selectedAlot: number
    siniga: string
    weight: number
    idLocal: string
    sex: "male" | "female" | ""
    sexClass: number
    heads: Array<OUT_Head>,
    classes: Array<IN_SexClass>,
    selectedClass: number
}
interface RegisterHeadsProps{

}   


export class RegisterHeads extends React.Component<RegisterHeadsProps, RegisterHeadsState>{

    constructor(props: RegisterHeadsProps){
        super(props);
        this.state = {
            lorries: [],
            alots: [],
            selectedLorry: "-1",
            selectedAlot: -1,
            siniga: "",
            weight: 0,
            sexClass: 0,
            sex: "male",
            heads: [],
            idLocal: "",
            classes: [],
            selectedClass: -1
        }
    }

    getLorries: () => void = async() =>{
        try {
            const response = await fetch(url + "/lorries" , {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            }); 
            
        let lorries = await response.json() as Array<IN_Lorry>
        this.setState({lorries:lorries})
        } catch (error) {
           return error
        }
    }

 

    getAlots: () => void = async() =>{
        try {
            const response = await fetch(url + "/alots" , {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            }); 
            
        let alots = await response.json() as Array<IN_Alot>
        this.setState({alots:alots})
        } catch (error) {
           return error
        }
    }

    componentDidMount(){
        this.getLorries()
        this.getAlots()
    }

    onAlotAdded = (alot: IN_Alot) => {
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
        if(this.state.selectedLorry == "" || this.state.selectedAlot == -1 ||
                    this.state.siniga == "" || this.state.weight == 0 || 
                    this.state.idLocal == "" || this.state.sex == ""){
            toast("Llene todos los datos");
            return;
        }
        
        let alots = [...this.state.alots];
        let alot =  alots[this.state.selectedAlot];
        alot.headNum++;
        let head = {
            idAlot: parseInt(alot.id),
            idLocal: this.state.idLocal,
            sex: this.state.sex,
            siniga: this.state.siniga,
            weight: this.state.weight,
            sexClass: parseInt(this.state.classes[this.state.sexClass].id)

        } as OUT_Head;

        let heads = this.state.heads;
        heads.push(head)
        this.setState({
            alots,
            heads,
            weight: 0,
            sex: "",
            siniga: "",
            idLocal: "",
            selectedAlot: -1,
            selectedClass: -1
        })


    }

    onDeleteHead = (id: string) => {
        let i = parseInt(id);
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

    onChangeLorry = (id: string) => {
        console.log("id: " + id)
        this.setState({
            //selectedLorry: this.state.lorries[parseInt(id)].id,
            selectedLorry: id,
            selectedClass: -1,
            heads: []
        });

    }

    onFinishWork: () => void = () =>{
        console.log(this.state.heads)
        if(this.state.heads.length > 0){
        try {
            fetch(url + "/lorries/" + this.state.selectedLorry + "/heads" , { 
                method: 'POST', 
                body: JSON.stringify(this.state.heads),
                headers:{
                    'Content-Type': 'application/json'
                  }
                }); 
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
                            className="inline"
                            onChange={(v) => {this.onChangeLorry(v); return true}}
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
                                    sex: "male",
                                    classes: this.state.lorries[parseInt(this.state.selectedLorry)].maleClassfies
                                })}
                                text="Macho"
                                value="male"/>
                    </div>
                    <div className="field--margin">
                        <Radio name="sex" 
                                checked={this.state.sex == "female"} 
                                onChange={() => this.setState({
                                    sex: "female",
                                    classes: this.state.lorries[parseInt(this.state.selectedLorry)].femaleClassfies
                                })}
                                text="Hembra"
                                value="female"/>
                    </div>
                    <div className="field--margin">
                        <label htmlFor="">Clasificación</label>
                        <Select placeholder="Seleccione clasificación" 
                                    elements={classes} 
                                    value={this.state.selectedClass.toString()}
                                    className="inline"
                                    onChange={(v) => { 
                                        this.setState({
                                            selectedClass: parseInt(v)
                                        });
                                        return true;}}/>
                    </div>
                    <div className="field--margin">
                        <MaterialInput placeholder="Peso"
                                        type="number"
                                        value={(this.state.weight.toString())}
                                        onChange={(_,v) => {
                                            if(isNaN(parseFloat(v))) return;
                                            this.setState({
                                                weight: parseInt(v)
                                            })
                                        }}/>
                    </div>
                    <div className="divider"></div>
                    <div className="section">
                        <AlotController alotSelected={this.state.selectedAlot}
                                        alots={this.state.alots}
                                        weight={this.state.weight}
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
            </>
        );
    }

}

interface AlotControllerProps{
    sex: "male" | "female" | ""
    weight: number
    alots: Array<IN_Alot>
    alotSelected: number
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
        let heads = alot?.headNum ?? "-";
        let maxWeight = alot?.maxWeight.toString() || "-";
        let minWeight = alot?.minWeight.toString() || "-";
        let protocol = alot?.arrivalProtocol?.name || "-";
        let meds = alot?.arrivalProtocol?.medicines
        let displayMeds =  meds?.map((v,i) => ({med : {id: v.id, name: v.name, cost: v.cost, presentation: v.presentation,
                             kgApplication: v.kgApplication, isPerHead: v.isPerHead, mlApplication: v.mlApplication}, kg : 500 }))
        return (
            <>
            <div className="inline-items">
                <Select elements={lotes} 
                        onChange={(v) => this.onAlotChanged(v)} 
                        placeholder="Lotes"
                        value={this.props.alotSelected.toString()}
                        className="inline"/>
               {/* <MaterialButton text="Nuevo Lote" className="inline"
                                onClick={()=>this.setState({
                                    showModal: true
                                }) */}
            </div>
            <div>
                <p>Rango pesos: {minWeight} {" a "} {maxWeight}</p>
                <p>Capacidad: {heads}/{maxHeads}</p>
                <p>Protocolo a utilizar: {protocol}</p>
            </div>
            <MedicineDisplay medicines={displayMeds==undefined? []: displayMeds}
                            protocolName={protocol}
                            />
            {this.state.showModal?
                <Modal data={this.modalData}/>
            :null}
            </>
        );
    }
}