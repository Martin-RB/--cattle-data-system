import React from "react";
import { IMedicine } from "~/Classes/DataStructures/Medicine";

interface RegisterLorryState{
    origin: Array<IMedicine>;
}

interface RegisterLorryProps{

}

export class RegisterLorry extends React.Component<RegisterLorryProps, RegisterLorryState>{
    private controller: RegisterLorryController<RegisterLorryState>;
    constructor(props: RegisterLorryProps){
        super(props);

        this.state = {
            origin: []
        }

        this.controller = new RegisterLorryController<RegisterLorryState>(this.state);
    }


}

class RegisterLorryController<State>{
    private state: RegisterLorryState;
    constructor(state: RegisterLorryState){
        this.state = state;
    }


}