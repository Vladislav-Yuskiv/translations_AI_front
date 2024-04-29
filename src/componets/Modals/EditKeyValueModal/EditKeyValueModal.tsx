import styles from "./EditKeyValueModal.module.css"
import {IModalKeyValueEditConfig} from "../../../types/interfaces";
import {Button, Modal} from "antd";
import {useEffect, useState} from "react";
import {CloseOutlined, WarningFilled} from "@ant-design/icons";
import AntdInput from "../../AntdInput";
import ReactCountryFlag from "react-country-flag";
import * as locale from "locale-codes";
import AntdButton from "../../AntdButton";
import {useDispatch, useSelector} from "react-redux";
import valuesSelectors from "../../../redux/bundleKeysValues/bundleKeysValuesSelectors";
import {updateTranslationKeyValue} from "../../../redux/bundleKeysValues/bundleKeysValuesSlice";
import userSelectors from "../../../redux/user/userSelectors";

interface IEditKeyValueModalProps{
    bundleId:string
    config:IModalKeyValueEditConfig
    onClose: () => void
}
export default function EditKeyValueModal({
                                              config,
                                              onClose,
                                              bundleId

}:IEditKeyValueModalProps){

    const keyValueProcessLoading = useSelector(valuesSelectors.getKeyValueProcessing)
    const userId = useSelector(userSelectors.getUserId)

    const dispatch = useDispatch();

    const [value, setValue] = useState("");
    const [generatedAI, setGeneratedAI] = useState(false);
    const [generatingLoading, setGeneratingLoading] = useState(false);

    useEffect(() => {
        if(!config.isOpen) return

        setValue(config.valueInfo.value)
    }, [config]);
    function clearState(){
        setValue("")
        setGeneratedAI(false)
    }


    async function generateValueByAI() {
        try{
            setGeneratingLoading(true)

            setGeneratedAI(true)
            setGeneratingLoading(false)

        }catch (e) {
            setGeneratingLoading(false)
            console.log('Error in generateValueByAI',e)
        }
    }


    return(
        <Modal
            open={config.isOpen}
            className={styles.root}
            title={null}
            closeIcon={ <CloseOutlined />}
            footer={() => {
                return (
                    <div className={styles.footerWrapper}>
                        <Button
                            className={styles.footerBtn}
                            loading={keyValueProcessLoading}
                            disabled={keyValueProcessLoading}
                            onClick={async () => {
                                dispatch(updateTranslationKeyValue(
                                    bundleId,
                                    config.valueInfo.valueId,
                                    {
                                        value:value,
                                        updatedUser:userId
                                    }
                                ))
                                onClose()
                                clearState()
                            }}
                        >
                            Save
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

                <div className={styles.infoWrap}>
                    <div className={styles.langWrap}>
                        <ReactCountryFlag
                            countryCode={config.valueInfo.language === "en" ? "US" : config.valueInfo.language.toUpperCase()}
                            style={{fontSize: 24}}
                        />
                    </div>

                    <p> Language -
                        <span className={styles.accentColor}>{locale.where('tag', config.valueInfo.language)?.name || ""}</span>
                    </p>
                </div>

                <div>
                    <p className={styles.accentTwo}>Key:</p>

                    <p>{config.valueInfo.keyName}</p>
                </div>

                <div>
                    <p className={styles.accentTwo}>Context:</p>

                    <p>{config.valueInfo.keyDescription}</p>
                </div>

                <AntdInput
                    label={"Key value"}
                    value={value}
                    size={"large"}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                 />
                {
                    value.trim() === "" && (
                        <div className={styles.warnWrapper}>

                            <WarningFilled style={{color: "red"}}/>

                            <p className={styles.warnText}>
                                If the value is empty, you will not be able to use this translation.
                            </p>
                        </div>
                    )
                }

                <AntdButton
                    className={styles.footerBtn}
                    loading={generatingLoading}
                    disabled={generatingLoading}
                    btnTitle={!generatedAI ? "Generate using AI" : "Regenerate"}
                    onPress={generateValueByAI}
                />
            </div>
        </Modal>
    )
}