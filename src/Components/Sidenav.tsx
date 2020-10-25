import React from "react";
import { IUserInfo } from "~/Classes/UserInfo";

interface ISidenavProps{
    user: IUserInfo
}

export class Sidenav extends React.Component<ISidenavProps>{

    constructor(props: ISidenavProps){
        super(props);
    }

    componentDidMount(){
        let elems = document.querySelectorAll(".sidenav");
        let collaps = document.querySelector('#side_collapse');
        
        if(elems){
            let dd = M.Sidenav.init(elems);    
            let ss = M.Collapsible.init(collaps);
        }
    }

    render(): JSX.Element{
        return <ul id="movile-sidenav" className="sidenav sidenav-fixed my-sidenav topnaved">
                <li>
                    <div className="user-view">
                        <div className="background">
                            <div className="user-background"></div>
                        </div>
                        <a href="#user"><div className="circle user-image"></div></a>
                        <a href="#name"><span className="white-text name">{this.props.user.name}</span></a>
                        <a href="#email"><span className="white-text email">{this.props.user.email}</span></a>
                    </div>
                </li>
                <li><a href="/menu" className="f_selectSection" id="home"><i className="material-icons">home</i>Inicio</a></li>
                <li><a href="/menu/reg-lorry" className="f_selectSection" id="registerLorry">Registrar jaula</a></li>
                <li><a href="/menu/work-heads" className="f_selectSection" id="workHeads">Trabajar cabezas</a></li>
                <li><a href="/menu/feed-corrals" className="f_selectSection" id="feedCorrals">Alimentar corrales</a></li>
                <li>
                    <div className="divider"></div>
                </li>

                <li className="no-padding">
                    <ul className="collapsible collapsible-accordion" id="side_collapse">
                        <li>
                        <a className="collapsible-header sidenav--collapsible"><i className="material-icons">add</i> Administración</a>
                        <div className="collapsible-body">
                            <ul>
                            <li><a href="/menu/drugs">Medicamentos</a></li>
                            <li><a href="/menu/protocols">Protocolos</a></li>
                            <li><a href="/menu/providers">Proveedores</a></li>
                            <li><a href="/menu/protocols">Corrales</a></li>
                            <li><a href="/menu/protocols">Lotes</a></li>
                            <li><a href="/menu/protocols">Raciones</a></li>
                            <li><a href="/menu/protocols">Insumos</a></li>
                            </ul>
                        </div>
                        </li>
                    </ul>
                </li>
            
                {/* <!-- 
                <li><a href="#!"><i class="material-icons">cloud</i>First Link With Icon</a></li>
                <li><a href="#!">Second Link</a></li>
                <li><a class="waves-effect" href="#!">Third Link With Waves</a></li> --> */}
            </ul>
    }
}