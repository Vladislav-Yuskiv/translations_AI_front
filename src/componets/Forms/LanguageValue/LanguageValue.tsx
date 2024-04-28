import styles from "./LanguageValue.module.css"
import {useEffect, useState} from "react";
import * as locale from "locale-codes";
import AntdInput from "../../AntdInput";

interface ILanguageValueProps{
    languageTag: string
    value: string
    changeValue: (v: string) => void
}
export default function LanguageValue({
    languageTag,
    value,
    changeValue
}:ILanguageValueProps){



    return(
        <div className={styles.valueInput}>
            <AntdInput
                label={`Value for ${locale.where('tag', languageTag)?.name || ""}`}
                value={value}
                languageTag={languageTag}
                size={"large"}
                onChange={(e) => {
                    changeValue(e.target.value)
                }}
             />
        </div>
    )
}