import React from "react";
import { Input, MaterialInput } from "./Input";

export interface DateInputProps{
    onChange:(date: Date) => void;
    value: Date;
    id: string;
    placeholder:string;
}

export interface DateInputState{
    
}

export class DateInput extends React.Component<DateInputProps, DateInputState>{

    selector: Element | null = null;
    constructor(props: DateInputProps){
        super(props);

        this.state = {};
    }

    componentDidMount(){
        this.selector = document.querySelector("#"+this.props.id)
        M.Datepicker.init(this.selector, {
            onClose: () => {
                this.onChange();
            }
        })[0];
        this.forceUpdate()
    }

    onChange = () => {
        let instance;
        if(!this.selector) return;
        
        instance = M.Datepicker.getInstance(this.selector);
        this.props.onChange(instance.date);
        this.forceUpdate()
    }

    render():JSX.Element{
        let dateString = this.setDate(this.props.value);

        return (
            <MaterialInput className="datepicker"
                        value={dateString} id={this.props.id} placeholder={this.props.placeholder}/>
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