import React from "react";
import { TextInput } from "../../node_modules/react-materialize/lib/index";
import { Input, MaterialInput } from "./Input";

export interface ITime{
    hour: number,
    minute: number,
}

export interface TimeInputProps{
    onChange:(time: ITime) => void;
    value: ITime;
    id: string;
    placeholder:string;
}

export interface TimeInputState{
    dateSet: boolean
}

export class TimeInput extends React.Component<TimeInputProps, TimeInputState>{

    selector: Element | null = null;
    constructor(props: TimeInputProps){
        super(props);

        this.state = {
            dateSet: false
        };
    }

    componentDidMount(){
        this.selector = document.querySelector("#"+this.props.id)
        M.Timepicker.init(this.selector, {
            onCloseEnd: () => {
                this.onChange();
            }
        })[0];
        
        this.forceUpdate()
    }

    onChange = () => {
        let instance:any;
        if(!this.selector) return;
        
        instance = M.Timepicker.getInstance(this.selector) as any;
        let hour = parseInt(instance.hours)
        this.props.onChange({
            hour: (instance.amOrPm == "PM")? hour+12: hour,
            minute: parseInt(instance.minutes),
        });
        this.setState({
            dateSet: true
        })
        
    }

    render():JSX.Element{
        let time = this.setDate(this.props.value);
        return (
            <TextInput inputClassName={`timepicker ${this.state.dateSet?"valid":""}`} 
                        noLayout
                        label="Hora"
                        value={time} 
                        id={this.props.id} 
                        placeholder={this.props.placeholder}/>
        );
    }

    setDate = (time: ITime) => {
        let instance:any;
        if(!this.selector) return;
        
        instance = M.Timepicker.getInstance(this.selector) as any;

        instance.amOrPm = time.hour >= 12? "PM":"AM";
        instance.hours = time.hour >= 12? time.hour - 12:time.hour;
        instance.minutes = time.minute;
        return `${instance.hours}:${parseInt(instance.minutes)<9?"0":""}${instance.minutes} ${instance.amOrPm}`
    }
    

}