export interface IN_User {
    id_user: string 
    name: string 
    email: string
    isEnabled: boolean
}

export interface OUT_User {
    name: string
    email: string
    password: string
}