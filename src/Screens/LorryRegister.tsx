import React, { Provider } from "react";
import { HISTORY, LoadingScreenWr, toast } from "../App";
import { MaterialInput } from "../Components/Input";
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
import { Button, TextInput } from "../../node_modules/react-materialize/lib/index";
import { DateOptions } from "../Configs";
import { Select } from "../Components/Select";
import { RouteComponentProps } from "react-router-dom";
import { ServerComms, ServerError } from "../Classes/ServerComms";
import { LoadingScreen } from "../Components/LoadingScreen";

interface LorryRegisterProps extends RouteComponentProps{

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
    idxProvider: number,
    idxCorral: number,
    classMale: Array<OUT_SexClass>,
    classFemale: Array<OUT_SexClass>,
    providers: Array<IOption>
    corrals: Array<IOption>
}

export class LorryRegister extends React.Component<LorryRegisterProps, LorryRegisterState>{

    srvProviders: Array<IN_Provider>
    srvCorrals: Array<IN_Corral>
    actualDate = new Date()
    srv: ServerComms
    loadRef: ((toggle: boolean) => void) | undefined = undefined;

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
            idxProvider: -1,
            classMale: [],
            classFemale: [],
            providers:[],
            corrals:[],
            idxCorral: -1
        };
        this.srv = ServerComms.getInstance()
    }

    componentDidMount(){        
        let asd = async() => {
            this.loadRef!(true);
            let [provRes, corrRes] = await Promise.all(
                [this.gatherProviders(), this.gatherCorrals()]);

            this.srvProviders = provRes
            this.srvCorrals = corrRes

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
            this.loadRef!(false);
        }
        asd();
    }

    onAccept = async () => {

        let fieldCheck = this.checkFields()
        if(fieldCheck == false){
            toast("Llene todos los campos")
            return;
        }

        let response = await this.srv.post<any>("/lorries", fieldCheck);
        if(response.success){
            this.props.history.push("/menu")
            toast("Jaula registrada con exito.")
        }
        else{
            toast((response.content as ServerError).message)
        }
    }

    render(): JSX.Element{
        let view = (
            <>
            <div className="row">
                <div className="col s12 m12 l12">
                    <form onSubmit={e=>e.preventDefault()}>
                        <h2>Registrar jaula</h2>
                        <div className="row">
                            <div className="col s12 m6">
                                <DateInput placeholder="fecha" 
                                            id="fecha" 
                                            options={DateOptions}
                                            onChange={(date) => this.setState({
                                                date
                                            })} 
                                            value={this.state.date}
                                            />
                            </div>
                            <div className="col s12 m6">
                                <TimeInput placeholder="hora" 
                                            id="hora" 
                                            onChange={(time) => this.setState({
                                                time
                                            })} 
                                            value={this.state.time}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <TextInput
                                            label="# jaula"
                                            value={this.state.number}
                                            noLayout
                                            onChange={({target:{value:number}})=>{this.setState({
                                                number
                                            })}}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <TextInput
                                            label="Cabezas"
                                            value={this.state.heads}
                                            noLayout
                                            onChange={({target:{value:heads}}) => {this.setState({
                                                heads
                                            })}}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <TextInput
                                            label="Kg. de origen"
                                            value={this.state.kgOrigin}
                                            noLayout
                                            onChange={({target:{value:kgOrigin}}) => {this.setState({
                                                kgOrigin
                                            })}}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <Select placeholder="Seleccione proveedor" 
                                        value={this.state.idxProvider}
                                        elements={this.state.providers}
                                        onChange={(idxProvider)=>{
                                            this.setState({
                                                idxProvider
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
                                <Button 
                                    waves="light"
                                    className="button--color right"
                                    onClick={this.onAccept}>
                                        Aceptar
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )

        let wrap = <LoadingScreenWr.Consumer>
            {loadRef=>{
                this.loadRef = loadRef
                return view
            }}
        </LoadingScreenWr.Consumer>

        return wrap;
    }

    checkFields = () => {
        if(this.state.number != "" && this.state.heads != "" &&
            this.state.kgOrigin != "" && this.state.idxProvider != -1){

            let idxProvider = this.state.idxProvider
            let idxCorral = this.state.idxCorral
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

        let resp = await ServerComms.getInstance().get<IN_Provider[]>("/providers");
        if(resp.success){
            return resp.content as IN_Provider[]
        }
        else{
            toast((resp.content as ServerError).message)
            return []
        }

        /* let asd: IN_Provider
        try {
            const response = await fetch(url + "/providers", {
            method: 'GET', 
            mode: 'cors', 
            credentials: "include",
            cache: 'no-cache', 
            }); 

        let data = await response.json()
        return data as Array<IN_Provider>
        } catch (error) {
            console.log(error);
            
        } */
    }

    gatherCorrals = async () => {
        let resp = await ServerComms.getInstance().get<IN_Corral[]>("/corrals");
        if(resp.success){
            return resp.content as IN_Corral[]
        }
        else{
            toast((resp.content as ServerError).message)
            return []
        }
        /* let asd: IN_Lorry
        try {
            const response = await fetch(url + "/corrals", {
            method: 'GET', 
            mode: 'cors', 
            credentials: "include",
            cache: 'no-cache', 
            }); 

        let data = await response.json()
        return data as Array<IN_Corral>
        } catch (error) {
            console.log(error);
            
        } */
    }
}