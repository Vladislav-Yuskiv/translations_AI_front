export interface IUser{
    name: string
    email: string
    access_level: string
}

export interface ISessionState {
    user: IUser
    isLoggedIn: boolean
    loading: boolean
}
export interface IRootState{
    session: ISessionState
}