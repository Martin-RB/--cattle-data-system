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
        <div className="section"></div>
          <main>
            <center>
              <img className="responsive-img" width="210px" src=".../img/vaquita.svg" />
              <div className="section"></div>

              <h5 className="indigo-text">Introduzca sus credenciales</h5>
              <div className="section"></div>

              <div className="container">
                <div className="z-depth-1 grey lighten-4 row contenedor" >

                  <form className="col s12" method="post">
                    <div className='row'>
                      <div className='col s12'>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='input-field col s12'>
                        <input className='validate' type='email' name='email' id='email' placeholder="Introduzca su email" />
                      </div>
                    </div>

                    <div className='row'>
                      <div className='input-field col s12'>
                        <input className='validate' type='password' name='password' id='password' placeholder="Introduzca su contraseña" />
                      </div>
                        <label className="forgot-password">
                            <a className='pink-text' href='#!'><b>Olvido su contraseña?</b></a>
                        </label>
                    </div>

                    <br />
                    <center>
                      <div className='row'>
                        <button type='submit' name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Ingresar</button>
                      </div>
                    </center>
                  </form>
                </div>
              </div>
            </center>
          </main>
        </div>
    }
}