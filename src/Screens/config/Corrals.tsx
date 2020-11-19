import React from "react";
import { ElementSample, IState } from "./ElementSample";
import { Input } from "../../Components/Input";
import { toast } from "../../App";
import { IOption } from "../../Classes/IOption";
import { Radio } from "../../Components/Radio";
import { Modal, ModalData, ModalExitOptions } from "../../Components/Modal";
import url from "../ConfigI";
import { IN_Corral, OUT_Corral } from "../../Classes/DataStructures/Corral";

export interface IFieldedCorral{
    id?: string
    name?: string
    headNum?: string
}

interface ICorralsProps{

}

// State / props
interface ICorralsState{
    fStt: IState;
    items: Array<IN_Corral>;
    item: IFieldedCorral;
    wrongFields: Array<Fields>;
    lockedFields: Array<Fields>;
    selectedItem: string;
    modalData: ModalData | null;
}
// Functional interfaces
interface IEditableState{
    setStt(stt: any): void;
    getStt(): ICorralsState;
}
interface ICheckableFields{
    isAllFilled(): boolean;
    setWrongFields(fields: Array<Fields>): void;
}

export class Corrals extends React.Component<ICorralsProps, ICorralsState> implements IEditableState, ICheckableFields{

    constructor(props: ICorralsProps){
        super(props);

        this.state = {
            fStt: new GatherState(this),
            wrongFields: [],
            lockedFields: [],
            items: [],
            item: {},
            selectedItem: "-1",
            modalData: null
        }

        this.onContentChange = this.onContentChange.bind(this);
    }

    isAllFilled(): boolean {
        return this.state.item?.name != undefined;
    }
    setWrongFields(fields: Fields[]): void {
        throw new Error("Method not implemented.");
    }

    componentDidMount(){
        this.gather();
    }

    async gather(){
        let srv = CorralsSrv.getInstance();
        this.onGather(await srv.get());
    }

    onGather = (data: Array<IN_Corral>) =>{
        this.setState({
            fStt: new WaitingState(this),
            items: data
        })
    }

    onContentChange(newValue: IFieldedCorral){        
        this.setState({
            item: newValue
        });
    }

    setStt = (stt: any) => {
        this.setState(stt)
    }
    getStt = () => {
        return this.state;
    };

    render(): JSX.Element{        
        return <>
            <ElementSample  
                        title="Corrales"
                        state={this.state.fStt}
                        showContent={this.state.fStt.showContent()}
                        items={this.fromItemToOption(this.state.items)}
                        selectedItem={this.state.selectedItem}
                        selectionPlaceholder="Corrales">
                <CorralsContent 
                            value={this.state.item} 
                            onChange={this.onContentChange}
                            lockedFields={[]}
                            badFields={[]}/>
            </ElementSample>
            {this.state.modalData != null? <Modal data={this.state.modalData}/>:null}
        </>
    }

    private fromItemToOption(items: Array<IN_Corral>){
        let options = new Array<IOption>();
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            options.push({key: el.id!, name: el.name})
        }
        return options;
    }
}

class GatherState implements IState{
    constructor(context: IEditableState & ICheckableFields){
        this.onItemAdd = this.onItemAdd.bind(this);
        this.onItemRemove = this.onItemRemove.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
        this.onAccept = this.onAccept.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }
    onItemAdd(): void {
        toast("Obteniendo datos");
    }
    onItemRemove(): void {
        toast("Obteniendo datos");
    }
    onItemSelected(idx: string): boolean {
        toast("Obteniendo datos");
        return false;
    }
    onAccept(): void {
        toast("Obteniendo datos");
    }
    onCancel(): void {
        toast("Obteniendo datos");
    }
    showContent(): boolean {
        return false;
    }
}

class WaitingState implements IState{
    constructor(private context: IEditableState & ICheckableFields){
        this.onItemAdd = this.onItemAdd.bind(this);
        this.onItemRemove = this.onItemRemove.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
        this.onAccept = this.onAccept.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onItemAdd(): void {
        this.context.setStt({
            fStt: new AddState(this.context)
        });
    }
    onItemRemove(): void {
        toast("Seleccione un corral a eliminar");
    }
    onItemSelected(idx: string): boolean {
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: this.context.getStt().items.find((v) => idx == v.id!.toString() )
        })
        return true;
    }
    onAccept(): void {
        toast("No hay elemento seleccionado")
    }
    onCancel(): void {
        toast("No hay elemento seleccionado")
    }
    showContent(): boolean {
        return false;
    }
}

class AddState implements IState{

    constructor(private context: IEditableState & ICheckableFields){
        this.onItemAdd = this.onItemAdd.bind(this);
        this.onItemRemove = this.onItemRemove.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
        this.onAccept = this.onAccept.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onItemAdd(): void {        
        toast("Guarde el corral antes de continuar");
    }
    onItemRemove(): void {
        toast("Guarde el corral antes de continuar");
    }
    onItemSelected(idx: string): boolean {
        toast("Guarde el corral antes de continuar");
        return false;
    }
    onAccept(): void {

        let stt = this.context.getStt();

        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
            return;
        }

        CorralsSrv.getInstance().add(stt.item as OUT_Corral);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            item: {}
        });
        toast("Corral guardado con exito");
    }
    onCancel(): void {
        this.context.setStt({
            fStt: new WaitingState(this.context)
        });
    }
    showContent(): boolean {
        return true;
    }
}

/* class EditState implements IState{

    constructor(private context: IEditableState & ICheckableFields){};

    onItemAdd = () => {
        toast("Guarde el corral antes de continuar");
    }
    onItemRemove = () => {
        CorralsSrv.getInstance().remove(this.context.getStt().item.id!);
        toast("Corral eliminado con exito");
        this.context.setStt({
            item: {},
            selectedItem: "-1",
            fStt: new WaitingState(this.context)
        })
    };
    onItemSelected = (idx: string) => {
        toast("Guarde el corral antes de continuar");
        return false;
    };
    onAccept = () => {
        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
        }
        CorralsSrv.getInstance().edit(
                                this.context.getStt().selectedItem, 
                                this.context.getStt().item as OUT_Corral);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        })
        toast("Corral editado con exito");
    };
    onCancel = () => {
        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        })
    };
    showContent = () => true;
    
} */

class ViewState implements IState{

    constructor(private context: IEditableState & ICheckableFields){};

    onItemAdd = () => {
        this.context.setStt({
            fStt: new AddState(this.context),
            selectedItem: "-1",
            item: {}
        })
    };
    onItemRemove = () => {
        this.context.setStt({
            modalData: {
                title: "Precaución",
                content: "El Corral no se podrá recuperar. ¿desea continuar?",
                onFinish: (e: ModalExitOptions) => {
                    let newState:any = {};                    
                    if(e == ModalExitOptions.ACCEPT){
                        CorralsSrv.getInstance().remove(this.context.getStt().item.id!);
                        toast("Corral eliminado con exito");
                        newState = {
                            item: {},
                            selectedItem: "-1",
                            fStt: new WaitingState(this.context)
                        };
                    }
                    newState.modalData = null;
                    this.context.setStt(newState);
                }
            } as ModalData
        })
        
    };
    onItemSelected = (idx: string) => {
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: this.context.getStt().items.find((v) => idx == v.id!.toString() )
        });
        return true;
    };
    onAccept = () => {
        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        });
    };
    onCancel = () => {
        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        });
    };
    showContent = () => true;
    
}



class CorralsSrv{
    data = new Array<IN_Corral>();

    private static entity: CorralsSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new CorralsSrv();
        }
        return this.entity
    }

    async get(){
        try {

            const response = await fetch(url + "/corrals", {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: "include",
            }); 

        let data = await response.json()
        this.data=data
        return data
        } catch (error) {
            return this.data
        }
        

}

    getId(id: string){
        return this.data.find((d) => d.id == id)
    }

async add(d: OUT_Corral){
        
    try {
        fetch(url + "/corrals", {
        method: 'POST', 
        body: JSON.stringify(d),
        credentials: "include",
        headers:{
            'Content-Type': 'application/json'
          }
        }); 
    } catch (error) {
        console.log(error)
    }
}


async remove(id: string){
    try {
        const response = await fetch(url + "/corrals/" + id, {
        method: 'DELETE', 
        mode: 'cors', 
        credentials: "include",
        }); 

    } catch (error) {
        console.log(error)
    }
}
}



enum Fields{
    NAME="name",
    HEAD_NUM='headNum'
}

interface ICorralsContentProps{
    onChange: (newValue: IFieldedCorral) => void;
    value: IFieldedCorral;

    lockedFields: Array<string>;
    badFields: Array<string>;
}

export class CorralsContent extends React.Component<ICorralsContentProps>{

    id: string | undefined;

    constructor(props: ICorralsContentProps){
        super(props);

        this.id = props.value.id;
    }

    onChange = (name: string, value: string | boolean) => {
        if(value == "false"){
            value = false
        }
        else if(value == "true"){
            value = true
        }
        
        let v = Object.assign({}, this.props.value, {
            [name]: value
        })
        this.props.onChange(v);
    }
/*
    private getLockedStatus(headCondition: boolean | undefined, field: Fields): boolean{
        return headCondition != undefined && 
                (
                    !headCondition || 
                    this.props.lockedFields.find((e) => e == Fields.ALL || e == field) != undefined
                )
        
    }
    */

    render(): JSX.Element{
        let el = this.props.value;
        
        return <>
            <div className="row">
                <div className="col s6">
                    <div className="elcfg--field--margin">
                        <Input placeholder="Nombre del corral" name={Fields.NAME} value={el.name} onChange={this.onChange}/>
                        
                   
                    <div className="elcfg--field--margin">
                        </div><Input placeholder="Numero maximo de animales" type="number" name={Fields.HEAD_NUM} value={el.headNum} onChange={this.onChange}/>
                    </div>
                </div>
            </div>
        </>
    }
}