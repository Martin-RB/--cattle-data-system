import React from "react";
import { Input } from "./Input";
import { MaterialButton } from "./Button";
import { Button, Checkbox, Icon } from "../../node_modules/react-materialize/lib/index";
import { v4 as uuid } from 'uuid';

/* import * as Checkbots from "./Checkbox"; */

export interface ListRow{
    isSelected?: boolean,
    columns: Array<string | ListColInput>
    styleClass?:string
}

export type ListColInput = {inputValue: string, type?: "text" | "number" | "password" | "button"};

interface ListProps{
    rows: Array<ListRow>;
    headers: Array<string>;
    selectable?: boolean;
    editable?: boolean;
    viewable?: boolean;
    deletable?: boolean;
    onAllSelected?: (isSelected: boolean) => void;
    onChange?: (idx: number, columnIndex: number, value: string) => void;
    onItemSelected?: (idx:number, isSelected: boolean) => void;
    onDeleteClicked?: (idx: number) => void;
    onEditClicked?: (idx: number) => void;
    onViewClicked?: (idx: number) => void;
    onButtonClicked?: (idx: number, columnIndex: number) => void;
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

    private onDelete = (idx: number) => {
        this.props.onDeleteClicked?this.props.onDeleteClicked(idx):null;
    }

    private onEdit = (idx: number) => {
        this.props.onEditClicked?this.props.onEditClicked(idx):null;
    }

    private onItemSelected = (idx: number) => {
        let element = this.props.rows[idx];
        this.props.onItemSelected?this.props.onItemSelected(idx, !element.isSelected):"";
    }

    private onItemChanged = (idx: number, arrIdx: number, value: string) => {
        this.props.onChange?this.props.onChange(idx, arrIdx, value):null;
    }
    private onView = (idx: number) => {
        this.props.onViewClicked?this.props.onViewClicked(idx):null;
    }
    private onButtonClicked = (idx: number, columnIndex: number) => {
        this.props.onButtonClicked?this.props.onButtonClicked(idx, columnIndex):null;
    }

    render(){
        return <>
                <div className="myList">
                <div className="myList--head">
                    <div className="myList--row myList--row--rightMargin">
                        {this.props.selectable? <span className="myList--small-item">
                            <Checkbox label="" 
                                    filledIn 
                                    id={uuid()}
                                    indeterminate
                                    checked={this.areAllSelected()} 
                                    onChange={this.onAllSelected} 
                                    value={"checkAll"}/>
                        </span>: null}
                        {this.props.headers.map((v) => <span className="myList--item" key={v}>{v}</span>)}
                        {this.props.viewable? <div className="myList--small-item">
                            <Icon className="icon">visibility</Icon>
                        </div>:null}
                        {this.props.editable?<div className="myList--small-item">
                            <Icon className="icon">edit</Icon>
                        </div>:null}
                        {this.props.deletable? <div className="myList--small-item">
                            <Icon className="icon">remove</Icon>
                        </div>:null}
                    </div>
                </div>
                <div className="myList--content">

                    {this.props.rows.map((v,i) => 
                            <div className={`myList--row ${v.styleClass}`} key={i.toString()}>
                                {this.props.selectable? <span className="myList--small-item">
                                    <Checkbox 
                                        filledIn
                                        id={uuid()}
                                        checked={v.isSelected != undefined && v.isSelected} 
                                        onChange={(e) => {
                                            console.log(e)
                                            this.onItemSelected(i)}
                                        }
                                        value={i.toString()}
                                        label=""/>
                                </span>: null}

                                {v.columns.map((cv, ci) => {
                                    if(typeof cv == "string"){
                                        return <span className="myList--item" key={`${this.props.headers[ci]}_${i}`}>{cv}</span>;
                                    }
                                    else if(cv.type == "button"){
                                        return <div className="myList--item" key={`${this.props.headers[ci]}_${i}`}>
                                            <MaterialButton className="button--small" text={cv.inputValue} onClick={()=>this.onButtonClicked(i, ci)}/>
                                        </div>
                                    }
                                    else{
                                        return <Input type={cv.type} className="myList--item" key={`${this.props.headers[ci]}_${i}`} value={cv.inputValue} onChange={(_,val) => {this.onItemChanged(i, ci, val)}}/>;
                                    }
                                })}
                                {
                                    this.props.viewable? 
                                    <div className="myList--small-item" onClick={()=>this.onView(i)}>
                                        <Icon className="icon">visibility</Icon>
                                    </div>
                                    :null
                                }
                                {
                                    this.props.editable?
                                    <div className="myList--small-item" onClick={()=>this.onEdit(i)}> <Icon className="icon">edit</Icon></div>: 
                                    null
                                }
                                {this.props.deletable? <div className="myList--small-item" onClick={()=>this.onDelete(i)}><Icon className="icon">remove</Icon></div>:null}
                                
                            </div>)}
                    
                </div>
        </div></>
    }
}