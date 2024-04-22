import {Modal} from "antd";
import styles from "./AreYouSureModal.module.css"
interface IAreYouSureModalProps{
    title: string
    isOpen:boolean
    onClose: () => void
    onSubmit: () => void
}
export default function AreYouSureModal({isOpen,title,onSubmit,onClose}:IAreYouSureModalProps){

    return(
        <Modal
            open={isOpen}
            okButtonProps={{
                className: styles.okBtn
            }}
            cancelButtonProps={{
                className: styles.cancelBtn
            }}
            title={title}
            closeIcon={null}
            onOk={onSubmit}
            onCancel={onClose}
            style={{
                width: 200,
                height: 150
            }}
        />

    )
}