import {Button, Modal} from "antd";
import styles from "./EditBundleKeyModal.module.css";
import {CloseOutlined} from "@ant-design/icons";
import KeyForm from "../../Forms/KeyForm";
import {useEffect, useState} from "react";
import {IModalKeyEditConfig} from "../../../types/interfaces";
import {useDispatch, useSelector} from "react-redux";
import keysSelectors from "../../../redux/bundleKeys/bundleKeysSelectors";
import {updateTranslationKey} from "../../../redux/bundleKeys/bundleKeysSlice";
import userSelectors from "../../../redux/user/userSelectors";


interface IEditBundleKeyModalProps{
    bundleId: string
    config: IModalKeyEditConfig
    onClose: () => void
}
export default function EditBundleKeyModal({
    bundleId,
    config,
    onClose
}:IEditBundleKeyModalProps){

    const processLoading = useSelector(keysSelectors.getProcessKeyLoading)
    const userId = useSelector(userSelectors.getUserId)

    const dispatch = useDispatch();

    const [keyName,setKeyName] = useState("");
    const [keyContext,setKeyContext] = useState("");

    useEffect(() => {
        if(!config.isOpen) return

        setKeyName(config.keyInfo.keyName)
        setKeyContext(config.keyInfo.keyContext)

    }, [config]);
    function clearState(){
        setKeyName("")
        setKeyContext("")
    }

    return(
        <Modal
            open={config.isOpen}
            className={styles.root}
            title={null}
            closeIcon={ <CloseOutlined />}
            footer={() => {
                return (
                    <div className={styles.footerWrapper}>
                        <Button
                            className={styles.footerBtn}
                            loading={processLoading}
                            disabled={keyName.trim() === "" || processLoading}
                            onClick={async () => {
                                dispatch(updateTranslationKey(
                                    bundleId,
                                    config.keyInfo.keyId,
                                    {
                                        name: keyName,
                                        description: keyContext,
                                        updatedBy:userId
                                    }
                                ))
                                onClose()
                                clearState()
                            }}
                        >
                            Save
                        </Button>
                    </div>

                )
            }}
            onCancel={() => {
                onClose()
                clearState()
            }}
            style={{
                width: 200,
                height: 150,
            }}
        >
            <KeyForm
                keyName={keyName}
                keyContext={keyContext}
                setKeyName={setKeyName}
                setKeyContext={setKeyContext}
            />
        </Modal>
    )
}