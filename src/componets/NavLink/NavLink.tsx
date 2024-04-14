import {ReactNode} from "react";
import {NavLink} from "react-router-dom";
import styles from "./NavLink.module.css"
interface INavLinkItemProps{
    to: string
    Icon?: ReactNode
    text: string
}
export default function NavLinkItem({to,text,Icon}:INavLinkItemProps){
    return(
        <NavLink
            to={to}
            className={styles.linkWrapper}
            style={ ({isActive,isTransitioning,isPending}) => ({
                color: (isActive || isTransitioning || isPending) ? "rgba(103, 32, 255)" : "#000000"
            })}
        >
            {Icon && <>{Icon}</>}

            {text}
        </NavLink>
    )
}