import React, { Provider } from "react";
import { HISTORY, toast } from "../App";
import { MaterialInput } from "../Components/Input";
import { Select } from "../Components/Select";
import { SexClassifier } from "../Components/SexCassifier";
import { TimeInput, ITime } from "../Components/TimeInput";
import { DateInput } from "../Components/DateInput";
import { OUT_SexClass } from "~/Classes/DataStructures/SexClass";
import { IOption } from "../Classes/IOption";
import { MaterialButton } from "../Components/Button";
import url from "./ConfigI";
import { IN_Provider } from "../Classes/DataStructures/Provider";
import { IN_Lorry, OUT_Lorry } from "../Classes/DataStructures/Lorry";
import { IN_Corral } from "../Classes/DataStructures/Corral";

interface LorryRegisterProps{

}

interface HashMap{
    [key: string]: string
}

interface LorryRegisterState{
    date: Date,
    time: ITime,
    number: string,
    heads: string,
    kgOrigin: string,
    idxProvider: string,
    idxCorral: string,
    classMale: Array<OUT_SexClass>,
    classFemale: Array<OUT_SexClass>,
    providers: Array<IOption>
    corrals: Array<IOption>
}

export class LorryRegister extends React.Component<LorryRegisterProps, LorryRegisterState>{

    srvProviders: Array<IN_Provider>
    srvCorrals: Array<IN_Corral>

    constructor(props: LorryRegisterProps){
        super(props);

        let date = new Date();
        let time:ITime = {hour: date.getHours(), minute: date.getMinutes()}
        this.srvCorrals = []
        this.srvProviders = []
        this.state = {
            date,
            time,
            number: "",
            heads: "",
            kgOrigin: "",
            idxProvider: "-1",
            classMale: [],
            classFemale: [],
            providers:[],
            corrals:[],
            idxCorral: "-1"
        };
    }

    componentDidMount(){
        let asd = async() => {
            return new Promise(async (res, rej) => {
                let [provRes, corrRes] = await Promise.all(
                        [this.gatherProviders(), this.gatherCorrals()]);

                this.srvProviders = provRes || []
                this.srvCorrals = corrRes || []

                let providers : Array<IOption> = this.srvProviders.map((v, i) => ({
                    key: i.toString(),
                    name: v.name
                }as IOption))

                let corrals : Array<IOption> = this.srvCorrals.map((v, i) => ({
                    key: i.toString(),
                    name: v.name
                }as IOption))
                
                this.setState({
                    providers,
                    corrals
                })
                res();
            })
        }
        asd();
    }

    onAccept = () => {

        let fieldCheck = this.checkFields()
        if(fieldCheck == false){
            toast("Llene todos los campos")
            return;
        }
        
        this.uploadLorry(fieldCheck).then((res) => {
            toast("Jaula registrada con exito")
        })

    }

    render(): JSX.Element{
        
        return (
            <>
            <h2>Registrar jaula</h2>
            <div className="row">
                <div className="col s12 m10 l10 offset-m1">
                    {/* <div className="row">
                        <div className="col s12 m6">
                            <DateInput placeholder="fecha" 
                                        id="fecha" 
                                        onChange={(a) => this.setState({
                                            date: a
                                        })} 
                                        value={this.state.date}
                                        />
                        </div>
                        <div className="col s12 m6">
                            <TimeInput placeholder="hora" 
                                        id="hora" 
                                        onChange={(a) => this.setState({
                                            time: a
                                        })} 
                                        value={this.state.time}/>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col s12">
                            <MaterialInput placeholder="# jaula"
                                        value={this.state.number}
                                        onChange={(_,a)=>{this.setState({
                                            number: a
                                        })}}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <MaterialInput placeholder="Cabezas"
                                        value={this.state.heads}
                                        onChange={(_,a) => {this.setState({
                                            heads: a
                                        })}}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <MaterialInput placeholder="Kg. de origen"
                                        value={this.state.kgOrigin}
                                        onChange={(_,a) => {this.setState({
                                            kgOrigin: a
                                        })}}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <Select placeholder="Seleccione proveedor" 
                                    value={this.state.idxProvider}
                                    elements={this.state.providers}
                                    onChange={(a)=>{
                                        this.setState({
                                            idxProvider: a
                                        })
                                        return true;
                                    }}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <Select placeholder="Seleccione corral de estancia" 
                                    value={this.state.idxCorral}
                                    elements={this.state.corrals}
                                    onChange={(a)=>{
                                        this.setState({
                                            idxCorral: a
                                        })
                                        return true;
                                    }}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 l6">
                            <SexClassifier 
                                    sex="machos"
                                    onChange={(a) => this.setState({
                                        classMale: a
                                    })}
                                    values={this.state.classMale}/>
                        </div>
                        <div className="col s12 l6">
                            <SexClassifier 
                                    sex="hembras"
                                    onChange={(a) => this.setState({
                                        classFemale: a
                                    })}
                                    values={this.state.classFemale}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <MaterialButton text="Aceptar" 
                                            className="right"
                                            onClick={this.onAccept}/>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    checkFields = () => {
        if(this.state.number != "" && this.state.heads != "" &&
            this.state.kgOrigin != "" && this.state.idxProvider != "-1"){

            let idxProvider = parseInt(this.state.idxProvider)
            let idxCorral = parseInt(this.state.idxCorral)
            return {
                femaleClassfies: this.state.classFemale,
                maleClassfies: this.state.classMale,
                maxHeads: parseInt(this.state.heads),
                plateNum: this.state.number,
                provider: parseInt(this.srvProviders[idxProvider].id),
                weight: parseFloat(this.state.kgOrigin),
                arrivalDate: new Date().getTime(),
                entryCorral: parseInt(this.srvCorrals[idxCorral].id)
            } as OUT_Lorry;
        }
        return false;
    }

    gatherProviders = async () => {
        let asd: IN_Provider
        try {
            const response = await fetch(url + "/providers", {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            }); 

        let data = await response.json()
        return data as Array<IN_Provider>
        } catch (error) {
            console.log(error);
            
        }
    }

    gatherCorrals = async () => {
        let asd: IN_Lorry
        try {
            const response = await fetch(url + "/corrals", {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            }); 

        let data = await response.json()
        return data as Array<IN_Corral>
        } catch (error) {
            console.log(error);
            
        }
    }

    uploadLorry = async (data: OUT_Lorry) => {
        try {
            let headers = [[
                "content-type", "application/json"
            ]]
            const response = await fetch(url + "/lorries", {
                method: 'POST', 
                mode: 'cors', 
                headers,
                cache: 'no-cache', 
                body: JSON.stringify(data)
            }); 
        } catch (error) {
            console.log(error);
            
        }
    }
}