import React from "react";

interface CheckboxProps{
    value: string;
    onChange: (name: string, value: string, isChecked: boolean) => void;
    name: string;
    checked: boolean;
    indeterminated?: boolean;
}

export class Checkbox extends React.Component<CheckboxProps>{
    onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        this.props.onChange(this.props.name, this.props.value, !this.props.checked);
        this.forceUpdate();
    }
    render(): JSX.Element{
                    return <>
                            <label>
                                <input type="checkbox" 
                                        checked={this.props.checked}
                                        onChange={this.onChange}
                                        className="filled-in"
                                        id={this.props.indeterminated != undefined && this.props.indeterminated?"indeterminate-checkbox":""}/>
                                <span></span>
                            </label></>
    }
}