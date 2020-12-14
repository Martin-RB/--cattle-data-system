import { InternationalizationOptions } from "materialize-css";
import React from "react";
import { TextInput } from "../../node_modules/react-materialize/lib/index";
import { Input, MaterialInput } from "./Input";

export interface DateInputProps{
    onChange:(date: Date) => void;
    value: Date;
    id: string;
    placeholder:string;
    options?: InternationalizationOptions
}

export interface DateInputState{
    dateSet: boolean
}

export class DateInput extends React.Component<DateInputProps, DateInputState>{

    selector: Element | null = null;
    constructor(props: DateInputProps){
        super(props);

        this.state = {
            dateSet: false
        };
    }

    componentDidMount(){
        this.selector = document.querySelector("#"+this.props.id)
        var dis = this;
        M.Datepicker.init(this.selector, {
            i18n:{
                ...this.props.options
            },
            onClose: function() {
                dis.onChange();
            }
        })[0];
        this.forceUpdate()
    }

    onChange = () => {
        let instance;
        if(!this.selector) return;
        
        instance = M.Datepicker.getInstance(this.selector);
        this.props.onChange(instance.date);
        this.setState({
            dateSet: true
        })
    }

    render():JSX.Element{
        let dateString = this.setDate(this.props.value);

        return (
            <TextInput inputClassName={`datepicker ${this.state.dateSet? "valid": ""}`}
                        noLayout
                        label="Fecha"
                        value={dateString} 
                        id={this.props.id} 
                        placeholder={this.props.placeholder}/>
        );
    }
    componentDidUpdate(prevProps: DateInputProps, prevState: DateInputState){
        
    }

    setDate = (date: Date) => {
        let instance;
        if(!this.selector) return;
        
        instance = M.Datepicker.getInstance(this.selector);
        instance.setDate(date);
        return instance.toString();
    }
    

}