import React from "react";
import { DropDown } from "../Components/DropDown";
import head from "./../../img/head.png";
import vaquita from "./../../img/vaquita.svg";
import alot from "./../../img/alot.png";
import { HISTORY, toast } from "../App";
import { IOption } from "../Classes/IOption";

export interface HomeProps{

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

	onSubmitSearch = () => {
		toast("Submited " + this.state.search);
	}

	onCancelSearch = () => {
		this.setState({
			search: ""
		})
	}

	onOptionClicked = (type: "head"|"alot", id: string, option: string) => {
		switch(type){
			case "alot":
				if(option == "detail"){
					alert(`${type} ${option}`)
				}
				else if(option == "sell"){
					//alert(`${type} ${option}`)
					HISTORY.push("/menu/sell-alot", {idAlot: 1})
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



		return (
		<>
		<nav className="search-bar">
		<div className="nav-wrapper">
		<form onSubmit={(e) => {
			e.preventDefault();
			this.onSubmitSearch()
		}}>
			<div className="input-field">
				<input id="search" type="search"
					required value={this.state.search} onChange={(v)=>
					this.setState({search: v.target.value})
				} onKeyUp={(v)=>{
					console.log(v.keyCode);
					
				}}/>
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

			{new Array(10).fill("").map((_,i) => this.itemToJSX({
				id: i.toString(),
				subtitle: (Math.random() * 1000).toString(),
				title: (Math.random() * 1000).toString(),
				type: Math.random() > 0.5?"alot":"head"
			}))}

			{this.itemToJSX({id:"1", subtitle: "asd",title:"2", type: "head"})}
		</>
		)
	}

	itemToJSX = (item: SearchItem) => {
		let isH = item.type == "head";
		let dropdownOptions : Array<IOption> = isH?
				[{key:"detail", name: ":web_asset:"}]:
				[{key:"sell", name: ":attach_money:"},{key:"detail", name: ":web_asset:"}];
		return 	<div key={item.id} className="search-item search-item-grid">
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
						{/* Opcion generalizada de "Detalles" */}
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
	}
}

interface SearchItem{
	type: "head" | "alot"
	title: string
	subtitle: string
	id: string
}