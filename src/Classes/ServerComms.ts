import { RefObject } from "react";
import { LoadingScreen } from "../Components/LoadingScreen";

export interface ServerResponse<TSucc>{
    success: boolean
    content: ServerError | TSucc
}

export interface ServerError{
    status: number
    message: string
}

export class ServerComms {
    private static inst: ServerComms | null = null;
    private static prodUrl = "http://52.7.201.184:8070/api";
    private static sandUrl = "http://localhost:8070/api";
    private static isProd: boolean = false;
    
    static getInstance(){
        if(this.inst == null){
            this.inst = new ServerComms();
        }
        return this.inst
    }

    static set isProduction(isProd: boolean){
        this.isProd = isProd
    }

    static get url(){
        return this.isProd?this.prodUrl:this.sandUrl;
    }

    // Instance
    private constructor() {}

    async get<TResponse>(endpoint: string, data: any = {}){
        let url = new URL(ServerComms.url + endpoint);
        url.search = new URLSearchParams(data).toString();
        let dir = url.href;

        let resp = await this.endpointCommon<TResponse>(dir, undefined, "get");
        return resp;
    }

    async post<TResponse>(endpoint: string, data: any = {}){
        let dir = ServerComms.url + endpoint;
        let resp = await this.endpointCommon<TResponse>(dir, data, "post");
        return resp;
    }

    async put<TResponse>(endpoint: string, data: any = {}){
        let dir = ServerComms.url + endpoint;
        let resp = await this.endpointCommon<TResponse>(dir, data, "put");
        return resp;
    }

    async delete<TResponse>(endpoint: string, data: any = {}){
        let dir = ServerComms.url + endpoint;
        let resp = await this.endpointCommon<TResponse>(dir, data, "delete");
        return resp;
    }

    private async endpointCommon<TResponse>(url:string, data:any, method: string, ){
        let returnData: ServerResponse<TResponse> | undefined;
        
        let awFetch = fetch(url, 
            this.fetchOptions(method, data)); 
        try{
            let response = await awFetch;
            if(response.ok){
                returnData = {
                    success: true,
                    content: await response.json() as TResponse
                } as ServerResponse<TResponse>;
            }
            else{
                returnData = {
                    success: false,
                    content: {
                        message: await response.text(),
                        status: response.status
                    } as ServerError
                } as ServerResponse<TResponse>;
            }
            
        }
        catch(e){
            returnData = {
                success: false,
                content: {
                    message: "Error en conexion",
                    status: -1
                } as ServerError
            } as ServerResponse<TResponse>;            
        }
        finally{
            return returnData ?? {
                success: false,
                content: {
                    message: "Error interno",
                    status: -0
                } as ServerError
            } as ServerResponse<TResponse>;;
        }
    }

    private fetchOptions(method: string, body:string|undefined){
        return ({
            method, 
            body,
            mode: 'cors', 
            cache: 'no-cache', 
            credentials: "include",
            headers:{
                'Content-Type': 'application/json'
            }
        } as RequestInit);
    }
}