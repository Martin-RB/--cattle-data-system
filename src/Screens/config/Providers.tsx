import React from "react";
import { ElementSample, IState } from "./ElementSample";
import { Input } from "../../Components/Input";
import { IN_Provider , OUT_Provider } from "../../Classes/DataStructures/Provider";
import { toast } from "../../App";
import { IOption } from "../../Classes/IOption";
import { Radio } from "../../Components/Radio";
import { Modal, ModalData, ModalExitOptions } from "../../Components/Modal";
import url from "../ConfigI";

export interface IFieldedProvider{
    id?: string
    name?: string
}

interface IProvidersProps{

}

// State / props
interface IProvidersState{
    fStt: IState;
    items: Array<IN_Provider>;
    item: IFieldedProvider;
    wrongFields: Array<Fields>;
    lockedFields: Array<Fields>;
    selectedItem: string;
    modalData: ModalData | null;
}
// Functional interfaces
interface IEditableState{
    setStt(stt: any): void;
    getStt(): IProvidersState;
}
interface ICheckableFields{
    isAllFilled(): boolean;
    setWrongFields(fields: Array<Fields>): void;
}

export class Providers extends React.Component<IProvidersProps, IProvidersState> implements IEditableState, ICheckableFields{

    constructor(props: IProvidersProps){
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
        let srv = ProvidersSrv.getInstance();
        this.onGather(await srv.get());
    }

    onGather = (data: Array<IN_Provider>) =>{
        this.setState({
            fStt: new WaitingState(this),
            items: data
        })
    }

    onContentChange(newValue: IFieldedProvider){        
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
                        title="Proveedores"
                        state={this.state.fStt}
                        showContent={this.state.fStt.showContent()}
                        items={this.fromItemToOption(this.state.items)}
                        selectedItem={this.state.selectedItem}
                        selectionPlaceholder="Proveedores">
                <ProvidersContent 
                            value={this.state.item} 
                            onChange={this.onContentChange}
                            lockedFields={[]}
                            badFields={[]}/>
            </ElementSample>
            {this.state.modalData != null? <Modal data={this.state.modalData}/>:null}
        </>
    }

    private fromItemToOption(items: Array<IN_Provider>){
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
        toast("Seleccione un proveedor a eliminar");
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
        toast("Guarde el proveedor antes de continuar");
    }
    onItemRemove(): void {
        toast("Guarde el proveedor antes de continuar");
    }
    onItemSelected(idx: string): boolean {
        toast("Guarde el proveedor antes de continuar");
        return false;
    }
    onAccept(): void {

        let stt = this.context.getStt();

        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
            return;
        }

        ProvidersSrv.getInstance().add(stt.item as IN_Provider);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            item: {}
        });
        toast("Proveedor guardado con exito");
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

class EditState implements IState{

    constructor(private context: IEditableState & ICheckableFields){};

    onItemAdd = () => {
        toast("Guarde el proveedor antes de continuar");
    }
    onItemRemove = () => {
        ProvidersSrv.getInstance().remove(this.context.getStt().item.id!);
        toast("Proveedor eliminado con exito");
        this.context.setStt({
            item: {},
            selectedItem: "-1",
            fStt: new WaitingState(this.context)
        })
    };
    onItemSelected = (idx: string) => {
        toast("Guarde el proveedor antes de continuar");
        return false;
    };
    onAccept = () => {
        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
        }
        ProvidersSrv.getInstance().edit(
                                this.context.getStt().selectedItem, 
                                this.context.getStt().item as IN_Provider);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        })
        toast("Proveedor editado con exito");
    };
    onCancel = () => {
        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        })
    };
    showContent = () => true;
    
}

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
                content: "El Proveedor no se podrá recuperar. ¿desea continuar?",
                onFinish: (e: ModalExitOptions) => {
                    let newState:any = {};                    
                    if(e == ModalExitOptions.ACCEPT){
                        ProvidersSrv.getInstance().remove(this.context.getStt().item.id!);
                        toast("Proveedor eliminado con exito");
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



class ProvidersSrv{
    data = new Array<IN_Provider>();

    private static entity: ProvidersSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new ProvidersSrv();
        }
        return this.entity
    }

    async get(){
        try {
            const response = await fetch(url + "/providers", {
            method: 'GET', 
            mode: 'cors', 
            credentials: "include",
            cache: 'no-cache', 
            }); 

        let data = await response.json()
        this.data=data
        return data
        } catch (error) {
            return this.data
        }
    }

    async getId(id: string){
        try {
            const response = await fetch(url + "/providers/" + id, {
            method: 'GET', 
            mode: 'cors', 
            credentials: "include",
            cache: 'no-cache', 
            }); 

        let data = await response.json()

        return data
        } catch (error) {
            return this.data
        }
    }

    async add(d: OUT_Provider){
        try {
            fetch(url + "/providers", {
            method: 'POST', 
            credentials: "include",
            body: JSON.stringify(d),
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
            const response = await fetch(url + "/providers/" + id, {
            method: 'DELETE', 
            mode: 'cors', 
            credentials: "include",
            }); 

        } catch (error) {
            console.log(error)
        }
    }

    async edit(id: string, d: IN_Provider){
        for (let i = 0; i < this.data.length; i++) {
            const el = this.data[i];
            if(el.id == id){
                this.data[i] = d;
            }
        }
    }
}

enum Fields{
    NAME="name",
}

interface IProvidersContentProps{
    onChange: (newValue: IFieldedProvider) => void;
    value: IFieldedProvider;

    lockedFields: Array<string>;
    badFields: Array<string>;
}

export class ProvidersContent extends React.Component<IProvidersContentProps>{

    id: string | undefined;

    constructor(props: IProvidersContentProps){
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


    render(): JSX.Element{
        let el = this.props.value;
        
        return <>
            <div className="row">
                <div className="col s6">
                    <div className="elcfg--field--margin">
                        <Input placeholder="Nombre del proveedor" name={Fields.NAME} value={this.props.value.name} onChange={this.onChange}/>
                    </div>            
                </div>
            </div>
        </>
    }
}