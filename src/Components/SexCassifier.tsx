import React from "react";
import { OUT_SexClass } from "~/Classes/DataStructures/SexClass";
import { Input } from "./Input";
import { MaterialButton } from "./Button";
import { List, ListRow } from "./List";

export interface SexClassifierProp{
    values: Array<OUT_SexClass>;
    onChange: (list: Array<OUT_SexClass>) => void;
    sex: string;
}

interface SexClassifierState{
    values: Array<OUT_SexClass>;
    name: string;
    cost: number;
}

export class SexClassifier extends React.Component<SexClassifierProp, 
                                                SexClassifierState>{

    constructor(props: SexClassifierProp){
        super(props);

        this.state = {cost: 0, name: "", values: props.values};
    }

    onNameChange = (value: string) => {
        this.setState({
            name: value
        })
    }

    onCostChange = (value: string) => {
        let val = parseFloat(value);
        this.setState({
            cost: val
        })
    }

    onAdd = () => {
        let vals = this.state.values;
        vals.push({name: this.state.name, cost: this.state.cost.toString()})
        this.setState({
            values:vals,
            cost: 0,
            name: ""
        })
    }

    onDelete = (id: string) => {
        let vals = this.state.values;
        vals.splice(parseInt(id),1);
        this.setState({
            values: vals
        })

    }

    render():JSX.Element{
        return (
            <div>
                <p>Clasificaciones de {this.props.sex}</p>
                <div className="field--margin">
                    <Input placeholder="Nombre clasificación" value={this.state.name} onChange={(name, val) => this.onNameChange(val)}/>
                </div>
                <div className="field--margin">
                    <Input placeholder="Costo" type="number" value={this.state.cost.toString()} onChange={(name, val) => this.onCostChange(val)}/>
                </div>
                <div className="field--margin">
                    <MaterialButton text="Agregar" onClick={this.onAdd}/>
                </div>
                <List headers={["Nombre", "Costo"]} 
                        deletable={true} 
                        rows={this.parseToRows()}
                        editable={false}
                        selectable={false}
                        onDeleteClicked={this.onDelete}
                        />
            </div>
        );
    }

    parseToRows = () => {
        let array = new Array<ListRow>();
        this.state.values.forEach((el, i) => {
            array.push({
                columns: [el.name, el.cost.toString()],
                id: i.toString()
            })
        });

        return array;

    }

}