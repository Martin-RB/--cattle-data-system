import React from "react";
import { Link } from "react-router-dom";
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
                        <Link to="#user"><div className="circle user-image"></div></Link>
                        <Link to="#name"><span className="white-text name">{this.props.user.name}</span></Link>
                        <Link to="#email"><span className="white-text email">{this.props.user.email}</span></Link>
                    </div>
                </li>
                <li><a href="/menu" className="f_selectSection" id="home"><i className="material-icons">home</i>Inicio</a></li>
                <li><Link to="/menu/reg-lorry">AAAAAAAAAA</Link></li>
                <li><Link to="/menu/work-heads">BBBBBBBBBBB</Link></li>
                <li><Link to="/menu/reg-lorry" className="f_selectSection" id="registerLorry">Registrar jaula</Link></li>
                <li><Link to="/menu/work-heads" className="f_selectSection" id="workHeads">Trabajar cabezas</Link></li>
                <li><Link to="/menu/feed-corrals" className="f_selectSection" id="feedCorrals">Alimentar corrales</Link></li>
                <li>
                    <div className="divider"></div>
                </li>

                <li className="no-padding">
                    <ul className="collapsible collapsible-accordion" id="side_collapse">
                        <li>
                        <a className="collapsible-header sidenav--collapsible"><i className="material-icons">add</i> Configuraciones</a>
                        <div className="collapsible-body">
                            <ul>
                            <li><Link to="/menu/drugs">Medicamentos</Link></li>
                            <li><Link to="/menu/protocols">Protocolos</Link></li>
                            <li><Link to="/menu/providers">Proveedores</Link></li>
                            <li><Link to="/menu/corrals">Corrales</Link></li>
                            <li><Link to="/menu/lots">Lotes</Link></li>
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