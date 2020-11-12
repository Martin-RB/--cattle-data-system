import React, { createContext } from "react";
import { List, ListRow } from "../Components/List";
import { MaterialInput } from "../Components/Input";
import { MaterialButton } from "../Components/Button";
import { IN_User } from "../Classes/DataStructures/User";
import { OUT_User } from "../Classes/DataStructures/User";
import { toast } from "../App";
import url from "./ConfigI";

interface IFieldedUser {
    users?: Array<string>
}
interface IUserProp {

}

interface UserAdminState{
    users: Array<IN_User>
    selectedUser: Array<Number>
    name : string
    email : string
    password : string
}

enum Fields {
    NAME="name",
    EMAIL="email",
    PASSWORD="password"
}


export class UserAdmin extends React.Component<IUserProp, UserAdminState>{
    headers: Array<string>;

    constructor(props: IUserProp){
        super(props)
        this.headers = ["Nombre","Email"]
        this.state = {
            users: [{id_user:"1", name: "Usuario 1", email: "newmail@mail.com"},{id_user:"2", name: "Usuario 2", email: "newmail2@mail.com"}],
            name : "",
            password : "",
            email : "",
            selectedUser: [1, 2, 3],
        }
    }

    getUser: ( ) => void = async() =>{
        try {
            const response = await fetch(url + "/admon", {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            }); 
        let users = await response.json()
        this.setState(users)
        } catch (error) {
           return error
        }

    }

    componentDidMount(){
        this.getUser()
           
    }

    onItemChange = (id: string, arrIdx: number, value: string) => {
        
    }

    onAllSelected = (isSelected: boolean) => {
        
    }

    onItemSelected = (id: string, isSelected: boolean) => {        
        
    }

    accept: ( ) => void = async() =>{

        let d : OUT_User = {name : this.state.name,email: this.state.email, password : this.state.password}
          if(d.name &&  d.email && d.password ){

            try {
                fetch(url + "/admon", {
                method: 'POST', 
                body: JSON.stringify(d),
                headers:{
                    'Content-Type': 'application/json'
                }
                }); 
            } catch (error) {
                console.log(error)
            }
        } else {
            toast("Ingresa todos los campos")
        }

    }



    render():JSX.Element{
        console.log(this.state.users)
        let users = this.state.users.map((v,i) => ({id: i.toString(), columns: [v.name, v.email, ""]} as ListRow))

        return (
            <>
            <div className="container"> 
            <h4 className="indigo-text">Administración</h4>
            <div className="z-depth-1 grey lighten-4 row " >
                
                <div className="row">
                    
                    <div className="col s12 l6">
                    <div>
                    <h6>Registrar nuevo usuario</h6>
                <br></br>
                <MaterialInput placeholder="Nombre" name={Fields.NAME} onChange={(_,name) => this.setState({name})}  value={this.state.name}/>
                <MaterialInput placeholder="Correo" name={Fields.EMAIL} onChange={(_,email) => this.setState({email})} value={this.state.email}/>
                <MaterialInput placeholder="Contraseña" name={Fields.PASSWORD} onChange={(_,password) => this.setState({password})} value={this.state.password}/>
                <MaterialButton className="left " text="Registrar" onClick={()=>this.accept()}/>
            </div>
                    </div>
                    <div className="col s12 l6">
                        <h6>Usuarios registrados</h6>
                        <List 
                                deletable={false}
                                editable={false}
                                selectable={true}
                                headers={this.headers}
                                rows={users}
                                onChange={this.onItemChange}
                                onAllSelected={this.onAllSelected}
                                onItemSelected={this.onItemSelected}
                                />
                    </div>
                </div>  
                </div>
            </div>
            </>
        );
    }
}


