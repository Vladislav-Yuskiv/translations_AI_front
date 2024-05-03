import {Button, Modal} from "antd";
import styles from "./UploadModal.module.css"
import {CloseOutlined} from "@ant-design/icons";
import {useState} from "react";
import ReactCountryFlag from "react-country-flag";
import * as locale from "locale-codes";

interface IUploadModalProps{
    isOpen: boolean
    onClose: () => void
    languageTag: string
}
export default function UploadModal({
                                        isOpen,
                                        onClose,
                                        languageTag,
 }:IUploadModalProps){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    function clearState() {

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
                            loading={loading}
                            disabled={loading}
                            onClick={async () => {
                                onClose()
                                clearState()
                            }}
                        >
                            {`Upload file`}
                        </Button>
                        {
                            error && (
                                <p className={styles.errorText}>Error in uploading file.Try again!</p>
                            )
                        }
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
            <div className={styles.wrapper}>
                <div className={styles.titleWrapper}>
                    <p className={styles.title}>Upload your file</p>
                </div>
                <div className={styles.infoWrap}>
                    <div className={styles.langWrap}>
                        <ReactCountryFlag
                            countryCode={languageTag === "en" ? "US" : languageTag.toUpperCase()}
                            style={{fontSize: 24}}
                        />
                    </div>

                    <p> Language -
                        <span className={styles.accentColor}>{locale.where('tag', languageTag)?.name || ""}</span>
                    </p>
                </div>
            </div>
        </Modal>
    )
}