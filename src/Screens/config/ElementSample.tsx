import React, { createRef } from "react";
import { ElementSelectorTop } from "../../Components/ElementTop";
import { IOption } from "~/Classes/IOption";
import { ElementBot } from "../../Components/ElementBot";

interface IElementSampleProps{
    title: string;
    showContent: boolean;
    items: Array<IOption>;
    idxSelectedItem: number;
    selectionPlaceholder: string;
    state: IState;
}

export interface IState{
    onItemAdd: () => void;
    onItemRemove: () => void;
    onItemSelected: (idx: number) => boolean;
    onAccept: () => void;
    onCancel: () => void;
    showContent: () => boolean;
}

export class ElementSample extends React.Component<IElementSampleProps>{

    private fatherRef: React.RefObject<HTMLDivElement>;
    private node: HTMLElement | undefined;

    constructor(props:IElementSampleProps){
        super(props);
        
        this.fatherRef = createRef<HTMLDivElement>();
    }

    componentDidMount(){
        this.node = (this.fatherRef.current)? this.fatherRef.current: undefined;
        this.node?.addEventListener("keyup", this.doShortcut, false);
    }
    componentWillUnmount(){
        this.node?.removeEventListener("keyup", this.doShortcut, false)
    }

    doShortcut = (ev: KeyboardEvent) => {        
        ev.preventDefault();
        if(ev.keyCode === 13){
            this.props.state.onAccept();
        }
        else if(ev.keyCode === 27){
            this.props.state.onCancel();
        }
    }

    render(): JSX.Element{
        return <div className="elcfg" ref={this.fatherRef}>
            <h2>{this.props.title}</h2>
            <ElementSelectorTop 
                        onClickAdd={this.props.state.onItemAdd} 
                        onClickDelete={this.props.state.onItemRemove} 
                        onElementSelected={this.props.state.onItemSelected}
                        elements={this.props.items}
                        elementPlaceholder={this.props.selectionPlaceholder}
                        idxSelectedElement={this.props.idxSelectedItem}/>
            {this.props.showContent? 
                <>
                    <div className="divider row"></div>
                    {this.props.children}
                    <div className="divider row"></div>
                    <ElementBot onAccept={this.props.state.onAccept} onDeny={this.props.state.onCancel}/>
                </>:
                null}
        </div>
    }
}