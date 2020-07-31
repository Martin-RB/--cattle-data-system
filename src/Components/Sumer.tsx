import React from "react";
import { List, ListRow } from "./List";

export interface SumerProps{
    headers: Array<string>;
    rows: Array<Array<string>>;
    colTarget: number;
    resultText: string;
}

export class Sumer extends React.Component<SumerProps>{

    private doSum = () =>{
        let sum = 0;
        this.props.rows.forEach((c) => {
            let col = c[this.props.colTarget];
            sum += parseFloat(col);
        });
        return sum;
    }

    private getRows = () => {
        return this.props.rows.map((v,i) => ({id:i.toString(), columns: v} as ListRow))
    }

    render():JSX.Element{
        return <>
                    <List 
                        deletable={false}
                        editable={false}
                        selectable={false}
                        headers={this.props.headers}
                        rows={this.getRows()}/>
                    <p>{this.props.resultText}: {this.doSum()}</p>
                </>
    }
}