export interface OUT_User {
    id_user: string 
    name: string 
    email: string
    isEnabled: boolean
}

export interface IN_User {
    name: string
    email: string
    password: string
}

export interface OUT_User_email {
    email: string
    password: string
}

export interface IN_UserLogin {
    name: string
    password: string
}
