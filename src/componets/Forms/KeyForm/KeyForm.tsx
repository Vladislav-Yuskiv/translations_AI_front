import styles from "./KeyForm.module.css"
import AntdInput from "../../AntdInput";
import TextArea from "antd/es/input/TextArea";
interface IKeyFormProps{
    keyName: string
    keyContext: string
    setKeyName: (v: string) => void
    setKeyContext: (v: string) => void
}
export default function KeyForm({
                                    keyName,
                                    keyContext,
                                    setKeyName,
                                    setKeyContext
}:IKeyFormProps){

    return(
        <div className={styles.wrapper}>
            <AntdInput
                label={"Translation key name"}
                value={keyName}
                rightText={"Required"}
                placeholder={"Translation key"}
                size={"large"}
                onChange={(e) => {
                    setKeyName(e.target.value)
                }}
            />

            <AntdInput
                value={""}
                label={"Key context"}
                rightText={"Optional"}
                size={"large"}
                placeholder={"Key context/description"}
                onChange={(e) => {
                    setKeyContext(e.target.value)
                }}
                customInput={
                    <TextArea
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        value={keyContext}
                    />
                }
            />
        </div>
    )
}