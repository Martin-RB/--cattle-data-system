import React from "react";
import { MaterialButton } from "./Button";

interface IElementBotProps{
    onAccept: () => void;
    onDeny: () => void;
}

export class ElementBot extends React.Component<IElementBotProps>{
    render(): JSX.Element{
        return <div className="elcfg--bot row">
            <div className="elcfg--bot-buttons">
                <MaterialButton className="elcfg--button--spacing" text="Cancelar" onClick={this.props.onDeny}/>
                <MaterialButton className="elcfg--button--spacing" text="Aceptar" onClick={this.props.onAccept}/>
            </div>
        </div>
    }
}