import styles from "./HomePage.module.css"
import HeaderWithContent from "../../componets/HeaderWithContent";
import {useEffect} from "react";
import {getBundles} from "../../redux/bundles/bundleSlice";
import {useDispatch, useSelector} from "react-redux";
import {userSelectors} from "../../redux/user";
import {HeaderPage} from "../../componets/StyledComponents";
import bundlesSelectors from "../../redux/bundles/bundlesSelectors";
export default function HomePage(){
    document.title = "Translatic | Home";

    const dispatch = useDispatch();

    const userId = useSelector(userSelectors.getUserId)

    const bundlesLoading = useSelector(bundlesSelectors.getLoading)


    useEffect(() => {
        console.log("refust")
        if(bundlesLoading) return

        dispatch(getBundles())
    }, [userId]);

    return(
        <HeaderWithContent>
            <div className={styles.wrapper}>
                <HeaderPage>Home</HeaderPage>
            </div>
        </HeaderWithContent>
    )
}