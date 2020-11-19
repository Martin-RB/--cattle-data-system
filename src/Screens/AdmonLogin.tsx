import React from "react";
import { Input, MaterialInput } from "../Components/Input";
import { Button, MaterialButton } from "../Components/Button";
import { OUT_User , IN_User } from "../Classes/DataStructures/User";
import { Redirect, RouteComponentProps, useHistory } from "react-router-dom";
import vaquita from "./../../img/vaquita.svg";
import url from "./ConfigI";
import { toast } from "../App";
import cookie from 'react-cookies';

interface AdmonLoginProps extends RouteComponentProps{

}

interface LoginRequest{
  name: string
  password : string
}

interface HashMap{
    [key: string]: string
}

interface AdmonLoginState{
    fields: HashMap
    name : string
    password : string
    access :  IN_User

}

enum LoginFields{
    username = "username",
    password = "password"
}

export class AdmonLogin extends React.Component<AdmonLoginProps, AdmonLoginState>{

    constructor(props: AdmonLoginProps){
        super(props);
        this.state = {
            fields: {},
            name : "",
            password : "",
            access : {id_user : "", name : "" , email : "" }
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onInputChanged = this.onInputChanged.bind(this);
    }

    varsetCookie : (usr: IN_User) => void = (usr) =>{
      let expires = new Date();
      expires.setTime(expires.getTime() + (20*60*1000))
      cookie.save('id_users', usr.id_user , {path:'/', expires})
      cookie.save('name', usr.name , {path:'/', expires})
      cookie.save('email', usr.email , {path:'/', expires})
    }

    onSubmit : () => void = async() =>{
      console.log("sub");
      
      let d : LoginRequest = {
        name : this.state.name, 
        password : this.state.password } 
      let result = false;
      try {
        let newurl = "https://aadd3a6e-85ac-4ed5-8a34-b6b26ff2e442.mock.pstmn.io"
        const response = await fetch(url + "/admon/login", {
          method: 'POST', 
          credentials: "include",
          body: JSON.stringify(d),
          headers:{
              'Content-Type': 'application/json',
          }
        }); 
        result = response.status == 200;
      } 
      catch (error) {
        console.log(error)
      }

      if(result){
        console.log(this.props.match.url);
        
        this.props.history.push({
            pathname: "/admon/platform"
        })
      } else {
        toast("Credenciales incorrectas")
      }

    }
   
    onInputChanged(name: string, text: string){
        let fields = this.state.fields;
        fields[name] = text;

        this.setState({
            fields
        })
    }

    render(): JSX.Element{

        if(isAdmonLoggedIn()){
          return <Redirect to="/admon/platform"/>
        }
        
        return <div className="login--background">
          
        <div className="section"></div>
          <main>
            <center>
                <h3>Administración</h3>
              <img className="responsive-img" width="210px" src={vaquita} />

              <h5 className="indigo-text">Introduzca sus credenciales de administrador</h5>

              <div className="container">
                <div className="z-depth-1 grey lighten-4 row contenedor" >

                    <form className="col s12" onSubmit={(e)=>{e.preventDefault(); this.onSubmit()}}>
                      

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



export function isAdmonLoggedIn(){
  return cookie.load("idUserAdmon") != undefined
}

export function admonLogOut(){
  cookie.remove("idUserAdmon", {path: "/"})
  cookie.remove("isAdmon", {path: "/"})
  cookie.remove("nameAdmon", {path: "/"})
  cookie.remove("businessNameAdmon", {path: "/"})
  cookie.remove("emailAdmon", {path: "/"})
}