import React from "react";

interface CheckboxProps{
    value: string;
    onChange: (name: string, value: string, isChecked: boolean) => void;
    name: string;
    checked: boolean;
    indeterminated?: boolean;
}

export class Checkbox extends React.Component<CheckboxProps>{
    static ID = 0;
    onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        this.props.onChange(this.props.name, this.props.value, !this.props.checked);
        this.forceUpdate();
    }
    render(): JSX.Element{
        Checkbox.ID++;
        let id = this.props.indeterminated != undefined && this.props.indeterminated?"indeterminate-checkbox":Checkbox.ID.toString();
                    return <>
                            <label htmlFor={id}>
                                <input type="checkbox" 
                                        checked={this.props.checked}
                                        onChange={this.onChange}
                                        className="filled-in"
                                        id={id}/>
                                <span></span>
                            </label></>
    }
}