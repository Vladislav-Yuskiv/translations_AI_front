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

export interface IChangePasswordResponse{
    message: string
}

export interface IDefaultResponse{
    message: string
}
export interface IUpdateUserResponse{
    message: string,
    user: IUser
}

export interface IUpdateBundleResponse{
    message: string,
    translationBundle: IBundle
}


export interface IBundleUsersResponse{
    users: IUser[]
}

export interface ICurrentUserResponse extends IUser {
    _id: string
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

export interface IChangePasswordBody{
    email:string,
    newPassword: string
}

export interface ILoginBody{
    email:string,
    password: string
}

export interface ILoginResponse extends ITokens{
    userId: string
}
export interface IUpdateUserBody{
    email: string
    name: string
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
    refreshLoading:boolean
    loginLoading:boolean
    loading: boolean
    isCollapsed: boolean
    showUnsaved: boolean
}

export interface IBundlesState {
   availableBundles: IBundle[]
   currentBundle: IBundle | null
   bundleUsersLoading: boolean
   updateBundleLoading: boolean
   deleteLoading: boolean
   currentBundleUsers: IUser[]
   loading: boolean
}

export interface IBundle {
    _id: string;
    users: string[];
    category:  string;
    description: string;
    apiKey: string;
    name: string;
}
export interface IRootState{
    session: ISessionState
    bundles: IBundlesState
}