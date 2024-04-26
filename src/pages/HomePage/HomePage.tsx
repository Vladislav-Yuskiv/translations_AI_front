import styles from "./HomePage.module.css"
import HeaderWithContent from "../../componets/HeaderWithContent";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {userSelectors} from "../../redux/user";
import {HeaderPage} from "../../componets/StyledComponents";
import bundlesSelectors from "../../redux/bundles/bundlesSelectors";
import Loader from "../../componets/Loader";
import {bundleKeysSelectors} from "../../redux/bundleKeys";
import {IBundle} from "../../types/interfaces";
import {Spin} from "antd";
export default function HomePage(){
    document.title = "Translatic | Home";
    
    const bundlesLoading = useSelector(bundlesSelectors.getLoading);
    const currentBundle = useSelector(bundlesSelectors.getCurrentBundle);
    const keysInfo = useSelector(bundleKeysSelectors.getKeysInfo);
    const keysLoading = useSelector(bundleKeysSelectors.getKeysInfoLoading);


    const [countLoading, setCountLoading] = useState(false);
    const [bundlesKeysCount, setBundleKeysCount] = useState(0);
    const [translatedLanguages, setTranslatedLanguages] = useState(0);


    useEffect(() => {
        if(!currentBundle) return

        if(keysInfo[currentBundle._id]){
            setInfo(currentBundle)
        }
    }, [currentBundle,keysInfo]);


    function setInfo(bundle:IBundle) {
        setCountLoading(true)
        const InfoForThisBundle = keysInfo[bundle._id];
        setBundleKeysCount(InfoForThisBundle.totalCount)
        setTranslatedLanguages(bundle.translatedLanguages.length)
        setCountLoading(false)
    }


    return(
        <HeaderWithContent>
            <div className={styles.wrapper}>
                <HeaderPage>Overview</HeaderPage>
                {
                    bundlesLoading ? (
                        <Loader/>
                    )
                    : (
                       <div className={styles.container}>
                           <div className={styles.infoBlockWrapper}>
                               <div className={styles.infoBlockItem}>
                                   <p className={styles.infoBlockLabel}>
                                       Total keys
                                   </p>
                                   {
                                       keysLoading || countLoading
                                            ? <Spin size={"large"} style={{marginTop: 15}}/>
                                           :  (
                                               <p className={styles.infoBlockValue}>
                                                   {bundlesKeysCount}
                                               </p>
                                           )
                                   }

                               </div>
                               <div className={styles.infoBlockItem}>
                                   <p className={styles.infoBlockLabel}>
                                       Total translated languages
                                   </p>
                                   {
                                       keysLoading || countLoading
                                           ? <Spin size={"large"} style={{marginTop: 15}}/>
                                           :  (
                                               <p className={styles.infoBlockValue}>
                                                   {translatedLanguages}
                                               </p>
                                           )
                                   }
                               </div>
                           </div>
                       </div>
                    )

                }

            </div>
        </HeaderWithContent>
    )
}