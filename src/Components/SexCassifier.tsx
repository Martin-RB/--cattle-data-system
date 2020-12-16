import React from "react";
import { OUT_SexClass } from "~/Classes/DataStructures/SexClass";
import { Button, TextInput } from "../../node_modules/react-materialize/lib/index";
import { toast } from "../App";


import { List, ListRow } from "./List";

export interface SexClassifierProp{
    values: Array<OUT_SexClass>;
    onChange: (list: Array<OUT_SexClass>) => void;
    sex: string;
}

interface SexClassifierState{
    values: Array<OUT_SexClass>;
    name: string;
    cost: string;
}

export class SexClassifier extends React.Component<SexClassifierProp, 
                                                SexClassifierState>{

    constructor(props: SexClassifierProp){
        super(props);

        this.state = {cost: "", name: "", values: props.values};
    }

    onNameChange = (value: string) => {
        this.setState({
            name: value
        })
    }

    onCostChange = (value: string) => {
        this.setState({
            cost: value
        })
    }

    onAdd = () => {
        let vals = this.state.values;
        if(this.state.name == "" || this.state.cost == ""){
            toast("Debes llenar el costo");
            return;
        }
        if(parseFloat(this.state.cost) == NaN){
            toast("El valor del costo debe de ser un numero");
            return;
        }
        vals.push({name: this.state.name, cost: parseFloat(this.state.cost).toString()})
        this.setState({
            values:vals,
            cost: "",
            name: ""
        })
    }

    onDelete = (idx: number) => {
        let vals = this.state.values;
        vals.splice(idx,1);
        this.setState({
            values: vals
        })

    }

    render():JSX.Element{
        return (
            <div>
                <p>Clasificaciones de {this.props.sex}</p>
                <div className="field--margin">
                    <TextInput  inputClassName="browser-default"
                                noLayout
                                placeholder="Nombre clasificación" 
                                value={this.state.name} 
                                onChange={({target:{value}}) => this.onNameChange(value)}/>
                </div>
                <div className="field--margin">
                    <TextInput inputClassName="browser-default"
                                noLayout
                                placeholder="Costo" 
                                type="number" 
                                value={this.state.cost.toString()} 
                                onChange={({target:{value}}) => this.onCostChange(value)}/>
                </div>
                <div className="field--margin">
                    <Button 
                            waves="light"
                            className="button--color"
                            onClick={this.onAdd}>Agregar</Button>
                </div>
                <List headers={["Nombre", "Costo"]} 
                        deletable 
                        rows={this.parseToRows()}
                        onDeleteClicked={this.onDelete}
                        />
            </div>
        );
    }

    parseToRows = () => {
        let array = new Array<ListRow>();
        this.state.values.forEach((el, i) => {
            array.push({
                columns: [el.name, el.cost.toString()]
            })
        });

        return array;

    }

}