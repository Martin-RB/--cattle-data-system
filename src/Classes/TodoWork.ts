export class TodoWork{
    private _text: string;
    private _route: string;

    constructor(text: string, route: string){
        this._text = text;
        this._route = route;
    }

    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;
    }

    public get route(): string {
        return this._route;
    }
    public set route(value: string) {
        this._route = value;
    }
}