import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { HISTORY } from "../../App";
import { SellAlotList } from "./SellAlotList";
import { SellAlotReport } from "./SellAlotReport";

export class SellAlotRoute extends React.Component{
    getRouteProps = () => {
        return (this.props as RouteComponentProps);
    }
    render():JSX.Element{        
        let path = this.getRouteProps().match.url
        console.log(path);

        return (
            <>
            <Switch>
                <Route path={`${path}/report`} render={(a) => <SellAlotReport {...a}/>}/>
                <Route path={`${path}`} render={(a) => <SellAlotList {...a}/>}/>
            </Switch>
            </>
        )
    }
}