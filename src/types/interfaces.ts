import {AxiosRequestConfig, Method} from "axios";

export interface IUser{
    id:string
    name: string
    email: string
    access_level: string
}

export interface ISignUpResponse extends ITokens{
    id: string
}

export interface ITokens{
    accessToken:string,
    refreshToken: string
}
export interface ISignUpBody{
    email:string,
    name: string
    password: string
}
export interface IAxiosFetchWithTokenRefresh{
    method: Method,
    url: string,
    data?: any; // Request body
    options?: Partial<AxiosRequestConfig>
}

export interface ISessionState {
    user: IUser
    isLoggedIn: boolean
    loading: boolean
    isCollapsed: boolean
}
export interface IRootState{
    session: ISessionState
}