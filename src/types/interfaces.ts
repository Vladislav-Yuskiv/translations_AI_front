import {AxiosRequestConfig, Method} from "axios";

export interface IUser{
    id:string
    _id?: string
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

export interface IUpdateKeyResponse extends IDefaultResponse{
    translationKey: IBundleKy
}

export interface IUpdateKeyValueResponse extends IDefaultResponse{
    translationKeyValue: IBundleKeyValue
}

export interface IAddLanguageToBundleBody{
    userId: string
    languageName:string
    language: string
    needToTranslate: boolean
}
export interface IAddLanguageToBundleResponse extends IDefaultResponse{
    info: {
        language: string
    }
}

export interface IBundleCreateResponse extends IDefaultResponse{
    bundle: IBundle
}
export interface IDeleteUserFromBundleResponse extends IDefaultResponse{
    userId: string
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

export interface IBundleCreateBody{
    name:string,
    description: string
    category: string
    createKeys: boolean
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
    data?: any;
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

export interface IBundleInfoResponse{
    totalCount: number
}
export interface IBundleKeysState {
    keysLoading: boolean
    keysInfoLoading: boolean
    processKeyLoading: boolean
    keysInfo: {
        [key:string]: {
            totalCount: number
        }
    }
    pagination: {
        [key:string]: {
            page: number,
            limit: number
        }
    }
    keys: {
        [key: string]: IBundleKy[]
    }
}

export interface IBundlesKeysValuesState{
    keysValues: IBundleKeyValue[]
    keysValuesLoading: boolean
    keyValueProcessing: boolean
}

export interface IBundleKeyValue{
    _id: string
    value: string,
    language: string,
    updatedUser: string,
    addedUser: string,
    translation_key: string,
    createdAt: string,
    updatedAt: string
}

export interface IModalKeyEditConfig{
    isOpen: boolean
    keyInfo: {
        keyId: string
        keyName: string
        keyContext:string
    }

}

export interface IModalKeyValueEditConfig{
    isOpen: boolean
    valueInfo: {
        keyId: string
        keyName: string
        keyDescription: string
        language: string
        valueId:string
        value:string
    }

}
export interface IBundleKy{
    _id: string
    name:string
    description: string
    createdBy: string,
    updatedBy: string,
    updatedAt: string
    createdAt: string
    translationBundle:string
}

export interface IBundlesState {
   availableBundles: IBundle[]
   currentBundle: IBundle | null
   modalCreate: boolean
   creatingLoading: boolean
   bundleUsersLoading: boolean
   updateBundleLoading: boolean
   creatingNewLanguageLoading: boolean
   deleteLoading: boolean
   currentLanguageForBundle: {
       [key:string]: string
   }
   currentBundleUsers: IUser[]
   loading: boolean
   isWarningAlert: boolean
   deletingLanguage: boolean
}

export interface IBundle {
    _id: string;
    users: string[];
    category:  string;
    description: string;
    apiKey: string;
    translatedLanguages: string[]
    name: string;
}

export interface IRootState{
    session: ISessionState
    bundles: IBundlesState
    keys: IBundleKeysState
    bundlesKeysValues: IBundlesKeysValuesState
}