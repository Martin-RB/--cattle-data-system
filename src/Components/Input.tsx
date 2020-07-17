import React, { ChangeEvent } from "react";
import M from "materialize-css";

export interface IInputProps{
    value?: string;
    onChange?: (name: string, text: string) => void;
    placeholder?: string;
    name?: string;
    className?: string;
    id?: string;
    locked?: boolean;
    wrong?: boolean;
}

interface IInputState{
    
}

export class Input extends React.Component<IInputProps, IInputState>{
    
    private static inputCounter : number = 0;

    constructor(props: IInputProps){
        super(props);
        Input.inputCounter++;
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
        return <>
                <label className="input-label--positioning"
                    htmlFor={this.props.id? this.props.id : "lbled_" + MaterialInput.inputCounter.toString()}>
                        {this.props.placeholder}
                </label>
                <input 
                    type="text" 
                    id={this.props.id? this.props.id : "lbled_" + Input.inputCounter.toString()} 
                    onChange={this.onChange} 
                    value={this.props.value? this.props.value: ""} 
                    disabled={this.props.locked}
                    className={`browser-default ${this.props.wrong? "" : ""} ${this.props.className || ""}`}/>
                
                </>
    }
}

export class MaterialInput extends Input{
    private static matInputCounter : number = 0;

    constructor(props: IInputProps){
        super(props);
        MaterialInput.matInputCounter++;
    }

    render(): JSX.Element{
        return <div className="input-field">
            <input 
                id={this.props.id? this.props.id : "lbled_" + MaterialInput.matInputCounter.toString()} 
                type="text" 
                onChange={this.onChange} 
                value={this.props.value? this.props.value: ""} 
                disabled={this.props.locked}
                className="validate"/>
            <label 
                htmlFor={this.props.id? this.props.id : "lbled_" + MaterialInput.matInputCounter.toString()}
            >{this.props.placeholder}</label>
        </div>
    }
}