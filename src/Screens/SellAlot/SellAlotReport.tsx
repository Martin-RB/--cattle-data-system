import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { IProvider } from "../../Classes/DataStructures/Provider";

import * as faker from "faker";
import * as Factory from "../../../node_modules/factory.ts/lib/sync";


export interface ReportData{
    alotName: string
    corralName: string
    headsSold: number
    headsTotal: number
    fedKg: number
    fedCost: number
    providers: Array<HeadedProvider>
    priceStand: number
    priceTotal: number
    sellTotal: number
}

export type HeadedProvider = {
    provider: IProvider,
    headNumber: number
}

export class SellAlotReport extends React.Component<RouteComponentProps>{
    render():JSX.Element{
        let {location, history} = this.props;
        let report = location.state as ReportData;

        //Random data gen
        let provFactory = Factory.makeFactory<IProvider>({
            name: Factory.each(i=>faker.name.firstName())
        })
        let heaProFac = Factory.makeFactory<HeadedProvider>({
            provider: Factory.each(i=>provFactory.build()),
            headNumber: Factory.each(i=>faker.random.number(20))
        })
        let reportFac = Factory.makeFactory<ReportData>({
            alotName: Factory.each(i=>faker.random.alphaNumeric(4)),
            corralName: Factory.each(i=>faker.random.alphaNumeric(4)),
            fedCost: Factory.each(i=>faker.random.number(9999)),
            fedKg: Factory.each(i=>faker.random.number(999)),
            headsSold: Factory.each(i=>faker.random.number(99)),
            headsTotal: 100,
            providers: heaProFac.buildList(5),
            priceStand: Factory.each(i=>faker.random.number(999999)),
            priceTotal: Factory.each(i=>faker.random.number(999999)),
            sellTotal: Factory.each(i=>faker.random.number(999999)),
        })
        report = reportFac.build();
        // End random data gen

        return (
            <>
            <h2>Reporte de cabezas vendidas</h2>
            <div className="row">
                <div className="col s12">
                    <div className="divider"/>
                    <div className="section">
                        <h5>Detalles de cabezas</h5>
                        <div className="c-table">
                            <div className="row c-table--header-row">
                                <div className="col s8">
                                    Detalles
                                </div>
                                <div className="col s4">
                                    Precio
                                </div>
                            </div>
                            <div className="row c-table--row">
                                <div className="col s8">
                                    <ul>
                                        <li>Lote: <span>{report.alotName}</span></li>
                                        <li>Corral: <span>{report.corralName}</span></li>
                                        <li>Cabezas vendidas: <span>{report.headsSold}</span> / <span>{report.headsTotal}</span></li>
                                    </ul>
                                </div>
                                <div className="col s4">${report.fedCost}</div>
                            </div>
                            <div className="row c-table--footer-row">
                                <div className="col s8">
                                    Precio de pie
                                </div>
                                <div className="col s4">
                                    ${report.priceStand}
                                </div>
                                <div className="col s8">
                                    Precio final
                                </div>
                                <div className="col s4">
                                    ${report.priceTotal}
                                </div>
                            </div>
                        </div>
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
                                <div className="col s8"><span>{report.fedKg}</span> kg.</div>
                                <div className="col s4">${report.fedCost}</div>
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
                                    Num. cabezas surtidas
                                </div>
                            </div>
                            {
                                report.providers.map((v,i) => 
                                <div className="row c-table--row" key={i.toString()}>
                                    <div className="col s8"><span>{v.provider.name}</span></div>
                                    <div className="col s4">{v.headNumber}</div>
                                </div>)
                            }
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="section">
                        <div className="row row--padding grey lighten-1">
                            <div className="col s8">Total</div>
                            <div className="col s4">${report.sellTotal}</div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}