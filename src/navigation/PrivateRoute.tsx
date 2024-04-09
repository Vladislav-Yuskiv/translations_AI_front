import { useSelector } from "react-redux";
import { userSelectors } from "../redux/user";
import { Navigate } from "react-router-dom";
import {ReactNode} from "react";

interface IPrivateRouteProps {
    children: ReactNode
    redirectTo?:string
}

export default function PrivateRoute({ children, redirectTo = "/" }:IPrivateRouteProps) {
    const isLoggedIn = useSelector(userSelectors.getLoginStatus);
    return isLoggedIn ? <>{children}</> : <Navigate to={redirectTo} />;
}
