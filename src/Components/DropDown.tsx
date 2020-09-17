import React from "react";
import { IOption } from "~/Classes/IOption";
import { IRoutable } from "~/Classes/IRoutable";
import { Link } from "react-router-dom";

interface DropDownProps<TItem>{
    numIndicator?: boolean,
    content: Array<IRoutable>
    text: string,
    className?: string,
}

export class DropDown<TItem> extends React.Component<DropDownProps<TItem>>{

    componentDidMount(){
        M.AutoInit()
    }

    render(): JSX.Element{
        return <>
        <a className={'dropdown-trigger black-text ' + this.props.className} href='#' data-target='dropdown'>
            <span className="badge black-text">{this.props.numIndicator? this.props.content.length.toString(): ""}</span>
            {this.props.text}
            <i className="material-icons right">arrow_drop_down</i>
        </a>

        <ul id='dropdown' className={'dropdown-content dropdown--drop--positioning'}>
            {this.props.content.map((e, i) => {
                return <li key={e.key}><Link to={{pathname: e.route}}>{e.name}</Link></li>
            })}
        </ul>
        </>
    }
}