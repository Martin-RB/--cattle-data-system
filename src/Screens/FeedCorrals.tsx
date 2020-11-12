import React, { createContext } from "react";
import { List, ListRow } from "../Components/List";
import { MaterialInput } from "../Components/Input";
import { MaterialButton } from "../Components/Button";
import { toast } from "../App";
import { IN_Feeds } from "../Classes/DataStructures/Feeds";
import url from "./ConfigI";

interface FeedCorralsState{
    screenState: ScreenState
    kg: string
    corrals: Array<IN_Feeds>
    selectedCorral: number
}

export class FeedCorrals extends React.Component<{}, FeedCorralsState>{
    constructor(props: {}){
        super(props)

        this.state = {
            corrals: [],
            kg:"",
            screenState: new WaitingState(this),
            selectedCorral: -1
        }
    }

    componentDidMount(){
        this.gatherCorrals();
    }
    render():JSX.Element{
        let corrals = this.state.corrals.map((v,i) => 
        ({
            id: i.toString(), 
            columns: [v.name, v.kg?v.kg.toFixed(2):"-"]} as ListRow))
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
                            onViewClicked={(id) => {this.state.screenState.viewCorral(id)}}
                            />
                </div>
                <div className="col s12 l6">
                    {this.state.screenState.getCorralView()}
                </div>
            </div>
            <div className="row">
                <MaterialButton className="right" text="Terminar alimentación"/>
            </div>
            </>
        );
    }

    async gatherCorrals(){
        let data: IN_Feeds[];
        try {
            let date = new Date().getTime()
            const response = await fetch(url + `/corrals/alimentacion/${date}`, {
                method: 'GET', 
                mode: 'cors', 
                cache: 'no-cache', 
            }); 

            data = await response.json() as IN_Feeds[]

        } catch (error) {
            console.log(error);
            data = []
        }

        this.setState({
            corrals: data
        })
    }
}

interface ScreenState{

    viewCorral:(id:string) => void
    accept:(id:string, kg: string) => void
    cancel:() => void
    getCorralView: () => JSX.Element
}

class GatherState implements ScreenState{
    viewCorral: (id: string) => void = () => {
        toast("Recibiendo datos, por favor espere")
    };
    accept: (id: string, kg: string) => void = () => {
        toast("Recibiendo datos, por favor espere")
    };
    cancel: () => void = () => {
        toast("Recibiendo datos, por favor espere")
    };;
    getCorralView: () => JSX.Element = () => {
        return <p>Recibiendo datos, por favor espere</p>
    };;

}

class WaitingState implements ScreenState{
    constructor(private ctx:FeedCorrals){}
    
    viewCorral: (id: string) => void = (id) => {
        let i = parseInt(id);
        let corral = this.ctx.state.corrals[i]
        this.ctx.setState({
            selectedCorral: parseInt(id),
            kg: corral.kg?.toString() || "0",
            screenState: new EditingState(this.ctx)
        })
    }
    accept: (id: string, kg: string) => void = (id, kg) => {
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
    
    viewCorral: (id: string) => void = (id) => {
        toast("Termine de editar el corral actual antes de continuar");
    }
    accept: (id: string, kg: string) => void = (id, kg) =>{
        let corrals = Object.assign(this.ctx.state.corrals, {});
        corrals[parseInt(id)].kg = parseFloat(kg);
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
        let id = this.ctx.state.selectedCorral;
        let corral = corrals[id];
        let kg = this.ctx.state.kg;
        
        return (
            <div>
                <p>Corral: {corral.name}</p>
                <MaterialInput placeholder="Kg a surtir" onChange={(_,kg) => {this.ctx.setState({kg})}} value={this.ctx.state.kg}/>
                <MaterialButton className="right" text="Acceptar" onClick={()=>this.ctx.state.screenState.accept(id.toString(), kg)}/>
                <MaterialButton className="right" text="Cancelar" onClick={()=>this.ctx.state.screenState.cancel()}/>
            </div>);
    };
    
}