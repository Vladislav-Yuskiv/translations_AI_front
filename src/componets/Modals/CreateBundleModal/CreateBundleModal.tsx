import {Button, Modal, Select, SelectProps} from "antd";
import styles from "./CreateBundleModal.module.css";
import {CloseOutlined} from "@ant-design/icons";
import AntdInput from "../../AntdInput";
import {useState} from "react"
import TextArea from "antd/es/input/TextArea";
import {useSelector} from "react-redux";
import {bundlesSelectors} from "../../../redux/bundles";
import {IBundleCreateBody} from "../../../types/interfaces";

const categoryOptions: SelectProps['options'] = [
    {label:"Business",value:"Business"},
    {label:"Music",value:"Music"},
    {label:"Finance",value:"Finance"},
    {label:"Education",value:"Education"},
    {label:"Other",value:"other"},
];

interface ICreateBundleModalProps{
    isOpen: boolean
    onClose: () => void
    onSubmit: (payload:IBundleCreateBody) => Promise<void>
}
export default function CreateBundleModal({isOpen, onClose, onSubmit}:ICreateBundleModalProps){

    const [bundleName, setBundleName] = useState( "");
    const [bundleDescription, setBundleDescription] = useState( "Bundle Description")
    const [bundleCategory, setBundleCategory] = useState("")

    const creatingLoading = useSelector(bundlesSelectors.getCreatingLoading)  ;

    function clearState() {
        setBundleName("")
        setBundleDescription("")
        setBundleCategory("")
    }

    return (
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
                            loading={creatingLoading}
                            disabled={bundleName.trim() === "" || bundleDescription.trim() === "" || !bundleCategory || creatingLoading}
                            onClick={async () => {
                               await onSubmit({
                                    name:bundleName,
                                    description: bundleDescription,
                                    category: bundleCategory
                                })
                                clearState()
                            }}
                        >
                            Add new bundle
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
            <div className={styles.wrapper}>
                <AntdInput
                    label={"Bundle name"}
                    value={bundleName}
                    rightText={"Required"}
                    placeholder={"My bundle"}
                    size={"large"}
                    onChange={(e) => {
                        setBundleName(e.target.value)
                    }}
                />

                <AntdInput
                    value={""}
                    label={"Bundle description"}
                    rightText={"Required"}
                    size={"large"}
                    placeholder={"Bundle description"}
                    onChange={(e) => {
                        setBundleDescription(e.target.value)
                    }}
                    customInput={<TextArea autoSize={{ minRows: 3, maxRows: 5 }}  value={bundleDescription}/>}
                />

                <AntdInput
                    label={"Category"}
                    value={""}
                    size={"large"}
                    customInput={
                        <Select
                            options={categoryOptions}
                            value={bundleCategory}
                            placeholder={"Choose an option"}
                            className={styles.categorySelect}
                            onChange={v => {
                                setBundleCategory(v)
                            }}
                        />
                    }
                    style={{
                        width: "100%"
                    }}
                    rightText={"Required"}
                />
            </div>
        </Modal>
    )
}