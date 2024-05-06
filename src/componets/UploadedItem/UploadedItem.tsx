import {DataItem} from "../../types/interfaces";
import AntdInput from "../AntdInput";
import styles from "./UploadedItem.module.css";
import {CloseOutlined} from "@ant-design/icons";

interface IUploadedItemProps{
    ketWithContext: DataItem
    onDelete: () => void
    onChange: (item:DataItem) => void
}
export default function UploadedItem({
   ketWithContext,
   onChange,
   onDelete,
}:IUploadedItemProps){

    return(
        <div className={styles.wrap}>

            <div className={styles.inputsWrap}>
                <AntdInput
                    label={"Key name"}
                    value={ketWithContext.key}
                    rightText={"Required"}
                    size={"large"}
                    onChange={(e) => {
                        onChange({
                            ...ketWithContext,
                            key: e.target.value
                        })
                    }}
                />
                <AntdInput
                    label={"Key context/description"}
                    value={ketWithContext.context}
                    rightText={"Optional"}
                    size={"large"}
                    onChange={(e) => {
                        onChange({
                            ...ketWithContext,
                            context: e.target.value
                        })
                    }}
                />
            </div>

            <CloseOutlined
                onClick={onDelete}
                className={styles.deleteIcon}
            />

        </div>
    )
}