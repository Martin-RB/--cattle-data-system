import React, { createContext } from "react";
import { Switch, Route, useRouteMatch, Link, Redirect, RouteComponentProps } from "react-router-dom";
import { Info } from "./Info";
import { MATCH, historyRefresher, HISTORY, LOCATION } from "../App";
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
import { WorkHeads } from "./WorkHeads";
import { FeedCorrals } from "./FeedCorrals";
import cookie from 'react-cookies';

export interface GlobalState{
    screenState?: ScreenState
}

interface MenuProps extends RouteComponentProps{

}

interface MenuState{
    name: string,
    email : string,
    screenStates : ScreensStates
}

enum SIDE_OPT {
    info = "info",
    home = "home",
    login = "login"
}

class ScreenState {
    private _invokeChange;
    constructor(invokeChange: ()=>void){
        this._invokeChange = invokeChange
    }
    private _hasSavedState: boolean = false
    private _state: any = undefined
    get hasSavedState(){
        return this._hasSavedState
    }
    get state(){
        return this._state
    }
    set state(v: any){
        if(v == undefined){
            this.eraseState()
        }
        else{
            this._hasSavedState = true
            this._state = v
        }
        this._invokeChange()
    }
    eraseState(){
        this._hasSavedState = false
        this._state = undefined
    }
}

interface ScreensStates{
    LorryRegister: ScreenState
    WorkHeads: ScreenState
    FeedCorrals: ScreenState
    SellAlotRoute: ScreenState
    Drugs: ScreenState
    Protocols: ScreenState
    Providers: ScreenState
    Corrals: ScreenState
    Lots: ScreenState
    Home: ScreenState

}

export class Menu extends React.Component<MenuProps, MenuState>{

    constructor(props: MenuProps){
        super(props);
        this.state = {
            name: "",
            email: "",
            screenStates: this.initializeScreenStateObj()
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
            <Sidenav user={{email: cookie.load("email"), name: cookie.load("name")}}/>
            {
                LorryRegister.contextType
            }

            <div className="sidenaved">
                
                <Switch>
                    <Route path={`${path}/reg-lorry`} render={(a) =>
                        <LorryRegister {...{...a, screenState: this.state.screenStates.LorryRegister}}/>}/>
                    <Route path={`${path}/work-heads`} render={(a) =>
                        <WorkHeads {...{...a, screenState: this.state.screenStates.WorkHeads}}/>}/>
                    <Route path={`${path}/feed-corrals`} render={(a) =>
                        <FeedCorrals {...{...a, screenState: this.state.screenStates.FeedCorrals}}/>}/>
                    <Route path={`${path}/sell-alot`} render={(a) =>
                        <SellAlotRoute {...{...a, screenState: this.state.screenStates.SellAlotRoute}}/>}/>
                    <Route path={`${path}/drugs`} render={(a) =>
                        <Drugs {...{...a, screenState: this.state.screenStates.Drugs}}/>}/>
                    <Route path={`${path}/protocols`} render={(a)=>
                        <Protocols {...{...a, screenState: this.state.screenStates.Protocols}}/>}/>
                    <Route path={`${path}/providers`} render={(a) =>
                        <Providers {...{...a, screenState: this.state.screenStates.Providers}}/>}/>
                    <Route path={`${path}/corrals`} render={(a) =>
                        <Corrals {...{...a, screenState: this.state.screenStates.Corrals}}/>}/>
                    <Route path={`${path}/lots`} render={(a) =>
                        <Lots {...{...a, screenState: this.state.screenStates.Lots}}/>}/>
                    <Route render={(a) =>
                        <Home {...{...a, screenState: this.state.screenStates.Home}}/>}/>
                </Switch>
            </div>
        </div>
        </div>
    }

    initializeScreenStateObj(){
        let change = () => {
            this.forceUpdate()
        }
        return {
            LorryRegister: new ScreenState(change),
            WorkHeads: new ScreenState(change),
            FeedCorrals: new ScreenState(change),
            SellAlotRoute: new ScreenState(change),
            Drugs: new ScreenState(change),
            Protocols: new ScreenState(change),
            Providers: new ScreenState(change),
            Corrals: new ScreenState(change),
            Lots: new ScreenState(change),
            Home: new ScreenState(change),
        } as ScreensStates
    }
}