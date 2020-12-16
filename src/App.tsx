// Cambios Daniel
import { render } from "react-dom";
import React, { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    RouteComponentProps,
    match,
    Redirect,
    BrowserRouter,
} from "react-router-dom";
import { History } from "history";
import { isLoggedIn, Login } from "./Screens/Login";
import { Menu } from "./Screens/Menu";
import { UserAdmin } from "./Screens/UserAdmin";
import M from "materialize-css";

import cookie from 'react-cookies';
import { AdmonLogin, isAdmonLoggedIn } from "./Screens/AdmonLogin";
import { LoadingScreen } from "./Components/LoadingScreen";
import { ServerComms } from "./Classes/ServerComms";

export var HISTORY: History;
export var MATCH: match;

export var historyRefresher = (r: RouteComponentProps, child: JSX.Element) => {
    HISTORY = r.history;
    MATCH = r.match;

    return child;
};

export function toast(message: string) {
    M.toast({ html: message });
}

ServerComms.isProduction = false;

type TLoadCallback = (toggle: boolean) => void
export let LoadingScreenWr = createContext<TLoadCallback>(()=>{});
LoadingScreenWr.displayName = "XD"

function App(){
    let [isLoading, changeLoading] = useState(false);
    return (
        <LoadingScreenWr.Provider value={changeLoading}>
        <BrowserRouter>
            <Switch>
                <Route
                    exact
                    path="/"
                    render={(a) => historyRefresher(a, <Redirect to="/login" />)}
                />
                <Route
                    exact
                    path="/login"
                    render={(a) => (<Login {...a}/>)}
                />
                <Route
                    exact
                    path="/admon"
                    render={(a) => <Redirect to="/admon/login"/>}
                />
                <Route
                    exact
                    path="/admon/login"
                    render={(a) => <AdmonLogin {...a}/>}
                />
                <Route
                    exact
                    path="/admon/platform"
                    render={(a) => 
                        isAdmonLoggedIn()?
                        <UserAdmin {...a}/>: <Redirect to="/admon/login"/>}
                        />
                <Route
                    path="/menu"
                    render={(a) => {
                        return (
                        isLoggedIn() ?
                        <Menu {...a}/>: <Redirect to="/login" /> 
                        )
                        
                    }}
                />
            </Switch>
            <LoadingScreen visible={isLoading}/>
        </BrowserRouter>
        </LoadingScreenWr.Provider>
    );
}
render(<App/>, document.getElementById("app"));
