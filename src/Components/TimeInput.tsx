import React from "react";
import { TextInput, TimePicker } from "../../node_modules/react-materialize/lib/index";
import { I18nOptions } from "../../node_modules/react-materialize/lib/utils";
import { Input, MaterialInput } from "./Input";

export interface ITime{
    hour: number,
    minute: number,
}

export interface TimeInputProps{
    onChange:(time: ITime) => void
    value: ITime
    label: string
    options?: I18nOptions 
    disable?:boolean
}

export interface TimeInputState{
    dateSet: boolean
}

export class TimeInput extends React.Component<TimeInputProps, TimeInputState>{

    actualTime: ITime;
    constructor(props: TimeInputProps){
        super(props);

        this.state = {
            dateSet: false
        };
        
        this.actualTime = props.value
    }

    onChange = (hour:number, minute: number) => {
        this.actualTime = {
            hour, minute
        }
    }

    render():JSX.Element{
        
        return (
            <div className={`${this.props.disable?"timeInput--disabled ":""}timeInputWrapper`}>
                <label>{this.props.label}</label>
                <TimePicker 
                    onChange={(h:any, m:any)=>{
                        this.onChange(h,m);
                    }}
                    options={{
                        i18n:{
                            ...this.props.options,
                        },
                        defaultTime: this.fromITimeToString(this.actualTime),
                        twelveHour: true,
                    }
                    }/>
            </div>
        );
    }

    /* setDate = (time: ITime) => {
        let instance:any;
        if(!this.selector) return;
        
        instance = M.Timepicker.getInstance(this.selector) as any;

        instance.amOrPm = time.hour >= 12? "PM":"AM";
        instance.hours = time.hour >= 12? time.hour - 12:time.hour;
        instance.minutes = time.minute;
        return `${instance.hours}:${parseInt(instance.minutes)<9?"0":""}${instance.minutes} ${instance.amOrPm}`
    } */
    
    fromITimeToString = (t: ITime) => {
        return `${t.hour}:${t.minute}`
    }

}