import styles from "./LanguageValue.module.css"
import * as locale from "locale-codes";
import AntdInput from "../../AntdInput";
import {WarningFilled} from "@ant-design/icons";
import {Spin} from "antd";

interface ILanguageValueProps{
    loading:boolean
    languageTag: string
    value: string
    changeValue: (v: string) => void
}
export default function LanguageValue({
    languageTag,
    value,
    changeValue,
    loading
}:ILanguageValueProps){

    return(
        <div className={styles.valueInput}>
            <AntdInput
                label={`Value for ${locale.where('tag', languageTag)?.name || ""}`}
                value={value}
                languageTag={languageTag}
                disabled={loading}
                size={"large"}
                onChange={(e) => {
                    changeValue(e.target.value)
                }}
             />
            {
                value && value.trim() === "" && (
                    <div className={styles.warnWrapper}>

                        <WarningFilled style={{color: "red"}}/>

                        <p className={styles.warnText}>
                            If the value is empty, you will not be able to use this translation.
                        </p>
                    </div>
                )
            }
            {
                loading && (
                    <div className={styles.spinWrap}>
                        <Spin size={"small"}/>
                    </div>
                )
            }
        </div>
    )
}