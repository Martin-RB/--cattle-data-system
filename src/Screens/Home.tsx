import React from "react";
import { DropDown } from "../Components/DropDown";
import head from "./../../img/head.jpg";
import alot from "./../../img/alot.png";
import { HISTORY,  toast, toggleLoadingScreen } from "../App";
import { IOption } from "../Classes/IOption";
import { RouteComponentProps } from "react-router-dom";
import { IN_Alot } from "../Classes/DataStructures/Alot";
import { IN_Head } from "../Classes/DataStructures/Head";
import { IN_Corral } from "../Classes/DataStructures/Corral";
import url from "./ConfigI";
import { ServerComms, ServerError, ServerResponse } from "../Classes/ServerComms";

export interface HomeProps extends RouteComponentProps{

}

interface HomeState{
	search: string
	searchItems: Array<SearchItem>
}

export class Home extends React.Component<HomeProps, HomeState>{

	constructor(props: HomeProps){
		super(props);

		this.state = {
			search: "",
			searchItems: []
		}		
	}

	onSubmitSearch = async () => {
		toggleLoadingScreen(true);
		type Return = {
			alots: IN_Alot[], heads: IN_Head[], corrals: IN_Corral[]
		}

		let response = await ServerComms
						.getInstance()
						.get<Return>("/search", {search: this.state.search});
		if(response.success){
			let data = response.content as Return

			let alots = data.alots;
			let heads = data.heads

			let sHeads: SearchItem[] = heads.map(v => ({type: "head", data: v} as SearchItem));
			let sAlot: SearchItem[] = alots.map(v => ({type: "alot", data: v} as SearchItem));
			let searchItems = [...sAlot, ... sHeads]
			
			this.setState({
				searchItems
			})
		}
		else{
			toast((response.content as ServerError).message)
		}
		toggleLoadingScreen(false);
	}

	onCancelSearch = () => {
		this.setState({
			search: ""
		})
	}

	onOptionClicked = (type: "head"|"alot", idx: string, option: string) => {
		switch(type){
			case "alot":
				if(option == "detail"){
					alert(`${type} ${option}`)
				}
				else if(option == "sell"){
					let id = this.state.searchItems[parseInt(idx)].data.id
					this.props.history.push("/menu/sell-alot", {idAlot: id})
				}
				break;
			case "head":
				if(option == "detail"){
					alert(`${type} ${option}`)
				}
				break;
		}
	}

	render() : JSX.Element{

		let srch = this.state.searchItems.map((v,i) => this.itemToJSX(v, i));

		return (
		<>
		<nav className="search-bar">
		<div className="nav-wrapper">
		<form onSubmit={(e) => {
			e.preventDefault();
			this.onSubmitSearch()
		}}>
			<div className="input-field">
				<input id="search" 
					type="search"
					required 
					value={this.state.search} 
					onChange={(v)=>
						this.setState({search: v.target.value})
					}/>
				<label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
				<i className="material-icons" onClick={this.onCancelSearch}>close</i>
			</div>
		</form>
		</div>
		</nav>
			{/* (new Array(10)).fill("").map((_,i) => <div key={i.toString()} className="search-item">
				<div className="search-item--icon">
					<img src={head} className="top-nav--logo-img--sizing"/>
				</div>
				<div>
					<span className="search-item--title">54312252</span>
					<span>(44545)</span>
				</div>
				<div className="search-item--options">
					<div className="search-item--option hide-on-small-only"></div>
					<div className="search-item--option hide-on-small-only"></div>
					<div className="search-item--option hide-on-small-only"></div>
					<div className="search-item--option hide-on-small-only"></div>

					<DropDown className="hide-on-med-and-up" 
							content={[{key:"123", name: "xd"}]} onClick={
						(e) => {alert(e)}
					}/>
				</div>
				
				<div className="search-item--description">
					<span>OK</span><span>Femenino</span><span>Lote 44</span><span>Corral 20</span>
				</div>
			</div>) */}

			{srch}

			{/* {this.itemToJSX({id:"1", subtitle: "asd",title:"2", type: "head"})} */}
		</>
		)
	}

	headToJSX = (v: IN_Head, i: number) => {
		return <div key={i.toString()} className="search-item search-item-grid">
					<div className="search-item--icon">
						<img src={head} className="top-nav--logo-img--sizing"/>
					</div>
					<div>
						<span className="search-item--title search-item--title--fontSize">{v.siniga}</span>
						<span className="search-item--subtit search-item--subtit--fontSize">({v.idLocal})</span>
					</div>
					<div className="search-item--options">
						{/* Opcion generalizada de "Detalles" */}
{/* 						<div className="search-item--option hide-on-small-only"
							onClick={() => this.onOptionClicked("head", i.toString(), "detail")}>
								<i className="material-icons">web_asset</i>
						</div> */}

						{/* <DropDown className="hide-on-med-and-up" 
									content={dropdownOptions} 
									onClick={
										(e) => {this.onOptionClicked(item.type, item.id, e)}
									}
						/> */}
					</div>
					
					<div className="search-item--description">
						<span>OK</span><span>{v.sex}</span><span>{v.alotName}</span><span>{v.corralName}</span>
					</div>
				</div>
	}

	alotToJSX = (v: IN_Alot, i: number) => {
		let dropdownOptions : Array<IOption> = 
				[{key:"sell", name: ":attach_money:"}];
		return <div key={i.toString()} className="search-item search-item-grid">
					<div className="search-item--icon">
						<img src={alot} className="top-nav--logo-img--sizing"/>
					</div>
					<div>
						<span className="search-item--title search-item--title--fontSize">{v.name}</span>
						<span className="search-item--subtit search-item--subtit--fontSize">({v.hostCorral?.name})</span>
					</div>
					<div className="search-item--options">

						<div className="search-item--option hide-on-small-only"
								onClick={() => this.onOptionClicked("alot", i.toString(), "sell")}>
									<i className="material-icons">attach_money</i>
							</div>
						{/* Opcion generalizada de "Detalles" */}
{/* 						<div className="search-item--option hide-on-small-only"
							onClick={() => this.onOptionClicked(item.type, item.id, "detail")}>
								<i className="material-icons">web_asset</i>
						</div> */}

						<DropDown className="hide-on-med-and-up" 
									content={dropdownOptions} 
									onClick={
										(e) => {this.onOptionClicked("alot", i.toString(), e)}
									}
						/>
					</div>
					
					<div className="search-item--description">
								<span>OK</span><span>{v.sex}</span><span>{v.headNum} / {v.maxHeadNum}</span><span>{v.arrivalProtocol?.name}</span>
					</div>
				</div>
	}

	itemToJSX = (item: SearchItem, idx: number) => {
		console.log("item");
		
		return (item.type == "head")? this.headToJSX(item.data as IN_Head, idx): this.alotToJSX(item.data as IN_Alot, idx)
	}
	/* itemToJSX = (item: SearchItem, idx: number) => {
		return (item.type == "head")? this.headToJSX(item.data as IN_Head, idx)
		let isH = item.type == "head";
		let va = item.data
		let dropdownOptions : Array<IOption> = isH?
				[{key:"detail", name: ":web_asset:"}]:
				[{key:"sell", name: ":attach_money:"},{key:"detail", name: ":web_asset:"}];
		return 	<div key={idx.toString()} className="search-item search-item-grid">
					<div className="search-item--icon">
						<img src={isH?head:alot} className="top-nav--logo-img--sizing"/>
					</div>
					<div>
						<span className="search-item--title search-item--title--fontSize">{item.title}</span>
						<span className="search-item--subtit search-item--subtit--fontSize">({item.subtitle})</span>
					</div>
					<div className="search-item--options">

						{isH?
							// Reemplazar por opciones para cabeza
							null:
							// Reemplazar por opciones para lotes
							<div className="search-item--option hide-on-small-only"
								onClick={() => this.onOptionClicked(item.type, item.id, "sell")}>
									<i className="material-icons">attach_money</i>
							</div>
						}
						// Opcion generalizada de "Detalles"
						<div className="search-item--option hide-on-small-only"
							onClick={() => this.onOptionClicked(item.type, item.id, "detail")}>
								<i className="material-icons">web_asset</i>
						</div>

						<DropDown className="hide-on-med-and-up" 
									content={dropdownOptions} 
									onClick={
										(e) => {this.onOptionClicked(item.type, item.id, e)}
									}
						/>
					</div>
					
					<div className="search-item--description">
						<span>OK</span><span>Femenino</span><span>Lote 44</span><span>Corral 20</span>
					</div>
				</div>
	} */
}

interface SearchItem{
	type: "head" | "alot"
	data: IN_Alot | IN_Head
}