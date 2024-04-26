import {Button, Modal} from "antd";
import styles from "./CreateEditKeyModal.module.css"
import {CloseOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useSelector} from "react-redux";
import keysSelectors from "../../../redux/bundleKeys/bundleKeysSelectors";
import KeyForm from "../../Forms/KeyForm";

interface ILanguageOption{
    label: string
    value:string
}
interface ICreateKeyModalModal{
    isOpen: boolean
    onClose: () => void
    translatedLanguages: ILanguageOption[]
}
export default function CreateEditKeyModal({
    onClose,
    translatedLanguages,
    isOpen,
 }:ICreateKeyModalModal){

    const processLoading = useSelector(keysSelectors.getProcessKeyLoading)

    const [keyName, setKeyName] = useState("");
    const [keyContext, setKeyContext] = useState("");

    function clearState() {
        setKeyName("")
        setKeyContext("")
    }


    return(
        <Modal
            open={isOpen}
            className={styles.root}
            title={null}
            closeIcon={ <CloseOutlined />}
            footer={() => {
                return (
                    <div className={styles.footerWrapper}>
                        <Button
                            className={styles.footerBtn}
                            loading={processLoading}
                            disabled={
                                keyName.trim() === "" ||
                                processLoading
                            }
                            onClick={async () => {
                                clearState()
                            }}
                        >
                           Create new key
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
                setKeyName={ v => setKeyName(v)}
                setKeyContext={v => setKeyContext(v)}
            />
        </Modal>
    )
}