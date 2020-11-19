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
    width?: string;
    isInline?: boolean;
    type?: "text" | "number" | "password";
    onClick?: (e:React.MouseEvent<HTMLInputElement>) => void;
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

    onClick = (e:React.MouseEvent<HTMLInputElement>) => {
        this.props.onClick?this.props.onClick(e):undefined;
    }


    render(): JSX.Element{
        return <>
                <label className={this.props.isInline?"": "input-label--positioning"}
                    htmlFor={this.props.id? this.props.id : "lbled_" + MaterialInput.inputCounter.toString()}>
                        {this.props.placeholder}
                </label>
                <input 
                    type={this.props.type != undefined? this.props.type: "text"} 
                    style={{width: this.props.width || ""} as React.CSSProperties}
                    id={this.props.id? this.props.id : "lbled_" + Input.inputCounter.toString()} 
                    onChange={this.onChange} 
                    value={this.props.value? this.props.value: ""} 
                    disabled={this.props.locked}
                    onClick={this.onClick}
                    className={`browser-default input ${this.props.wrong? "" : ""} ${this.props.className || ""}`}/>
                
                </>
    }
}

export class MaterialInput extends Input{
    private static matInputCounter : number = 0;

    constructor(props: IInputProps){
        super(props);
    }

    render(): JSX.Element{
        MaterialInput.matInputCounter++;
        return <div className="input-field">
            <input 
                id={this.props.id? this.props.id : "lbled_" + MaterialInput.matInputCounter.toString()} 
                type={this.props.type} 
                onChange={this.onChange} 
                value={this.props.value? this.props.value: ""} 
                disabled={this.props.locked}
                className={"validate " + this.props.className}/>
            <label 
                htmlFor={this.props.id? this.props.id : "lbled_" + MaterialInput.matInputCounter.toString()}
            >{this.props.placeholder}</label>
        </div>
    }
}