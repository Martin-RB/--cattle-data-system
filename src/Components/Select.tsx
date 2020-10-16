import React from "react";
import { IOption } from "~/Classes/IOption";

interface SelectProps{
    elements: Array<IOption> | Array<Array<IOption>>,
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

    optCount = 0;

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
                {
                    (this.props.elements.length > 0 
                        && (this.props.elements[0] as IOption[]).length != undefined)?
                    (this.props.elements as IOption[][]).map((e) => <optgroup key={"_"+this.optCount++}>{e.map((ee) => <option key={ee.key} value={ee.key}>{ee.name}</option>)}</optgroup>):
                    (this.props.elements as IOption[]).map((e) => {
                    return <option key={e.key} value={e.key}>{e.name}</option>
                })}
            </select>
        </>
    }
}