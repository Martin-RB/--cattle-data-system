import React from "react";

interface IButtonProps{
    text: string;
    className?: string;
    onClick?: () => void;
}

interface IButtonState{

}

export class Button extends React.Component<IButtonProps, IButtonState>{

    constructor(props: IButtonProps){
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        if(this.props.onClick){
            this.props.onClick();
        }
    }

    render(): JSX.Element{
        return <input 
            className={`button--color ${this.props.className? this.props.className : ""}`}
            type="button" 
            value={this.props.text} 
            onClick={this.onClick}/>
    }
}

export class MaterialButton extends Button{
    render(){
        return <a 
            className={`button--color waves-effect waves-light btn ${this.props.className? this.props.className : ""}`}
            onClick={this.onClick}>
                {this.props.text}
            </a>;
    }
}