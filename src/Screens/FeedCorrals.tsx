import React, { createContext } from "react";
import { List, ListRow } from "../Components/List";
import { MaterialInput } from "../Components/Input";
import { MaterialButton } from "../Components/Button";
import { IN_CorralFeeding, OUT_CorralFeeding } from "../Classes/DataStructures/CorralFeeding";
import { toast } from "../App";
import url from "./ConfigI";
import { OUT_Feeds } from "../Classes/DataStructures/Feeds";
import { TextInput } from "../../node_modules/react-materialize/lib/index";

interface FeedCorralsState{
    screenState: ScreenState
    kg: string
    corrals: Array<IN_CorralFeeding>
    idxSelectedCorral: number,
    canEdit: boolean
}

export class FeedCorrals extends React.Component<{}, FeedCorralsState>{
    constructor(props: {}){
        super(props)
        this.state = {
            corrals: [],
            kg:"",
            screenState: new WaitingState(this),
            idxSelectedCorral: -1,
            canEdit: false
        }
    }

    getFeedCorrals: () => void = async() => {
        try {
            let date = new Date()
            const response = await fetch(url + "/corrals/alimentacion/" + date.getTime(), {
                credentials: "include",
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            }); 
            
        let corrals = await response.json() as Array<IN_CorralFeeding>
        console.log(corrals)
        this.setState({corrals:corrals})
        } catch (error) {
           return error
        }
    }

    componentDidMount(){
        this.getFeedCorrals()
    }
    
    onFinishFeed: () => void = () =>{
        let corrals = this.state.corrals
                .filter(v=>{
                    return v.id_feeds == null && v.kg != null
                })
                .map(
                    v=>({
                        idCorral: v.id_corrals,
                        kg: v.kg
                    }) as OUT_Feeds
                );
        this.upload(corrals)
    } 

    upload = async (corrals: OUT_Feeds[]) => {
        try {
            let resp = await fetch(url + "/corrals/alimentacion/", { 
                method: 'POST', 
                body: JSON.stringify(corrals),
                credentials: "include",
                headers:{
                    'Content-Type': 'application/json'
                  }
                }); 

            if(resp.ok) toast("Alimentación terminada con exito")
        } catch (error) {
            console.log(error)
        }
        this.getFeedCorrals()
    }
    

    render():JSX.Element{
        let corrals = this.state.corrals.map((v,i) => ({
            id: i.toString(), 
            columns: [v.name  , v.kg == null? "0": v.kg.toFixed(2) ]
        } as ListRow))
        return (
            <>
            <h2>Alimentar corrales</h2>
            <div className="row">
                <div className="col s12 l6">
                    <List viewable={true}
                            deletable={false}
                            editable={false}
                            selectable={false}
                            headers={["Corral", "Surtido"]}
                            rows={corrals}
                            onViewClicked={(idx) => {this.state.screenState.viewCorral(idx)}}
                            />
                </div>
                <div className="col s12 l6">
                    {this.state.screenState.getCorralView()}
                </div>
            </div>
            <div className="row">
                <MaterialButton className="right" text="Terminar alimentación" onClick={this.onFinishFeed}/>
            </div>
            </>
        );
    }
}

interface ScreenState{

    viewCorral:(idx:number) => void
    accept:(idx:number, kg: string) => void
    cancel:() => void
    getCorralView: () => JSX.Element
}

class WaitingState implements ScreenState{
    constructor(private ctx:FeedCorrals){}
    
    viewCorral: (idx: number) => void = (idx) => {
        let i = idx ;
        let corral = this.ctx.state.corrals[i]
        this.ctx.setState({
            idxSelectedCorral: idx,
            kg: corral.kg==null? "":corral.kg.toString(),
            screenState: new EditingState(this.ctx),
            canEdit: corral.id_feeds != null
        })
    }
    accept: (idx: number, kg: string) => void = (id, kg) => {
        toast("Seleccione un corral")
    }
    
    cancel: () => void = () => {
        toast("Seleccione un corral")
    }
    getCorralView: () => JSX.Element = () => (
        <p>Seleccione un corral</p>
    );
}

class EditingState implements ScreenState{
    constructor(private ctx:FeedCorrals){}
    
    viewCorral: (idx: number) => void = (idx) => {
        toast("Termine de editar el corral actual antes de continuar");
    }
    accept: (idx: number, kg: string) => void = (idx, kg) =>{
        if(kg == ""){
            toast("Debe de escribir un peso");
            return;
        }
        let fKg = parseFloat(kg);
        if(fKg == NaN){
            toast("Escriba un peso valido");
            return;
        }
        let corrals = Object.assign(this.ctx.state.corrals, {});
        let newcorral : OUT_CorralFeeding= {idCorral: idx.toString(), kg : parseInt(kg)}
        corrals[idx].kg = parseFloat(kg);
        console.log(newcorral)
        

        this.ctx.setState({
            screenState: new WaitingState(this.ctx),
            corrals,
            kg: ""
        })

    }
    
    cancel: () => void = () => {
        this.ctx.setState({
            screenState: new WaitingState(this.ctx)
        })
    }

    getCorralView: () => JSX.Element = () => {
        let corrals = this.ctx.state.corrals;
        let idx = this.ctx.state.idxSelectedCorral;
        let corral = corrals[idx];
        let kg = this.ctx.state.kg;
        
        return (
            <div>
                <p>Corral: {corral.name}</p>
                <TextInput disabled={this.ctx.state.canEdit} 
                            noLayout
                            type="number"
                            placeholder="Kg a surtir" 
                            onChange={({target:{value:kg}}) => {this.ctx.setState({kg})}} 
                            value={this.ctx.state.kg}/>
                <MaterialButton className="right" text="Aceptar" onClick={()=>this.ctx.state.screenState.accept(idx, kg)}/>
                <MaterialButton className="right" text="Cancelar" onClick={()=>this.ctx.state.screenState.cancel()}/>
            </div>);
    };
    
}