import React from "react";
import { Input, MaterialInput } from "../Components/Input";
import { Button, MaterialButton } from "../Components/Button";
import { OUT_User } from "../Classes/DataStructures/User";
import { useHistory } from "react-router-dom";
import { HISTORY } from "../App";
import vaquita from "./../../img/vaquita.svg";
import url from "./ConfigI";


interface LoginProps{
  status :boolean
}

interface LoginRequest{
  email: string
  password : string
}

interface HashMap{
    [key: string]: string
}

interface LoginState{
    fields: HashMap
    name : string
    password : string
}

enum LoginFields{
    username = "username",
    password = "password"
}

export class Login extends React.Component<LoginProps, LoginState>{


    

    constructor(props: LoginProps){
        super(props);
        this.state = {
            fields: {},
            name : "",
            password : "",
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
    }

    onSubmit : () => void = async() =>{
      var access : Response
      let newurl = "https://aadd3a6e-85ac-4ed5-8a34-b6b26ff2e442.mock.pstmn.io"
      let d : LoginRequest = {email : this.state.name, password : this.state.password } 
          try {
            const response = await fetch(newurl + "/login", {
            method: 'POST', 
            body: JSON.stringify(d),
            headers:{
                'Content-Type': 'application/json'
            }
            }); 
            access = await response
          } catch (error) {
            console.log(error)
          }

  
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
              <img className="responsive-img" width="210px" src={vaquita} />

              <h5 className="indigo-text">Introduzca sus credenciales</h5>

              <div className="container">
                <div className="z-depth-1 grey lighten-4 row contenedor" >

                    <form className="col s12" method="post">
                      

                      <div className='row'>
                        <div className='input-field col s12'>
                          <MaterialInput className='validate' type='text' onChange={(_,name) => this.setState({name})} value={this.state.name} placeholder="Introduzca su email" />
                        </div>
                      </div>

                      <div className='row'>
                        <div className='input-field col s12'>
                          <MaterialInput className='validate'  type='password'  onChange={(_,password) => this.setState({password})} value={this.state.password} placeholder="Introduzca su contraseña" />
                        </div>
                      </div>

                      <br/>
                      <center>
                        <div className='row'>
                          <MaterialButton text="Ingresar" onClick={() => {this.onSubmit()}} className='col s12 btn btn-large waves-effect indigo'/>
                        </div>
                      </center>
                 
                    </form>
                </div>
              </div>
            <div className="section"></div>

            </center>
          </main>
        </div>
    }
}





