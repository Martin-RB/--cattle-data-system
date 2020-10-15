import React, { Provider } from "react";
import { HISTORY } from "../App";
import { MaterialInput } from "../Components/Input";
import { Select } from "../Components/Select";
import { SexClassifier } from "../Components/SexCassifier";
import { TimeInput, ITime } from "../Components/TimeInput";
import { DateInput } from "../Components/DateInput";
import { ISexClass } from "~/Classes/DataStructures/SexClass";
import { IOption } from "../Classes/IOption";
import { MaterialButton } from "../Components/Button";

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
    provider: string,
    classMale: Array<ISexClass>,
    classFemale: Array<ISexClass>,
    providers: Array<IOption>
}

export class LorryRegister extends React.Component<LorryRegisterProps, LorryRegisterState>{

    constructor(props: LorryRegisterProps){
        super(props);

        let date = new Date();
        let time:ITime = {hour: date.getHours(), minute: date.getMinutes()}
        this.state = {
            date,
            time,
            number: "",
            heads: "",
            kgOrigin: "",
            provider: "-1",
            classMale: [],
            classFemale: [],
            providers:[]
        };
    }

    componentDidMount(){
        let asd = async() => {
            return new Promise((res, rej) => {
                setTimeout(() => this.setState({
                    providers: [{
                        key: "1",
                        name: "11"
                    }]
                }), 5000);
                res();
            })
        }
        asd();
    }

    onAccept = () => {
        if((HISTORY.location.state as any)?._fromMenu == true)
            HISTORY.goBack()
        else
            HISTORY.push("/menu")
    }

    render(): JSX.Element{
        
        return (
            <div className="row">
                <div className="col s12 m10 l10 offset-m1">
                    <div className="row">
                        <div className="col s6">
                            <DateInput placeholder="fecha" 
                                        id="fecha" 
                                        onChange={(a) => this.setState({
                                            date: a
                                        })} 
                                        value={this.state.date}
                                        />
                        </div>
                        <div className="col s6">
                            <TimeInput placeholder="hora" 
                                        id="hora" 
                                        onChange={(a) => this.setState({
                                            time: a
                                        })} 
                                        value={this.state.time}/>
                        </div>
                    </div>
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
                                    value={this.state.provider}
                                    elements={this.state.providers}
                                    onChange={(a)=>{
                                        this.setState({
                                            provider: a
                                        })
                                        return true;
                                    }}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s6">
                            <SexClassifier 
                                    sex="machos"
                                    onChange={(a) => this.setState({
                                        classMale: a
                                    })}
                                    values={this.state.classMale}/>
                        </div>
                        <div className="col s6">
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
        )
    }
}