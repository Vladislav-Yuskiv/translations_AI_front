import {useMediaQuery} from "@mui/material";
import {ReactNode} from "react";
import Sidebar from "../Sidebar";
import BurgerMenu from "../BurgerMenu";

export default function HeaderWithContent({children }:{children:ReactNode}){

    const isAtLeastTable = useMediaQuery('(min-width:768px)');

    if(isAtLeastTable){
        return(
            <Sidebar>
                {children}
            </Sidebar>
        )
    }else{
       return(
           <BurgerMenu>
               {children}
           </BurgerMenu>
       )
    }

}