import {Button, Modal} from "antd";
import styles from "./EditBundleKeyModal.module.css";
import {CloseOutlined} from "@ant-design/icons";
import KeyForm from "../../Forms/KeyForm";
import {useEffect, useState} from "react";
import {IModalKeyEditConfig} from "../../../types/interfaces";


interface IEditBundleKeyModalProps{
    config: IModalKeyEditConfig
    onClose: () => void
}
export default function EditBundleKeyModal({
    config,
    onClose
}:IEditBundleKeyModalProps){

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
                            loading={false}
                            disabled={keyName.trim() === ""}
                            onClick={async () => {

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