import styles from "./ExpandedItemTable.module.css"
import moment from "moment";
import {useEffect, useState} from "react";
import {Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import bundlesSelectors from "../../redux/bundles/bundlesSelectors";
import {getUsersByBundleId} from "../../redux/bundles/bundleSlice";
import { WarningFilled} from "@ant-design/icons";

interface IExpandedItemTableProps{

    initialKeyInfo:{
        name: string,
        description:string
        createdAt: string
        updatedAt: string
        createdBy: string
        updatedBy: string
    }

    initialValueInfo: {
        value: string
        valueCreatedAt: string
        valueUpdatedAt: string
        valueAddedBy:string
        valueUpdatedBy: string
    }

}

interface IKeyDetails {
    keyCreatorName: string,
    keyModifiedBy: string,
}

interface IValueDetails {
    value: string,
    valueCreatorName: string,
    valueModifiedBy: string
    valueCreatedAt: string,
    valueUpdatedAt: string,
}
const initialKeyDetailsInfo:IKeyDetails = {
    keyCreatorName: "",
    keyModifiedBy: "",
}

const initialValueDetailsInfo:IValueDetails = {
    value: "",
    valueCreatorName: "",
    valueModifiedBy: "",
    valueCreatedAt: "",
    valueUpdatedAt:""
}

export default function ExpandedItemTable({
    initialKeyInfo,
    initialValueInfo
}:IExpandedItemTableProps){

    const dispatch = useDispatch();

    const usersByBundleId = useSelector(bundlesSelectors.getCurrentBundleUsers);
    const currentBundle = useSelector(bundlesSelectors.getCurrentBundle)
    const bundleUsersLoading = useSelector(bundlesSelectors.getBundleUsersLoading);

    const [infoKeyLoading, setInfoKeyLoading] = useState(true);
    const [info, setInfo] = useState<IKeyDetails>(initialKeyDetailsInfo)

    const [infoValueLoading, setInfoValueLoading] = useState(true);
    const [infoValue, setInfoValue] = useState<IValueDetails>(initialValueDetailsInfo);

    useEffect(() => {
        if(!currentBundle) return

        dispatch(getUsersByBundleId(currentBundle._id))
    }, []);

    useEffect(() => {
        if(!currentBundle) return

        const keyCreator = usersByBundleId.find(user => user._id === initialKeyInfo.createdBy)
        const keyModifiedBy = usersByBundleId.find(user => user._id === initialKeyInfo.updatedBy)

        setInfo({
            keyCreatorName: keyCreator?.name || "Unknown",
            keyModifiedBy: keyModifiedBy?.name || "Unknown"
        })

        setInfoKeyLoading(false)


    }, [usersByBundleId,initialKeyInfo]);

    useEffect(() => {
        if(!initialValueInfo || !usersByBundleId) return

        const valueCreator = usersByBundleId.find(user => user._id === initialValueInfo.valueAddedBy)
        const valueModifiedBy = usersByBundleId.find(user => user._id === initialValueInfo.valueUpdatedBy)

        setInfoValue({
            valueCreatedAt: initialValueInfo.valueCreatedAt,
            valueUpdatedAt: initialValueInfo.valueUpdatedAt,
            valueCreatorName: valueCreator?.name || "Unknown",
            valueModifiedBy: valueModifiedBy?.name || "Unknown",
            value: initialValueInfo.value
        })

        setInfoValueLoading(false)

    }, [initialValueInfo,usersByBundleId]);

    return(
        <div className={styles.wrapper}>

            <div className={styles.keyInfoWrapper}>
               <p  className={styles.blockTitle}>Key details: </p>
                <div>

                    <LabelItem
                        title={"Name:"}
                        value={initialKeyInfo.name}
                        loading={false}
                    />

                    <LabelItem
                        title={"Context:"}
                        value={initialKeyInfo.description}
                        loading={false}
                    />

                    <LabelItem
                        title={"Creator:"}
                        value={info.keyCreatorName}
                        loading={infoKeyLoading || bundleUsersLoading}
                    />

                    <LabelItem
                        title={"Created at:"}
                        value={moment(initialKeyInfo.createdAt).format("DD-MM-YY")}
                        loading={false}
                    />

                    <LabelItem
                        title={"Modified by:"}
                        value={info.keyModifiedBy}
                        loading={infoKeyLoading || bundleUsersLoading}
                    />

                    <LabelItem
                        title={"Updated at:"}
                        value={moment(initialKeyInfo.updatedAt).format("DD-MM-YY")}
                        loading={false}
                    />

                </div>
            </div>

            <div className={styles.valueInfoWrapper}>
                <p  className={styles.blockTitle}>Value details: </p>

                    <LabelItem
                        title={"Value:"}
                        value={infoValue.value}
                        loading={false}
                    />

                    <LabelItem
                        title={"Creator:"}
                        value={infoValue.valueCreatorName}
                        loading={infoValueLoading || bundleUsersLoading}
                    />

                    <LabelItem
                        title={"Created at:"}
                        value={moment(infoValue.valueCreatedAt).format("DD-MM-YY")}
                        loading={false}
                    />

                    <LabelItem
                        title={"Modified by:"}
                        value={infoValue.valueModifiedBy}
                        loading={infoValueLoading || bundleUsersLoading}
                    />

                    <LabelItem
                        title={"Updated at:"}
                        value={moment(infoValue.valueUpdatedAt).format("DD-MM-YY")}
                        loading={false}
                    />

            </div>

        </div>
    )
}

interface ILabelItemProps {
    title: string,
    loading:boolean,
    value: string
}

function LabelItem({
    title,
    loading,
    value
}:ILabelItemProps){

    return(
        <p className={styles.labelTitle}>
            {title}
            {
                loading
                    ? <Spin size={"small"} className={styles.spin}/>
                    : (
                            value.trim() === ""
                                    ?  <WarningFilled style={{color:"red", marginLeft: 5}} />
                                    :  <span className={styles.accentValue}>{value}</span>

                    )
            }

        </p>
    )
}