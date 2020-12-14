import React from "react";
import { Select } from "./Select";
import { IOption } from "~/Classes/IOption";
import { Button, MaterialButton } from "./Button";

interface ElementTopProps{
    elementPlaceholder?: string;
    elements: Array<IOption>;
    idxSelectedElement: number;
    onElementSelected: (idx: number) => boolean;
    onClickAdd: () => void;
    onClickDelete: () => void;
}

interface ElementTopState{
    
}

export class ElementSelectorTop extends React.Component<ElementTopProps, ElementTopState>{

    constructor(props: ElementTopProps){
        super(props);
        this.state = {};
    }

    onElementSelected = (idx: number)=>{
        let isAccepted = this.props.onElementSelected(idx);
        return isAccepted;
    }
    render(): JSX.Element{
        return <div className="row elcfg--top">
            <div className="elcfg--top--vertical-pos col s6">
                <Select elements={this.props.elements} 
                        value={this.props.idxSelectedElement} 
                        onChange={this.onElementSelected} 
                        placeholder={this.props.elementPlaceholder}/>
            </div>
            <div className="elcfg--top--vertical-pos col s6">
                <div className="elcfg--top-buttons">

                    <MaterialButton className="elcfg--button--spacing" text="Eliminar" onClick={this.props.onClickDelete}/>
                    <MaterialButton className="elcfg--button--spacing" text="Agregar" onClick={this.props.onClickAdd}/>
                </div>
            </div>
        </div>
    }
}