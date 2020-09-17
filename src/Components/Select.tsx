import React from "react";
import { IOption } from "~/Classes/IOption";

interface SelectProps{
    elements: Array<IOption>,
    className?: string,
    value?: string,
    placeholder?: string
    onChange: (value: string) => boolean;
}

export class Select extends React.Component<SelectProps>{

    constructor(props: SelectProps){
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e: React.ChangeEvent<HTMLSelectElement>){
        let value = e.target.value;
        if(this.props.onChange(value)){
            this.setState({});
        };
    }

    render(): JSX.Element{
        return <>
            <select className={`browser-default ${this.props.className?this.props.className:""}`} value={this.props.value} onChange={this.onChange}>
                {(this.props.placeholder)?<option disabled={true} value="-1">{this.props.placeholder}</option>: null}
                {this.props.elements.map((e) => {
                    return <option key={e.key} value={e.key}>{e.name}</option>
                })}
            </select>
        </>
    }
}