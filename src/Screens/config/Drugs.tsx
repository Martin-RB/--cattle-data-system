import React from "react";
import { ElementSample, IState } from "./ElementSample";
import { Input } from "../../Components/Input";
import { toast } from "./../../App";
import { IOption } from "./../../Classes/IOption";
import { Radio } from "./../../Components/Radio";
import { Modal, ModalData, ModalExitOptions } from "./../../Components/Modal";
import url from "../ConfigI";
import { IN_Medicine, OUT_Medicine } from "../../Classes/DataStructures/Medicine";

export interface IFieldedMedicine{
    id?: string,
    name?: string,
    isPerHead?: boolean,
    cost?: number,
    presentation?: number,
    mlApplication?: number,
    kgApplication?: number
}

interface IDrugsProps{

}

// State / props
interface IDrugsState{
    fStt: IState;
    items: Array<IN_Medicine>;
    item: IFieldedMedicine;
    wrongFields: Array<Fields>;
    lockedFields: Array<Fields>;
    selectedItem: string;
    modalData: ModalData | null;
}
// Functional interfaces
interface IEditableState{
    setStt(stt: any): void;
    getStt(): IDrugsState;
}
interface ICheckableFields{
    isAllFilled(): boolean;
    setWrongFields(fields: Array<Fields>): void;
}

export class Drugs extends React.Component<IDrugsProps, IDrugsState> implements IEditableState, ICheckableFields{

    constructor(props: IDrugsProps){
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
        let srv = DrugsSrv.getInstance();
        this.onGather(await srv.get());
    }

    onGather = (data: Array<IN_Medicine>) =>{
        this.setState({
            fStt: new WaitingState(this),
            items: data
        })
    }

    onContentChange(newValue: IFieldedMedicine){        
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
                        title="Medicamentos"
                        state={this.state.fStt}
                        showContent={this.state.fStt.showContent()}
                        items={this.fromItemToOption(this.state.items)}
                        selectedItem={this.state.selectedItem}
                        selectionPlaceholder="Medicamentos">
                <DrugsContent 
                            value={this.state.item} 
                            onChange={this.onContentChange}
                            lockedFields={[]}
                            badFields={[]}/>
            </ElementSample>
            {this.state.modalData != null? <Modal data={this.state.modalData}/>:null}
        </>
    }

    private fromItemToOption(items: Array<IN_Medicine>){
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
        toast("Seleccione un medicamento a eliminar");
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
        toast("Guarde el medicamento antes de continuar");
    }
    onItemRemove(): void {
        toast("Guarde el medicamento antes de continuar");
    }
    onItemSelected(idx: string): boolean {
        toast("Guarde el medicamento antes de continuar");
        return false;
    }
    onAccept(): void {

        let stt = this.context.getStt();

        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
            return;
        }

        DrugsSrv.getInstance().add(stt.item as OUT_Medicine);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            item: {}
        });
        toast("Medicamento guardado con exito");
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
        toast("Guarde el medicamento antes de continuar");
    }
    onItemRemove = () => {
        DrugsSrv.getInstance().remove(this.context.getStt().item.id!);
        toast("Medicamento eliminado con exito");
        this.context.setStt({
            item: {},
            selectedItem: "-1",
            fStt: new WaitingState(this.context)
        })
    };
    onItemSelected = (idx: string) => {
        toast("Guarde el medicamento antes de continuar");
        return false;
    };
    onAccept = () => {
        if(!this.context.isAllFilled()){
            toast("Llene todos los campos");
        }
        DrugsSrv.getInstance().edit(
                                this.context.getStt().selectedItem, 
                                this.context.getStt().item as IMedicine);

        this.context.setStt({
            fStt: new WaitingState(this.context),
            selectedItem: "-1",
            item: {}
        })
        toast("Medicamento editado con exito");
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
                content: "El medicamento no se podrá recuperar. ¿desea continuar?",
                onFinish: (e: ModalExitOptions) => {
                    let newState:any = {};                    
                    if(e == ModalExitOptions.ACCEPT){
                        DrugsSrv.getInstance().remove(this.context.getStt().item.id!);
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



class DrugsSrv{
    data = new Array<IN_Medicine>();

    private static entity: DrugsSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new DrugsSrv();
        }
        return this.entity
    }

    async get(){
            try {

                const response = await fetch(url + "/medicines", {
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

    async add(d: OUT_Medicine){


        if(!d.kgApplication )
            d.kgApplication = 0
        if(!d.mlApplication )
            d.mlApplication = 0
        if(!d.cost )
            d.cost = 0
            
        
        try {
            fetch(url + "/medicines", {
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
            const response = await fetch(url + "/medicines/" + id, {
            method: 'DELETE', 
            credentials: "include",
            mode: 'cors', 
            }); 

        } catch (error) {
            console.log(error)
        }
    }

    async edit(id: string, d: any){
        for (let i = 0; i < this.data.length; i++) {
            const el = this.data[i];
            if(el.id == id){
                this.data[i] = d;
                fetch(url);
            }
        }
    }
}



enum Fields{
    NAME="name",
    PRESENTATION="presentation",
    COST="cost",
    ML_APPLY="mlApplication",
    KG_APLLY="kgApplication",
    ALL="",
    IS_PER_HEAD="isPerHead"
}

interface IDrugsContentProps{
    onChange: (newValue: IFieldedMedicine) => void;
    value: IFieldedMedicine;

    lockedFields: Array<string>;
    badFields: Array<string>;
}

export class DrugsContent extends React.Component<IDrugsContentProps>{

    id: string | undefined;

    constructor(props: IDrugsContentProps){
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

    private getLockedStatus(headCondition: boolean | undefined, field: Fields): boolean{
        return headCondition != undefined && 
                (
                    !headCondition || 
                    this.props.lockedFields.find((e) => e == Fields.ALL || e == field) != undefined
                )
        
    }

    render(): JSX.Element{
        let el = this.props.value;
        
        return <>
            <div className="row">
                <div className="col s6">
                    <div className="elcfg--field--margin">
                        <Input placeholder="Nombre" name={Fields.NAME} value={this.props.value.name} onChange={this.onChange}/>
                    </div>
                    <div>
                        <label>Tipo de medicamento</label>
                    </div>
                    <div className="elcfg--field--margin">
                        <Radio name={Fields.IS_PER_HEAD} value={"true"} checked={el.isPerHead!=undefined? el.isPerHead: false} onChange={this.onChange} text="Por dosis"/>
                        <div className="left-justify">
                            <Input 
                                    placeholder="Presentación" 
                                    name={Fields.PRESENTATION} 
                                    value={!this.getLockedStatus(el.isPerHead, name) && el.presentation?.toString() || ""} 
                                    onChange={this.onChange} 
                                    className="small-field" 
                                    locked={this.getLockedStatus(el.isPerHead, name)}/>
                            <label> dosis</label>
                            <Input 
                                    placeholder="Costo" 
                                    name={Fields.COST} 
                                    value={!this.getLockedStatus(el.isPerHead, name) && el.cost?.toString() || ""} 
                                    onChange={this.onChange} 
                                    className="small-field"
                                    locked={this.getLockedStatus(el.isPerHead, name)}/>
                            <label> pesos</label>
                        </div>
                    </div>
                    <div className="elcfg--field--margin">
                        <Radio name={Fields.IS_PER_HEAD} value={"false"} checked={(el.isPerHead!=undefined? !el.isPerHead: false)} onChange={this.onChange} text="Por mililitros"/>
                        <div className="left-justify">
                            <Input 
                                    placeholder="Presentación" 
                                    name={Fields.PRESENTATION} 
                                    value={this.getLockedStatus(el.isPerHead, name) && this.props.value.presentation?.toString() || ""} 
                                    onChange={this.onChange} 
                                    className="small-field"
                                    locked={this.getLockedStatus(!el.isPerHead, name)}/>
                            <label> ml</label>
                            <Input 
                                    placeholder="Aplicación" 
                                    name={Fields.ML_APPLY} 
                                    value={this.getLockedStatus(el.isPerHead, name) && this.props.value.mlApplication?.toString() || ""} 
                                    onChange={this.onChange} 
                                    className="small-field"
                                    locked={this.getLockedStatus(!el.isPerHead, name)}/>
                            <label> ml por cada </label>
                            <Input 
                                    isInline={true} 
                                    name={Fields.KG_APLLY} 
                                    value={this.getLockedStatus(el.isPerHead, name) && this.props.value.kgApplication?.toString() || ""} 
                                    onChange={this.onChange} 
                                    className="small-field"
                                    locked={this.getLockedStatus(!el.isPerHead, name)}/>
                            <label> kg</label>
                            <Input placeholder="Costo" 
                                    name={Fields.COST} 
                                    value={this.getLockedStatus(el.isPerHead, name) && this.props.value.cost?.toString() || ""} 
                                    onChange={this.onChange} 
                                    className="small-field"
                                    locked={this.getLockedStatus(!el.isPerHead, name)}/>
                            <label> pesos</label>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    }
}