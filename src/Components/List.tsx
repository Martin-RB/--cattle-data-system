import React from "react";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";

export interface ListRow{
    id: string
    isSelected?: boolean,
    columns: Array<string | ListColInput>
}

export type ListColInput = {inputValue: string, type?: "text" | "number" | "password"};

interface ListProps{
    rows: Array<ListRow>;
    headers: Array<string>;
    selectable: boolean;
    editable: boolean;
    viewable: boolean;
    deletable: boolean;
    onAllSelected?: (isSelected: boolean) => void;
    onChange?: (id: string, arrIdx: number, value: string) => void;
    onItemSelected?: (id:string, isSelected: boolean) => void;
    onDeleteClicked?: (id: string) => void;
    onEditClicked?: (id: string) => void;
    onViewClicked?: (id: string) => void;
}

interface ListState{}

export class List extends React.Component<ListProps, ListState>{
    
    constructor(props: ListProps){
        super(props);
    }

    onAllSelected = () => {        
        this.props.onAllSelected?this.props.onAllSelected(!this.areAllSelected()):"";
    }

    private areAllSelected = () => {
        return this.props.rows.find((v) => !v.isSelected) == undefined
    }

    private onDelete = (id: string) => {
        this.props.onDeleteClicked?this.props.onDeleteClicked(id):"";
    }

    private onEdit = (id: string) => {
        this.props.onEditClicked?this.props.onEditClicked(id):"";
    }

    private onItemSelected = (id: string) => {
        let element = this.props.rows.find((e) => e.id == id)!;
        this.props.onItemSelected?this.props.onItemSelected(id, !element.isSelected):"";
    }

    private onItemChanged = (id: string, arrIdx: number, value: string) => {
        this.props.onChange?this.props.onChange(id, arrIdx, value):"";
    }
    private onView = (id: string) => {
        this.props.onViewClicked?this.props.onViewClicked(id):"";
    }

    render(){
        return <>
                <div className="myList">
                <div className="myList--head">
                    <div className="myList--row myList--row--rightMargin">
                        {this.props.selectable? <span className="myList--small-item">
                            <Checkbox indeterminated={true} checked={this.areAllSelected()} name="no" onChange={this.onAllSelected} value={"checkAll"}/>
                        </span>: null}
                        {this.props.headers.map((v) => <span className="myList--item" key={v}>{v}</span>)}
                        {this.props.deletable || this.props.editable?<span className="myList--small-item myList--small-item--verticalItems">
                            <i className="tiny material-icons icon">remove</i>
                        </span>:null}
                    </div>
                </div>
                <div className="myList--content">

                    {this.props.rows.map((v,i) => 
                            <div className="myList--row" key={i.toString()}>
                                {this.props.selectable? <span className="myList--small-item">
                                    <Checkbox 
                                        checked={v.isSelected != undefined && v.isSelected} 
                                        name={i.toString()} 
                                        onChange={() => this.onItemSelected(v.id)} 
                                        value={i.toString()}/>
                                </span>: null}

                                {v.columns.map((vv, ii) => {
                                    if(typeof vv == "string"){
                                        return <span className="myList--item" key={`${this.props.headers[ii]}_${i}`}>{vv}</span>;
                                    }
                                    else{
                                        return <Input type={vv.type} className="myList--item" key={`${this.props.headers[ii]}_${i}`} value={vv.inputValue} onChange={(_,val) => {this.onItemChanged(v.id, ii, val)}}/>;
                                    }
                                })}
                                {this.props.deletable || this.props.editable || this.props.viewable? <span className="myList--small-item myList--small-item--verticalItems">
                                    {this.props.deletable? <i className="tiny material-icons icon">remove</i>:null}
                                    {this.props.editable? <i className="tiny material-icons icon">edit</i>: null}
                                    {this.props.viewable? <i className="tiny material-icons icon" onClick={()=>this.onView(v.id)}>visibility</i>: null}
                                    
                                </span>: null}
                            </div>)}
                    
                </div>
        </div></>
    }
}