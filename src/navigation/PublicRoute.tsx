import {useSelector} from "react-redux";
import {userSelectors} from "../redux/user";
import {Navigate} from "react-router-dom";
import {ReactNode} from "react";

interface IPublicRouteProps {
    children: ReactNode
    restricted?: boolean
    redirectTo?:string
}
export default function PublicRoute({
                                        children,
                                        restricted = false,
                                        redirectTo = "/",
                                    }: IPublicRouteProps) {
    const isLoggedIn = useSelector(userSelectors.getLoginStatus);
    const shouldRedirect = isLoggedIn && restricted;
    return shouldRedirect ? <Navigate to={redirectTo} /> : <>{children}</>;
}
