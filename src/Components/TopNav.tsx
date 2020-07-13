import React from "react";
import { TodoWork } from "../Classes/TodoWork";
import M from "materialize-css";
import { DropDown } from "./DropDown";
import { IRoutable } from "~/Classes/IRoutable";

interface TopNavProps{
    onLogout: () => void;
    todos: Array<TodoWork>;
    logo: JSX.Element
}

export class TopNav extends React.Component<TopNavProps>{

    private todoWorks: Array<TodoWork>;
    private MTodos: Array<IRoutable>;

    constructor(props: TopNavProps){
        super(props);
        
        this.todoWorks = props.todos;
        this.MTodos = this.convertToMappable(this.todoWorks);
    }

    componentDidMount(){
        let elems = document.querySelectorAll('.dropdown-trigger');
        console.log(elems);
        
        if(elems){
            let dd = M.Dropdown.init(elems);
        }
    }

    render(){
        return <>
        <nav className="nav-main">
            <div className="nav-wrapper top--nav--color">
                <ul className="left">
                    <li><a href="#" data-target="movile-sidenav" className="sidenav-trigger"><i className="material-icons">dehaze</i></a></li>
                </ul>
                {this.props.logo}
                <ul className="right">
                    <li><DropDown content={this.MTodos} text={"Mis tareas"} numIndicator={true} /></li>
                    <li><a className="black-text" href="#" id="close-session" onClick={() => this.props.onLogout()}><i className="right material-icons">settings_power</i></a></li>
                </ul>
            </div>
        </nav>
        </>
    }

    convertToMappable(arr: Array<TodoWork>): Array<IRoutable>{
        let newArr: Array<IRoutable> = [];
        arr.forEach((e,i) => {
            newArr.push({key: i.toString(), name: e.text, route: e.route});
        });
        return newArr;
    }
}