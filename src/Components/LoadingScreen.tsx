import React from "react";
import { Preloader } from "../../node_modules/react-materialize/lib/index";

export interface LoadingScreenProps{
    visible: boolean
}

interface LoadingScreenState{
    dots: string
}

export class LoadingScreen extends React.Component<LoadingScreenProps, 
                                            LoadingScreenState>{
    interval: NodeJS.Timeout | null;

    constructor(props: LoadingScreenProps){
        super(props);
        this.interval = null;
        this.state = {
            dots: ""
        }
    }

    componentDidMount(){
        this.interval = setInterval(()=>{
            if(this.state.dots.length == 3){
                this.setState({
                    dots: ""
                })
            }
            else{
                this.setState({
                    dots: this.state.dots+"."
                })
            }
        }, 500)
    }

    componentWillUnmount(){
        clearInterval(this.interval!);
    }

    render(){
        return (
            <div className={`load--background ${this.props.visible?"":"hidden"}`}>
                <div className="load">
                    <div className="load--container">   
                        <Preloader 
                            active
                            color="blue"
                            className="load--entity"/>
                    </div>
                    <p className="load-title">Cargando</p>
                    <p className="load-subtitle">Por favor espere{this.state.dots}</p>
                </div>
            </div>
        )
    }
}