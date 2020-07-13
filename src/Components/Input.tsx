import React, { ChangeEvent } from "react";
import M from "materialize-css";

export interface IInputProps{
    text?: string;
    onChange?: (name: string, text: string) => void;
    placeholder?: string;
    name?: string;
    className?: string;
    id?: string;
}

interface IInputState{
    text: string;
}

export class Input extends React.Component<IInputProps, IInputState>{
    
    constructor(props: IInputProps){
        super(props);
        this.state = {text: this.props.text || ""};
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        M.updateTextFields();
    }

    onChange(e: ChangeEvent){
        let t = e.target as HTMLInputElement;
        if(this.props.onChange){
            this.props.onChange(this.props.name || "", t.value);
        }

        this.setState({
            text: t.value
        })
    }


    render(): JSX.Element{
        return <input 
                    type="text" 
                    onChange={this.onChange} 
                    value={this.state.text} 
                    placeholder={this.props.placeholder || ""}
                    className={`browser-default ${this.props.className || ""}`}/>
    }
}

export class MaterialInput extends Input{
    static idCounter : number = 0;
    render(): JSX.Element{
        MaterialInput.idCounter++;
        return <div className="input-field">
            <input 
                id={this.props.id? this.props.id : "lbled_" + MaterialInput.idCounter.toString()} 
                type="text" 
                onChange={this.onChange} 
                className="validate"/>
            <label 
                htmlFor={this.props.id? this.props.id : "lbled_" + MaterialInput.idCounter.toString()}
            >{this.props.placeholder}</label>
        </div>
    }
}