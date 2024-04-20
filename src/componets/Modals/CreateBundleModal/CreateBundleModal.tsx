import {Modal} from "antd";

interface ICreateBundleModalProps{
    isOpen: boolean
    onClose: boolean
    onSubmit: () => Promise<void>
}
export default function CreateBundleModal({isOpen, onClose, onSubmit}:ICreateBundleModalProps){

    return (
        <Modal

        >

        </Modal>
    )
}