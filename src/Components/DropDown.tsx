import React from "react";
import { IOption } from "~/Classes/IOption";
import { IRoutable } from "~/Classes/IRoutable";
import { Link } from "react-router-dom";
import { IKeyed } from "../Classes/IKeyed";

interface DropDownProps<TItem>{
    numIndicator?: boolean,
    gap?: JSX.Element
    content: Array<IOption>
    text?: string,
    className?: string
    onClick?: (key: string) => void
}

export class DropDown<TItem> extends React.Component<DropDownProps<TItem>>{

    static DropIdx:number = 1;
    thisDrop:number;

    constructor(props: DropDownProps<TItem>){
        super(props);

        
        this.thisDrop = DropDown.DropIdx++;
    }

    componentDidMount(){
        
        let elems = document.querySelectorAll(`.drop_${this.thisDrop}`);
        
        if(elems){
            let dd = M.Dropdown.init(elems, {coverTrigger: false, closeOnClick: false, alignment: "left", constrainWidth: false});            
        }
    }

    render(): JSX.Element{
        return <>
        <a className={`drop_${this.thisDrop} ` + 'dropdown-trigger black-text ' + this.props.className} href='#' data-target={`drop_${this.thisDrop}`}>
            {this.props.numIndicator?<span className="badge black-text">{this.props.content.length.toString()}</span>:null}
            {this.props.text}
            {this.props.gap?this.props.gap:<i className="material-icons right">arrow_drop_down</i>}
        </a>

        <ul id={`drop_${this.thisDrop}`} className={'dropdown-content dropdown--drop--positioning'}>
            {this.props.content.map((e, i) => {
                return <li key={e.key}><a href="#" onClick={() => {
                    this.props.onClick?this.props.onClick(e.key):""
                }}>{e.name.startsWith(":")?
                    <i className="material-icons">{e.name.substr(1, e.name.length-2)}</i>:e.name}</a></li>
            })}
        </ul>
        </>
    }
}