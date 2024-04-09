import styles from "./AntdInput.module.css"
import {Input, InputProps} from 'antd';
import React, {ReactNode} from "react";
interface IAntdInputProps extends InputProps{
    label: string
    value: string
    rightText?: string
    customInput?: ReactNode
}
export default function AntdInput({
                                      label,
                                      value,
                                      rightText,
                                      customInput,
                                    ...props
                                  }:IAntdInputProps){

    return(
        <div>
            <div className={styles.labelWrapper}>
                <p className={styles.label}>{label}</p>
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
                    defaultValue={value}
                    color={"green"}
                    className={styles.antdInput}
                    {...props}
                />
            )}

        </div>

    )
}