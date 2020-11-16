import React from "react";
import { Switch, Route, useRouteMatch, Link, Redirect, RouteComponentProps } from "react-router-dom";
import { Info } from "./Info";
import { MATCH, historyRefresher, HISTORY } from "../App";
import { Login, logOut } from "./Login";
import { Button, MaterialButton } from "../Components/Button";
import { TopNav } from "../Components/TopNav";
import image from "./../../img/logo.png";
import { TodoWork } from "../Classes/TodoWork";
import { Sidenav } from "./../Components/Sidenav";
import { ElementSample } from "./config/ElementSample";
import { Drugs } from "./config/Drugs";
import { Protocols } from "./config/Protocols";
import { Providers } from "./config/Providers";
import { Home } from "./Home";
import { SellAlotRoute } from "./SellAlot/SellAlotRoute";
import { Corrals } from "./config/Corrals";
import { Lots } from "./config/Lots";
import { LorryRegister } from "./LorryRegister";
import { RegisterHeads } from "./RegisterHeads";
import { FeedCorrals } from "./FeedCorrals";
import cookie from 'react-cookies';

interface MenuProps extends RouteComponentProps{

}

interface MenuState{
    name: string,
    email : string
}

enum SIDE_OPT {
    info = "info",
    home = "home",
    login = "login"
}

export class Menu extends React.Component<MenuProps, MenuState>{

    constructor(props: MenuProps){
        super(props);
        this.state = {
            name: "",
            email: ""
        }

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
        logOut();
        this.props.history.replace("/login")
    }

    componentDidMount(){
        this.setState({name:cookie.load("name"), email:cookie.load("email") })
    }
    
    render() {    
        let path = this.props.match.path
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
            <Sidenav user={{email: this.state.email, name: this.state.name}}/>
            

            <div className="sidenaved">
                <Switch>
                    <Route path={`${path}/reg-lorry`} component={LorryRegister}/>
                    <Route path={`${path}/work-heads`} render={(a) => historyRefresher(a, <RegisterHeads/>)}/>
                    <Route path={`${path}/feed-corrals`} render={(a) => historyRefresher(a, <FeedCorrals/>)}/>
                    <Route path={`${path}/sell-alot`} render={(props) => <SellAlotRoute {...props}/>}/>
                    <Route path={`${path}/drugs`} render={(a) => historyRefresher(a, <Drugs/>)}/>
                    <Route path={`${path}/protocols`} render={(a) => historyRefresher(a, <Protocols/>)}/>
                    <Route path={`${path}/providers`} render={(a) => historyRefresher(a, <Providers/>)}/>
                    <Route path={`${path}/corrals`} render={(a) => historyRefresher(a, <Corrals/>)}/>
                    <Route path={`${path}/lots`} render={(a) => historyRefresher(a, <Lots/>)}/>
                    <Route component={Home}/>
                </Switch>
            </div>
        </div>
        </div>
    }
}