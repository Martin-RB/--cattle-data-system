import React from "react";
import { ElementSample, IState } from "./ElementSample";
import { Input } from "../../Components/Input";
import { IMedicine } from "../../Classes/DataStructures/Medicine";
import { toast } from "./../../App";
import { IOption } from "./../../Classes/IOption";

export interface IFieldedMedicine{
    id?: string,
    name?: string,
    isPerHead?: boolean,
    costPerUnit?: number,
    mlPerUnit?: number,
    mlPerKg?: number
}

interface IDrugsProps{

}

enum AAA{
    NAME="", ERROR=""
}

// State / props
interface IDrugsState{
    fStt: IState;
    items: Array<IMedicine>;
    item: IFieldedMedicine;
    wrongFields: Array<AAA>;
    lockedFields: Array<string>;
    selectedItem: string;
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
            selectedItem: "-1"
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
        this.onGather(srv.get());
    }

    onGather = (data: Array<IMedicine>) =>{
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
        </>
    }

    private fromItemToOption(items: Array<IMedicine>){
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
            fStt: new EditState(this.context),
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

        DrugsSrv.getInstance().add(stt.item as IMedicine);

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

class EditState implements IState{

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
    
}



class DrugsSrv{
    data = new Array<IMedicine>();

    private static entity: DrugsSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new DrugsSrv();
        }
        return this.entity
    }

    get(){
        return this.data;
    }

    getId(id: string){
        return this.data.find((d) => d.id == id)
    }

    add(d: IMedicine){
        d.id = this.data.length.toString();
        this.data.push(d);
    }

    remove(id: string){
        let el = this.data.findIndex((d) => d.id == id);
        this.data.splice(el, 1);
    }

    edit(id: string, d: IMedicine){
        for (let i = 0; i < this.data.length; i++) {
            const el = this.data[i];
            if(el.id == id){
                this.data[i] = d;
            }
        }
    }
}



enum Fields{
    NAME="name"
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

    onChange = (name: string, value: string) => {
        let newValue: IFieldedMedicine = {
            [name]: value
        }
        newValue.id = this.id;
        this.props.onChange(newValue);
    }

    render(): JSX.Element{
        return <>
            <div className="row">
                <div className="col s6">
                    <Input placeholder="Nombre" name={Fields.NAME} value={this.props.value.name} onChange={this.onChange}/>
                </div>
            </div>
        </>
    }
}