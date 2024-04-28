import styles from "./AntdInput.module.css"
import {Input, InputProps} from 'antd';
import React, {ReactNode} from "react";
import ReactCountryFlag from "react-country-flag";
interface IAntdInputProps extends InputProps{
    label: string
    value: string
    rightText?: string
    languageTag?: string | false
    customInput?: ReactNode
}
export default function AntdInput({
                                      label,
                                      value,
                                      rightText,
                                      customInput,
                                      languageTag = false,
                                    ...props
                                  }:IAntdInputProps){

    return(
        <div>
            <div className={styles.labelWrapper}>
                <p className={styles.label}>{label}</p>
                {
                    languageTag && (
                        <div className={styles.langWrap}>
                            <ReactCountryFlag
                                countryCode={languageTag === "en" ? "US" : languageTag.toUpperCase()}
                                style={{fontSize: 24}}
                            />
                        </div>
                    )
                }
                {
                    rightText && (
                        <p className={styles.additionalText}>{rightText}</p>
                    )
                }
            </div>

            {customInput ? (
                <>{React.cloneElement(customInput as React.ReactElement<any>, props)}</>
            ) : (
                <Input
                    value={value}
                    color={"green"}
                    className={styles.antdInput}
                    {...props}
                />
            )}

        </div>

    )
}