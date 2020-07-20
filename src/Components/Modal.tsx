import React from "react";

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

    constructor(props: IModalProps){
        super(props);

    }

    componentDidMount(){
        var elems = document.querySelectorAll('#modal1')[0];
        var instances = M.Modal.init(elems, {
            onCloseEnd: (el) => {
                this.props.data.onFinish(this.closingState)
                this.closingState = ModalExitOptions.EXIT
            }
        });
        instances.open();
    }

    onAccept = () => {        
        this.closingState = ModalExitOptions.ACCEPT
    }

    onCancel = () => {
        this.closingState = ModalExitOptions.CANCEL
    }

    render():JSX.Element{
        return  <div id="modal1" className="modal">
                    <div className="modal-content">
                        <h4>{this.props.data.title}</h4>
                        <p>{this.props.data.content}</p>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={this.onCancel}>Cancelar</a>
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={this.onAccept}>Aceptar</a>
                    </div>
                </div>
    }
}