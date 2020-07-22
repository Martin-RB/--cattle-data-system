import React from "react";
import { IState, ElementSample } from "./ElementSample";
import { IMedicine } from "./../../Classes/DataStructures/Medicine";
import { Input } from "./../../Components/Input";
import { ModalData, Modal, ModalExitOptions } from "./../../Components/Modal";
import { IOption } from "./../../Classes/IOption";
import { IProtocol } from "./../../Classes/DataStructures/Protocol";
import { toast } from "./../../App";
import { List, ListRow, ListColInput } from "../../Components/List";

interface IFieldedProtocol{
    id?: string, 
    name?: string, 
    medicines?: Array<IMedicine>;
}

interface IProtocolsProps{
}

interface IProtocolsState{
    fStt: IState;
    items: Array<IProtocol>;
    item: IFieldedProtocol;
    wrongFields: Array<Fields>;
    lockedFields: Array<Fields>;
    selectedItem: string;
    modalData: ModalData | null;
}

/**  */
interface IEditableState{
    setStt(stt: any): void;
    getStt(): IProtocolsState;
}
interface ICheckableFields{
    isAllFilled(): boolean;
    setWrongFields(fields: Array<Fields>): void;
}

export class Protocols extends React.Component<IProtocolsProps, IProtocolsState> implements IEditableState, ICheckableFields{
    constructor(props: IProtocolsProps){
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
    componentDidMount(){
        this.gather();
    }

    setStt(stt: any): void {
        this.setState(stt)
    }
    getStt() {
        return this.state;
    }
    isAllFilled(): boolean {
        return this.state.item.medicines != undefined && 
                this.state.item.medicines.length > 0 &&
                this.state.item.name != undefined;
    }
    setWrongFields(fields: Fields[]): void {
        
    }
    onContentChange = (newValue: IFieldedProtocol) => {
        this.setState({
            item: newValue
        })
    };

    async gather(){
        let srv = ProtocolsSrv.getInstance();
        this.onGather(await srv.get());
    }

    onGather = (data: Array<IProtocol>) =>{
        this.setState({
            fStt: new WaitingState(this),
            items: data
        })
    }

    render(): JSX.Element{
        return  <>
                <ElementSample  
                        title="Protocolos"
                        state={this.state.fStt}
                        showContent={this.state.fStt.showContent()}
                        items={this.fromItemToOption(this.state.items)}
                        selectedItem={this.state.selectedItem}
                        selectionPlaceholder="Protocolos">
                <ProtocolsContent 
                            value={this.state.item} 
                            onChange={this.onContentChange}
                            lockedFields={[]}
                            badFields={[]}/>
                        {this.state.modalData != null? <Modal data={this.state.modalData}/>:null}
                </ElementSample>
                </>
    }
    private fromItemToOption(items: Array<IProtocol>){
        let options = new Array<IOption>();
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            options.push({key: el.id!, name: el.name})
        }
        return options;
    }
}

class GatherState implements IState{
    constructor(context: IEditableState & ICheckableFields){}
    onItemAdd = () => {
        toast("Obteniendo datos");
    }
    onItemRemove = () => {
        toast("Obteniendo datos");
    }
    onItemSelected = (idx: string) => {
        toast("Obteniendo datos");
        return false;
    }
    onAccept = () => {
        toast("Obteniendo datos");
    }
    onCancel = () => {
        toast("Obteniendo datos");
    }
    showContent = () => false;
}

class WaitingState implements IState{
    constructor(private context: IEditableState & ICheckableFields){}

    onItemAdd = () => {
        this.context.setStt({
            fStt: new AddState(this.context)
        });
    }
    onItemRemove = () => {
        toast("Seleccione un medicamento a eliminar");
    }
    onItemSelected = (idx: string) => {
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: this.context.getStt().items.find((v) => idx == v.id!.toString() )
        })
        return true;
    }
    onAccept = () => {
        toast("No hay elemento seleccionado")
    }
    onCancel = () => {
        toast("No hay elemento seleccionado")
    }
    showContent = () => false
}

class AddState implements IState{
    constructor(private context: IEditableState & ICheckableFields){}

    onItemAdd = () => {
        toast("Guarde el medicamento antes de continuar");
    }
    onItemRemove = () => {
        toast("Guarde el medicamento antes de continuar");
    }
    onItemSelected = (idx: string) => {
        toast("Guarde el medicamento antes de continuar");
        return false;
    }
    onAccept = () => {

        let stt = this.context.getStt();

        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
            return;
        }

        ProtocolsSrv.getInstance().add(stt.item as IProtocol);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            item: {}
        });
        toast("Medicamento guardado con exito");
    }
    onCancel = () => {
        this.context.setStt({
            fStt: new WaitingState(this.context)
        });
    }
    showContent = () => true
}

class ViewState implements IState{
    constructor(private context: IEditableState & ICheckableFields){}

    onItemAdd = () => {
        this.context.setStt({
            fStt: new AddState(this.context),
            selectedItem: "-1",
            item: {}
        })
    }
    onItemRemove = () => {
        this.context.setStt({
            modalData: {
                title: "Precaución",
                content: "El medicamento no se podrá recuperar. ¿desea continuar?",
                onFinish: (e: ModalExitOptions) => {
                    let newState:any = {};                    
                    if(e == ModalExitOptions.ACCEPT){
                        ProtocolsSrv.getInstance().remove(this.context.getStt().item.id!);
                        toast("Medicamento eliminado con exito");
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
    }
    onItemSelected = (idx: string) => {
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: this.context.getStt().items.find((v) => idx == v.id!.toString() )
        })
        return true;
    }
    onAccept = () => {
        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        });
    }
    onCancel = () => {
        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        });
    }
    showContent = () => true
}

class ProtocolsSrv{
    data = new Array<IProtocol>();

    private static entity: ProtocolsSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new ProtocolsSrv();
        }
        return this.entity
    }

    async get(){
        return this.data;
    }

    getId(id: string){
        return this.data.find((d) => d.id == id)
    }

    async add(d: IProtocol){
        d.id = this.data.length.toString();
        this.data.push(d);
    }

    async remove(id: string){
        let el = this.data.findIndex((d) => d.id == id);
        this.data.splice(el, 1);
    }

    async edit(id: string, d: IProtocol){
        for (let i = 0; i < this.data.length; i++) {
            const el = this.data[i];
            if(el.id == id){
                this.data[i] = d;
            }
        }
    }
}



enum Fields{
    NAME = "name"
}

interface ProtocolsContentProps{
    onChange: (newValue: IFieldedProtocol) => void;
    value: IFieldedProtocol;

    lockedFields: Array<string>;
    badFields: Array<string>;
}

interface ProtocolsContentState{
    rows: Array<ListRow>;
}

export class ProtocolsContent extends React.Component<ProtocolsContentProps, ProtocolsContentState>{
    
    headers: Array<string>;

    constructor(props: ProtocolsContentProps){
        super(props);

        this.headers = ["Nombre", "Presentación", "Dosis", "Costo"];
        this.state = {
            rows: [{
                id: "1",
                columns: ["Micotil", "500 ml", "0.333 ml/kg", "3000 $"]
            }]
        }
    }

    onNameChange = (name: string, value: string) => {
        let v = Object.assign({}, this.props.value, {
            [name]: value
        });
        this.props.onChange(v);
    }

    onItemChange = (id: string, arrIdx: number, value: string) => {
        let newState = Object.assign({}, this.state, {
            rows: this.state.rows.map((v) => {
                if(v.id == id){
                    let old = v.columns[arrIdx];
                    v.columns[arrIdx] = {inputValue: value, type: (old as ListColInput).type};  
                } 
                return v;
            })
        })

        this.setState(newState);
    }

    onAllSelected = (isSelected: boolean) => {
        let newRows = this.state.rows.map((e) => {
            e.isSelected = isSelected;
            return e;
        });

        this.setState({
            rows: newRows
        })
    }

    onItemSelected = (id: string, isSelected: boolean) => {
        let newRows = this.state.rows.map((e) => {
            if(e.id == id) e.isSelected = isSelected;
            return e;
        });

        this.setState({
            rows: newRows
        })
    }

    render(): JSX.Element{
        return <>
                <div className="row">
                    <div className="col s6">
                        <div className="elcfg--field--margin">

                            <Input name={Fields.NAME} placeholder="Nombre" value={this.props.value.name} onChange={this.onNameChange}/>
                        </div>
                        <div className="elcfg--field--margin">
                            <label>Medicamentos</label>
                            <List 
                                deletable={false} 
                                editable={false} 
                                headers={this.headers} 
                                rows={this.state.rows} 
                                selectable={true} 
                                onChange={this.onItemChange}
                                onAllSelected={this.onAllSelected}
                                onItemSelected={this.onItemSelected}/>
                        </div>
                    </div>
                </div>
                </>
    }
}