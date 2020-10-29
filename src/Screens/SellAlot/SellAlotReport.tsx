import React from "react";

export class SellAlotReport extends React.Component{
    render():JSX.Element{
        return (
            <>
            <h2>Reporte de cabezas vendidas</h2>
            <div className="row">
                <div className="col s12">
                    <div className="section">
                        <h5>Descripción de cabezas</h5>
                        <ul>
                            <li>Lote: <span>35A</span></li>
                            <li>Corral: <span>33F</span></li>
                            <li>Cabezas vendidas: <span>45</span> / <span>100</span></li>
                        </ul>
                    </div>
                    <div className="divider"/>
                    <div className="section">
                        <h5>Detalles de alimentación</h5>
                        <div className="c-table">
                            <div className="row c-table--header-row">
                                <div className="col s8">
                                    Kilogramos surtidos
                                </div>
                                <div className="col s4">
                                    Costo
                                </div>
                            </div>
                            <div className="row c-table--row">
                                <div className="col s8"><span>34</span> kg.</div>
                                <div className="col s4">$34</div>
                            </div>
                            <div className="row c-table--row">
                                <div className="col s8"><span>34</span> kg.</div>
                                <div className="col s4">$34</div>
                            </div>
                            <div className="row c-table--row">
                                <div className="col s8"><span>34</span> kg.</div>
                                <div className="col s4">$34</div>
                            </div>
                            <div className="row c-table--footer-row">
                                <div className="col s8">Total</div>
                                <div className="col s4">$80</div>
                            </div>
                        </div>
                    </div>
                    <div className="divider"/>
                    <div className="section">
                        <h5>Proveedores</h5>
                        <div className="c-table">
                            <div className="row c-table--header-row">
                                <div className="col s8">
                                    Nombre del proveedor
                                </div>
                                <div className="col s4">
                                    Costo
                                </div>
                            </div>
                            <div className="row c-table--row">
                                <div className="col s8"><span>34</span> kg.</div>
                                <div className="col s4">$34</div>
                            </div>
                            <div className="row c-table--row">
                                <div className="col s8"><span>34</span> kg.</div>
                                <div className="col s4">$34</div>
                            </div>
                            <div className="row c-table--row">
                                <div className="col s8"><span>34</span> kg.</div>
                                <div className="col s4">$34</div>
                            </div>
                            <div className="row c-table--footer-row">
                                <div className="col s8">Total</div>
                                <div className="col s4">$80</div>
                            </div>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="section">
                        <div className="row row--padding grey lighten-1">
                            <div className="col s8">Total</div>
                            <div className="col s4">$999</div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}