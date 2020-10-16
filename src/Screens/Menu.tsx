import React from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import { Info } from "./Info";
import { MATCH, historyRefresher, HISTORY } from "../App";
import { Login } from "./Login";
import { Button, MaterialButton } from "../Components/Button";
import { TopNav } from "../Components/TopNav";
import image from "./../../img/logo.png";
import { TodoWork } from "../Classes/TodoWork";
import { Sidenav } from "./../Components/Sidenav";
import { ElementSample } from "./config/ElementSample";
import { Drugs } from "./config/Drugs";
import { Protocols } from "./config/Protocols";
import { Providers } from "./config/Providers";

interface MenuProps{

}

enum SIDE_OPT {
    info = "info",
    home = "home",
    login = "login"
}

export class Menu extends React.Component<MenuProps>{

    constructor(props: MenuProps){
        super(props);

        this.routeTo = this.routeTo.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    routeTo(sideOpt: SIDE_OPT){

        switch(sideOpt){
            case SIDE_OPT.info:
                HISTORY.push(`${MATCH.url}/${sideOpt}`);
                break;
        }
    }

    onLogout(){
        HISTORY.push("/login");
    }


    render() {

        let {path, url} = MATCH;
        
        return <div style={{height: "100vh"}}>

        <TopNav todos={[new TodoWork("Faltan corrales por alimentar", "menu/info")]} 
            logo={
                <a className="brand-logo top-nav--logo-a--sizing">
                    <img src={image} className="top-nav--logo-img--sizing"/>
                </a>} 
            onLogout={this.onLogout}/>

        <div className="menu--container topnaved">
            {/* <div className="menu--side">
                <MaterialButton text="Ver información" onClick={() => this.routeTo(SIDE_OPT.info)}/>
            </div> */}

            <Sidenav user={{email: "martin.riv.ben@hotmail.com", name: "Martín Rivas"}}/>
            
            <div className="sidenaved">
                <Switch>
                    <Route path={`${path}/${SIDE_OPT.info}`} render={(a) => historyRefresher(a, <Info/>)}/>
                    <Route path={`${path}/reg-lorry`} render={(a) => historyRefresher(a, <Login/>)}/>
                    <Route path={`${path}/work-heads`} render={(a) => historyRefresher(a, <Login/>)}/>
                    <Route path={`${path}/feed-corrals`} render={(a) => historyRefresher(a, <Login/>)}/>
                    <Route path={`${path}/drugs`} render={(a) => historyRefresher(a, <Drugs/>)}/>
                    <Route path={`${path}/protocols`} render={(a) => historyRefresher(a, <Protocols/>)}/>
                    <Route path={`${path}/providers`} render={(a) => historyRefresher(a, <Providers/>)}/>
                </Switch>
            </div>
        </div>
        </div>
    }
}