import React from "react";
import { Input, MaterialInput } from "../Components/Input";
import { Button, MaterialButton } from "../Components/Button";
import { useHistory } from "react-router-dom";
import { HISTORY } from "../App";

interface LoginProps{

}

interface HashMap{
    [key: string]: string
}

interface LoginState{
    fields: HashMap
}

enum LoginFields{
    username = "username",
    password = "password"
}

export class Login extends React.Component<LoginProps, LoginState>{


    

    constructor(props: LoginProps){
        super(props);
        this.state = {
            fields: {}
        };
        

        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
    }

    onSubmit(){
        HISTORY.push({
            pathname: "/menu",
            state: {
                username: this.state.fields[LoginFields.username],
                password: this.state.fields[LoginFields.password],
            }
        });
    }

    onInputChanged(name: string, text: string){
        let fields = this.state.fields;
        fields[name] = text;

        this.setState({
            fields
        })
    }

    render(): JSX.Element{
        
        return <div className="login--background">
            <div className="login--container">
                <h1>Cattle Data System</h1>
                <div className="row element--background--black element--left-line">
                    <div className="col s4 login--form">
                        <MaterialInput placeholder="Usuario" name={LoginFields.username} onChange={this.onInputChanged} text={this.state.fields[LoginFields.username]}></MaterialInput>
                        <MaterialInput placeholder="Contraseña" name={LoginFields.password} onChange={this.onInputChanged} text={this.state.fields[LoginFields.password]}></MaterialInput>
                        <MaterialButton text="Ingresar" onClick={this.onSubmit}/>
                    </div>
                </div>
            </div>
        </div>
    }
}