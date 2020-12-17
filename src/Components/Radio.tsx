import React from "react";

interface IRadioProps{
    class?: string,
    name: string,
    text: string,
    value: string,
    checked: boolean,
    onChange: (name: string, value: string) => void
    disabled?: boolean
}

export class Radio extends React.Component<IRadioProps>{
    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(this.props.name, this.props.value);
    }
    render(): JSX.Element{
        return  <label>
                    <input disabled={this.props.disabled} className={`with-gap ${this.props.class? this.props.class:""}`} name={this.props.name} value={this.props.value} checked={this.props.checked} type="radio" onChange={this.onChange}/>
                    <span>{this.props.text}</span>
                </label>
    }
}