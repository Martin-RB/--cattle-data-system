import { InternationalizationOptions } from "materialize-css";
import React, { createRef } from "react";
import { DatePicker, TextInput } from "../../node_modules/react-materialize/lib/index";
import { Input, MaterialInput } from "./Input";

export interface DateInputProps{
    onChange:(date: Date) => void;
    value?: Date;
    id: string;
    label:string;
    options?: InternationalizationOptions
    minDate?: Date
    maxDate?: Date
    disabled?: boolean
}

export interface DateInputState{
    dateSet: boolean
}

export class DateInput extends React.Component<DateInputProps, DateInputState>{

    date: Date | undefined
    constructor(props: DateInputProps){
        super(props);

        this.date = props.value;
    }

    onChange = (date: Date) => {
        this.date = date;
    }

    render():JSX.Element{
        return (<>
            <label>{this.props.label}</label>
            <div className={`dateInputWrapper ${this.props.disabled?"dateInput--disabled":""}`}>
            <DatePicker 
                        onChange={date=>{
                            this.onChange(date);
                            return date;
                        }}
                        options={{
                            i18n:{
                                ...this.props.options
                            },
                            minDate: this.props.minDate,
                            maxDate: this.props.maxDate,
                            defaultDate: this.props.value,
                            onClose: _=>{
                                this.props.onChange(this.date ?? new Date())
                            },
                            setDefaultDate: true,
                            events: [(new Date(new Date().getTime() - 1000*60*60*24*5)).toDateString()]}
                        }
                        />
            </div>
            </>
        );
    }
}