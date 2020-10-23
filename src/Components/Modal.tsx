import React, { createRef } from "react";

export interface ModalData{
    title: string,
    content: string | JSX.Element,
    acceptText?: string,
    cancelText?: string,
    onFinish: (opt: ModalExitOptions) => void;
}

interface IModalProps{
    data: ModalData
}

export enum ModalExitOptions{
    EXIT="c",
    ACCEPT="b",
    CANCEL="a"
}

export class Modal extends React.Component<IModalProps>{

    private closingState = ModalExitOptions.EXIT;
    private instance: M.Modal | undefined;

    private fatherRef: React.RefObject<HTMLDivElement>;

    constructor(props: IModalProps){
        super(props);

        this.fatherRef = createRef<HTMLDivElement>();
    }

    componentDidMount(){
        var elems = document.querySelectorAll('#modal1')[0];
        this.instance = M.Modal.init(elems, {
            onCloseEnd: (el) => {
                
                this.props.data.onFinish(this.closingState)
                this.closingState = ModalExitOptions.EXIT
            }
        });
        this.instance.open();
        
        this.fatherRef.current!.addEventListener("keyup", this.doShortcuts, false);
    }

    componentWillUnmount(){
        this.fatherRef.current!.removeEventListener("keyup", this.doShortcuts, false);
    }

    doShortcuts = (ev: KeyboardEvent) => {        
        ev.preventDefault();
        ev.stopPropagation()
        
        if(ev.keyCode === 13){
            this.onAccept();
            this.instance?.close()
        }
        else if(ev.keyCode === 27){
            this.onCancel();
            this.instance?.close()
        }
    }

    onAccept = () => {        
        this.closingState = ModalExitOptions.ACCEPT
    }

    onCancel = () => {
        this.closingState = ModalExitOptions.CANCEL
    }

    render():JSX.Element{
        return  <div id="modal1" className="modal" ref={this.fatherRef}>
                    <div className="modal-content">
                        <h4>{this.props.data.title}</h4>
                        {(typeof this.props.data.content == "string")?
                            <p>{this.props.data.content}</p>:this.props.data.content}
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={this.onCancel}>Cancelar</a>
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={this.onAccept}>Aceptar</a>
                    </div>
                </div>
    }
}