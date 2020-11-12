export interface IN_User {
    id_user: string 
    name: string 
    email: string
}

export interface OUT_User {
    name: string
    email: string
    password: string
}

export interface OUT_User_email {
    email: string
    password: string
}

export interface OUT_User_name {
    name: string
    password: string
}
