import React from "react";
import { IState, ElementSample } from "./ElementSample";
import { Input } from "./../../Components/Input";
import { ModalData, Modal, ModalExitOptions } from "./../../Components/Modal";
import { IOption } from "./../../Classes/IOption";
import { toast } from "./../../App";
import { List, ListRow, ListColInput } from "../../Components/List";
import { Sumer } from "../../Components/Sumer";
import url from "../ConfigI";
import { IN_Protocol, OUT_Protocol } from "../../Classes/DataStructures/Protocol";
import { IN_Medicine } from "../../Classes/DataStructures/Medicine";

interface IFieldedProtocol{
    id?: string, 
    name?: string, 
    medicines?: Array<string>;
}

interface IProtocolsProps{
}

interface IProtocolsState{
    fStt: IState;
    items: Array<IN_Protocol>;
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

    medicines: Array<IN_Medicine>;

    constructor(props: IProtocolsProps){
        super(props);

        this.medicines = [];
        
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
        this.onGather(await srv.get(), await MedicinesSrv.getInstance().get());
    }

    onGather = (data: Array<IN_Protocol>, meds: Array<IN_Medicine>) =>{
        this.medicines = meds;
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
                            value={(()=>{return this.state.item;})()} 
                            onChange={this.onContentChange}
                            lockedFields={[]}
                            badFields={[]}
                            allMeds={this.medicines}/>
                        {this.state.modalData != null? <Modal data={this.state.modalData}/>:null}
                </ElementSample>
                </>
    }
    private fromItemToOption(items: Array<IN_Protocol>){
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
        let item = this.context.getStt().items.find((v) => idx == v.id!.toString());
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: ({
                ...item,
                medicines: item?.medicines.map(v=>v.id)
            }) as IFieldedProtocol
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

        ProtocolsSrv.getInstance().add(stt.item as OUT_Protocol);

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
                content: "El protocolo no se podrá recuperar. ¿desea continuar?",
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
        let item = this.context.getStt().items.find((v) => idx == v.id!.toString());
        this.context.setStt({
            fStt: new ViewState(this.context),
            selectedItem: idx,
            item: ({
                ...item,
                medicines: item?.medicines.map(v=>v.id)
            }) as IFieldedProtocol
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

class MedicinesSrv{
    data = new Array<IN_Medicine>();


    private static entity: MedicinesSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new MedicinesSrv();
        }
        return this.entity
    }

    async get(){
        try {

            const response = await fetch(url + "/medicines", {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
            }); 

        let data = await response.json()

        this.data=data
        return data
        } catch (error) {
            return this.data
        }
  
    }
}

class ProtocolsSrv{
    data = new Array<IN_Protocol>();

    private static entity: ProtocolsSrv | undefined;

    static getInstance(){
        if(this.entity == undefined){
            this.entity = new ProtocolsSrv();
        }
        return this.entity
    }

    async get(){
        try {

            const response = await fetch(url + "/protocols", {
            method: 'GET', 
            mode: 'cors', 
            cache: 'no-cache', 
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

    async add(d: OUT_Protocol){

    try {
        fetch(url + "/protocols", {
        method: 'POST', 
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
            const response = await fetch(url + "/protocols/" + id, {
            method: 'DELETE', 
            mode: 'cors', 
            }); 

        } catch (error) {
            console.log(error)
        }
    }
}



enum Fields{
    NAME = "name"
}

interface ProtocolsContentProps{
    allMeds: Array<IN_Medicine>;
    onChange: (newValue: IFieldedProtocol) => void;
    value: IFieldedProtocol;

    lockedFields: Array<string>;
    badFields: Array<string>;
}

interface ProtocolsContentState{
    headAmmount: number;
    headWeight: number;
}

export class ProtocolsContent extends React.Component<ProtocolsContentProps, ProtocolsContentState>{
    
    headers: Array<string>;
    selMeds: Array<ListRow>;

    constructor(props: ProtocolsContentProps){
        super(props);

        this.headers = ["Nombre", "Presentación (ml)", "Dosis (ml/kg)", "Costo"];
        this.state = {
            headAmmount: 1,
            headWeight: 250
        };
        
        this.selMeds = this.fromMedicineToRows(this.props);
    }

    componentWillUpdate(nextProps: any, nextState: any, nextContext: any){
        this.selMeds = this.fromMedicineToRows(nextProps);
    }

    onNameChange = (name: string, value: string) => {
        let v = Object.assign({}, this.props.value, {
            [name]: value
        });
        this.props.onChange(v);
    }

    onItemChange = (id: string, arrIdx: number, value: string) => {
        /* let medicines = ;
        let newState = Object.assign({}, this.state, {
            rows: this.selMeds.map((v) => {
                if(v.id == id){
                    let old = v.columns[arrIdx];
                    v.columns[arrIdx] = {inputValue: value, type: (old as ListColInput).type};  
                } 
                return v;
            })
        })

        this.setState(newState); */
    }

    onAllSelected = (isSelected: boolean) => {
        let medicines: Array<string> = isSelected? this.props.allMeds.map(v=>v.id): [];
        let newValue = Object.assign({}, this.props.value, {medicines} as IFieldedProtocol)
        this.props.onChange(newValue);
        this.forceUpdate()
    }

    onItemSelected = (id: string, isSelected: boolean) => {        
        let newValue = Object.assign({}, this.props.value);
        if(newValue.medicines == undefined) newValue.medicines = []
        let meds = newValue.medicines!=undefined?newValue.medicines:[];
        
        if(isSelected){
            newValue.medicines?.push(id)
        }
        else{
            newValue.medicines?.splice(meds.findIndex(v=>v==id), 1);
        }
        

        this.props.onChange(newValue);
        this.forceUpdate()
    }

    fromMedicineToRows: (props: ProtocolsContentProps) => Array<ListRow> = (props) => {
        console.log(props.value.medicines);
        
        let meds = props.allMeds.map((v) => {
            console.log(v.id);
            
            return {
                    id: v.id, 
                    columns: [
                        v.name, 
                        v.presentation.toString(), 
                        v.isPerHead? "Por cabeza" : (v.mlApplication / v.kgApplication).toFixed(3),
                        v.cost == null? "0" : v.cost.toString() 
                    ],
                    isSelected: (props.value.medicines != undefined)?props.value.medicines.find((m) => m == v.id) != undefined: false
                } as ListRow;
        })
        return meds;
    }

    getEstimationRows = () => {
        let estRows = new Array<Array<string>>();
        for (let i = 0; i < this.selMeds.length; i++) {
            const el = this.selMeds[i];
            if(el.isSelected != undefined && el.isSelected){
                estRows.push(this.processRow(el.columns))
            }
        }
        return estRows;
    }

    processRow: (cols: Array<(string | ListColInput)>) => Array<string> = (cols) => {
        let row = new Array<string>();

        let usedAmmount = parseFloat(this.getString(cols[2]));
        let maxPresentation = parseFloat(this.getString(cols[1]));

        // Head ml of material used        
        let used = this.state.headAmmount * this.state.headWeight * usedAmmount;        
        let cost = used / maxPresentation * parseFloat(this.getString(cols[3]));

        row.push(this.getString(cols[0]));
        row.push(used.toFixed(4));
        row.push(cost.toFixed(2));

        return row;
    }

    getString: (el: string | ListColInput) => string = (el) => {
        return typeof el == "string"? el: el.inputValue;
    }

    render(): JSX.Element{
        return <>
                <div className="row">
                    <div className="col s12">
                        <div className="elcfg--field--margin">
                            <Input name={Fields.NAME} placeholder="Nombre" value={this.props.value.name} onChange={this.onNameChange}/>
                        </div>
                    </div>
                    <div className="col s6">
                        <div className="elcfg--field--margin">
                            <label>Medicamentos</label>
                            <List 
                                deletable={false} 
                                editable={false} 
                                headers={this.headers} 
                                rows={this.selMeds} 
                                selectable={true} 
                                onChange={this.onItemChange}
                                onAllSelected={this.onAllSelected}
                                onItemSelected={this.onItemSelected}/>
                        </div>
                    </div>
                    <div className="col s6 hide">
                        <div className="elcfg--field--margin">
                            <label>Estimación</label>
                            <Sumer
                                headers={["Nombre", "Cantidad usada", "Costo"]}
                                colTarget={2}
                                resultText="Costo total"
                                rows={this.getEstimationRows()}
                                />
                        </div>
                    </div>
                </div>
                </>
    }
}