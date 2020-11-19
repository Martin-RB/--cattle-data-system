import React, { createContext } from "react";
import { List, ListRow } from "../Components/List";
import { MaterialInput } from "../Components/Input";
import { MaterialButton } from "../Components/Button";
import { IN_User } from "../Classes/DataStructures/User";
import { OUT_User } from "../Classes/DataStructures/User";
import { toast } from "../App";
import url from "./ConfigI";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { admonLogOut, isAdmonLoggedIn } from "./AdmonLogin";

interface IFieldedUser {
    users?: Array<string>
}
interface IUserProp extends RouteComponentProps{

}

interface UserAdminState{
    users: Array<IN_User>
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
            users: [],
            name : "",
            password : "",
            email : ""
        }
    }

    getUser = async() =>{
        try {
            const response = await fetch(url + "/admon/users", {
                method: 'GET', 
                mode: 'cors', 
                credentials: "include",
                cache: 'no-cache', 
                }); 
            let users = await response.json() as IN_User[]
            this.setState({
                users,
                email: "",
                name: "",
                password: ""
            })
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

    onItemSelected = (idx: string, isSelected: boolean) => {     
        let id = this.state.users[parseInt(idx)].id_user
        this.setEnability(id, isSelected);

    }

    accept = async() =>{

        let d : OUT_User = {name : this.state.name,email: this.state.email, password : this.state.password}
        if(d.name &&  d.email && d.password ){

            try {
                let response = await fetch(url + "/admon/users", {
                method: 'POST', 
                credentials: "include",
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

        await this.getUser()

    }

    logout = () => {
        admonLogOut()
        this.forceUpdate()
    }



    render():JSX.Element{

        if(!isAdmonLoggedIn()){
            return <Redirect to="/admon"/>
        }

        let users = this.state.users.map((v,i) => (
            {
                id: i.toString(), 
                columns: [v.name, v.email, ""],
                isSelected: v.isEnabled
        } as ListRow))

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
                <MaterialButton className="right" text="Cerrar Sesión" onClick={()=>this.logout()}/>
                </div>
            </div>
            </>
        );
    }

    setEnability = async (idUser: string, isEnabled: boolean) => {
        try {
            let response = await fetch(url + `/admon/users/${idUser}`, {
                method: 'PUT', 
                credentials: "include",
                body: JSON.stringify({isEnabled}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }); 
        } catch (error) {
            console.log(error)
        }

        await this.getUser()
    }

    addUser = async (user: OUT_User) => {
        try {
            let response = await fetch(url + `/admon/`, {
                method: 'POST', 
                credentials: "include",
                body: JSON.stringify(user),
                headers:{
                    'Content-Type': 'application/json'
                }
            }); 
            return response.ok
        } catch (error) {
            console.log(error)
        }
    }
}


