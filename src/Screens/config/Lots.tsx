import React from "react";
import { ElementSample, IState } from "./ElementSample";
import { Input } from "../../Components/Input";
import { IImplant} from "../../Classes/DataStructures/Implant"
import { toast } from "../../App";
import { Select } from "../../Components/Select";
import { IOption } from "../../Classes/IOption";
import { Radio } from "../../Components/Radio";
import { Button} from "../../Components/Button";
import { Modal, ModalData, ModalExitOptions } from "../../Components/Modal";
import url from "../ConfigI";
import { IN_Corral } from "../../Classes/DataStructures/Corral";
import { IN_Protocol } from "../../Classes/DataStructures/Protocol";
import { IN_Alot, OUT_Alot } from "../../Classes/DataStructures/Alot";

export interface IFieldedLot{
    id?: string;
    name?: string, 
    maxHeadNum?: number, 
    sex?: ("male" | "female"),
    maxWeight?: number, 
    minWeight?: number, 
    arrivalProtocol?: number, 
    hostCorral?: number, 
    reimplants?: Array<IImplant> 
}

interface ILotsProps{

}

// State / props
interface ILotsState{
    fStt: IState;
    corrals: Array<IN_Corral>
    protocols: Array<IN_Protocol>
    items: Array<IN_Alot>;
    item: IFieldedLot;
    wrongFields: Array<Fields>;
    lockedFields: Array<Fields>;
    selectedItem: string;
    modalData: ModalData | null;
}
// Functional interfaces
interface IEditableState{
    setStt(stt: any): void;
    getStt(): ILotsState;
}
interface ICheckableFields{
    isAllFilled(): boolean;
    setWrongFields(fields: Array<Fields>): void;
}

export class Lots extends React.Component<ILotsProps, ILotsState> implements IEditableState, ICheckableFields{


    // TODO: Arreglar los selects para que den datos correctos
    constructor(props: ILotsProps){
        super(props);

        this.state = {
            fStt: new GatherState(this),
            wrongFields: [],
            lockedFields: [],
            items: [],
            item: {},
            selectedItem: "-1",
            modalData: null,
            corrals: [],
            protocols: []
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
        let alotSrv = LotsSrv.getInstance();
        let corralsSrv = CorralsSrv.getInstance();
        let protocolsSrv = ProtocolsSrv.getInstance()
        let [alotRes, corralRes, protRes] = await Promise.all([
            alotSrv.get(),
            corralsSrv.get(),
            protocolsSrv.get()
        ])
        this.onGather(alotRes, corralRes?corralRes:new Array<IN_Corral>(), protRes);
    }

    onGather = (alots: Array<IN_Alot>, 
                corrals: Array<IN_Corral>, 
                protocols: Array<IN_Protocol>) =>{
        this.setState({
            fStt: new WaitingState(this),
            items: alots,
            corrals,
            protocols
        })
    }

    onContentChange(newValue: IFieldedLot){        
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
                        title="Lotes"
                        state={this.state.fStt}
                        showContent={this.state.fStt.showContent()}
                        items={this.fromItemToOption(this.state.items)}
                        selectedItem={this.state.selectedItem}
                        selectionPlaceholder="Lotes">
                <LotsContent 
                            value={this.state.item} 
                            onChange={this.onContentChange}
                            lockedFields={[]}
                            badFields={[]}
                            corrals={this.state.corrals}
                            idxCorral={this.state.corrals.findIndex(v=>v.id==this.state.item.hostCorral?.toString())}
                            idxProtocol={this.state.protocols.findIndex(v=>v.id==this.state.item.arrivalProtocol?.toString())}
                            protocols={this.state.protocols}/>
            </ElementSample>
            {this.state.modalData != null? <Modal data={this.state.modalData}/>:null}
        </>
    }

    private fromItemToOption(items: Array<IN_Alot>){
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

        this.onClick = this.onClick.bind(this);
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
    onClick(): void {
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

        this.onClick = this.onClick.bind(this);
    }

    onItemAdd(): void {
        this.context.setStt({
            fStt: new AddState(this.context)
        });
    }
    onItemRemove(): void {
        toast("Seleccione un lote a eliminar");
    }
    onItemSelected(idx: string): boolean {
        let item = this.context.getStt().items.find((v) => idx == v.id!.toString() );
        
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: ({
                ...item,
                hostCorral: item?.hostCorral?.id,
                arrivalProtocol: item?.arrivalProtocol?.id
            }) as IFieldedLot
        })
        return true;
    }
    onAccept(): void {
        toast("No hay elemento seleccionado")
    }
    onClick(): void {
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

        this.onClick = this.onClick.bind(this);
    }

    onItemAdd(): void {        
        toast("Guarde el lote antes de continuar");
    }
    onItemRemove(): void {
        toast("Guarde el lote antes de continuar");
    }
    onItemSelected(idx: string): boolean {
        toast("Guarde el lote antes de continuar");
        return false;
    }
    onAccept(): void {

        let stt = this.context.getStt();

        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
            return;
        }
        

        LotsSrv.getInstance().add(stt.item as OUT_Alot).then(()=>{
            
            this.context.setStt({
                fStt: new GatherState(this.context),
                item: {}
            });
            toast("Lote guardado con exito");
        });

    }

    onClick(): void {


        toast("Implante guardado con exito");
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
        toast("Guarde el lote antes de continuar");
    }
    onItemRemove = () => {
        LotsSrv.getInstance().remove(this.context.getStt().item.id!);
        toast("Lote eliminado con exito");
        this.context.setStt({
            item: {},
            selectedItem: "-1",
            fStt: new WaitingState(this.context)
        })
    };
    onItemSelected = (idx: string) => {
        toast("Guarde el lote antes de continuar");
        return false;
    };
    onAccept = () => {
        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
        }
        LotsSrv.getInstance().edit(
                                this.context.getStt().selectedItem, 
                                this.context.getStt().item as IAlot);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        })
        toast("Lote editado con exito");
    };

    onClick = () => {
        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
        }
        LotsSrv.getInstance().edit(
                                this.context.getStt().selectedItem, 
                                this.context.getStt().item as IAlot);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        })
        toast("Lote editado con exito");
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
                content: "El Lote no se podrá recuperar. ¿desea continuar?",
                onFinish: (e: ModalExitOptions) => {
                    let newState:any = {};                    
                    if(e == ModalExitOptions.ACCEPT){
                        LotsSrv.getInstance().remove(this.context.getStt().item.id!);
                        toast("Lote eliminado con exito");
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
        let item = this.context.getStt().items.find((v) => idx == v.id!.toString() );
        
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: ({
                ...item,
                hostCorral: item?.hostCorral?.id,
                arrivalProtocol: item?.arrivalProtocol?.id
            }) as IFieldedLot
        })
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

class ProtocolsSrv{
    private static entity: ProtocolsSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new ProtocolsSrv();
        }
        return this.entity
    }

    async get() : Promise<Array<IN_Protocol>>{
        return new Promise<Array<IN_Protocol>>(async (res, rej) => {
            try {
                const response = await fetch(url + "/protocols", {
                    method: 'GET', 
                    mode: 'cors', 
                    cache: 'no-cache', 
                    credentials: "include",
                }); 
    
                let data = (await response.json()) as Array<IN_Protocol>
                res(data)
            } catch (error) {
                console.log(error);
            }
        })
    }
}

class CorralsSrv{
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
        return data as Array<IN_Corral>
        } catch (error) {
            console.log(error);
            
        }
    }
}

class LotsSrv{
    data = new Array<IN_Alot>();

    private static entity: LotsSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new LotsSrv();
        }
        return this.entity
    }

    async get(){
        try {

        const response = await fetch(url + "/alots", {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: "include",
        }); 

        let data = await response.json()
        this.data=data
        console.log(data);
        
        return data
        } catch (error) {
            return this.data
        }
        

    }

    getId(id: string){
        return this.data.find((d) => d.id == id)
    }

    async add(d: OUT_Alot){
        console.log("asdasd");
    
        let newReimplants :IImplant[] = []
        d.reimplants = newReimplants
        try {
            
            fetch(url + "/alots", {
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
            const response = await fetch(url + "/alots/" + id, {
            method: 'DELETE', 
            mode: 'cors', 
            credentials: "include",
            }); 

        } catch (error) {
            console.log(error)
        }
    }

/*     async edit(id: string, d: IAlot){
        for (let i = 0; i < this.data.length; i++) {
            const el = this.data[i];
            if(el.id == id){
                this.data[i] = d;
                fetch(url);
            }
        }
    } */
}



enum Fields{
    NAME="name",
    MAX_HEAD="maxHeadNum",
    SEX="sex",
    MAX_WEIGHT="maxWeight",
    MIN_WEIGHT="minWeight",
    ARRIVAL_PROTOCOL="arrivalProtocol",
    HOST_CORRAL="hostCorral",
    REIMPLANTS="reimplants",
    sexType="sexType"
}

interface ILotsContentProps{
    onChange: (newValue: IFieldedLot) => void;
    value: IFieldedLot;

    lockedFields: Array<string>;
    badFields: Array<string>;
    corrals: Array<IN_Corral>
    idxCorral: number
    protocols: Array<IN_Protocol>
    idxProtocol: number

}

export class LotsContent extends React.Component<ILotsContentProps>{

    id: string | undefined;
    sexType : boolean = false


    constructor(props: ILotsContentProps){
        super(props);

        this.id = props.value.id;
    }

    onChange = (name: string, value: string | boolean) => {
        if(value == "false"){
            value = false
           
            this.props.value.sex = "female"
             this.sexType = false
        }
        else if(value == "true"){
            value = true
           
            this.props.value.sex = "male"
             this.sexType =  true
        }
        
        let v = Object.assign({}, this.props.value, {
            [name]: value
        })
        this.props.onChange(v);
    }

    onSelectChanged = (name: string, value: string) => {
        if(name == Fields.HOST_CORRAL){
            let idCorral = this.props.corrals[parseInt(value)].id;
            let v = Object.assign({}, this.props.value, {
                [name]: idCorral
            })
            this.props.onChange(v);
        }
        else if(name == Fields.ARRIVAL_PROTOCOL){
            let idCorral = this.props.protocols[parseInt(value)].id;
            let v = Object.assign({}, this.props.value, {
                [name]: idCorral
            })
            this.props.onChange(v);
        }
        return true;
    }

    render(): JSX.Element{
        console.log(this.props.idxCorral);
        
        let el = this.props.value;
        return <>
            <div className="row">
                <div className="col s6">
                    <div className="elcfg--field--margin">
                        <Input placeholder="Nombre del lote" name={Fields.NAME} value={el.name} onChange={this.onChange}/>
                        <Input placeholder="Numero maximo de cabezas" type="number" name={Fields.MAX_HEAD} value={el.maxHeadNum?.toString() } onChange={this.onChange}/>
                        <div>
                        <label>Sexo</label>
                        </div>
                        <div>
                            <Radio name={Fields.sexType} value={"true"} checked={this.sexType} onChange={this.onChange} text="Macho"/>
                        </div>
                        <div>
                            <Radio name={Fields.sexType} value={"false"} checked={ !this.sexType} onChange={this.onChange} text="Hembra"/>
                        </div>
                        
                        <Input placeholder="Peso minimo admitido" type="number" name={Fields.MIN_WEIGHT} value={el.minWeight?.toString()} onChange={this.onChange}/>
                        <Input placeholder="Peso maximo admitido" type="number" name={Fields.MAX_WEIGHT} value={el.maxWeight?.toString()} onChange={this.onChange}/>
                        <div>
                        <label>Protocolo de llegada</label>
                        <Select placeholder="Protocolo de llegada" value={this.props.idxProtocol.toString()} onChange={(v)=>this.onSelectChanged(Fields.ARRIVAL_PROTOCOL, v)}
                                    elements={this.props.protocols.map((v, i)=>({key: i.toString(), name: v.name})as IOption)}/>
                        <label>Corral anfitrión</label>
                        <Select placeholder="Corral anfitrión" value={this.props.idxCorral.toString()} onChange={(v)=>this.onSelectChanged(Fields.HOST_CORRAL, v)}
                                    elements={this.props.corrals.map((v, i)=>({key: i.toString(), name: v.name})as IOption)}/>
                        </div>
                    </div>
                </div>
                <div className="col s6">

                </div>

            </div>
        </>
    }
}

