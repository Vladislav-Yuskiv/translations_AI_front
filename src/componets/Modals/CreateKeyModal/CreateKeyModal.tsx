import {Button, Modal} from "antd";
import styles from "./CreateKeyModal.module.css"
import {CloseOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useSelector} from "react-redux";
import keysSelectors from "../../../redux/bundleKeys/bundleKeysSelectors";
import AntdInput from "../../AntdInput";
import TextArea from "antd/es/input/TextArea";
import LanguageValue from "../../Forms/LanguageValue";
import AntdButton from "../../AntdButton";

interface ICreateKeyModalModal{
    isOpen: boolean
    onClose: () => void
    translatedLanguages: string[]
}
export default function CreateKeyModal({
    onClose,
    translatedLanguages,
    isOpen,
 }:ICreateKeyModalModal){

    const processLoading = useSelector(keysSelectors.getProcessKeyLoading)

    const [keyName, setKeyName] = useState("");
    const [keyContext, setKeyContext] = useState("");
    const [valuesForLanguages, setValuesForLanguages] = useState<{[key: string]: string}>({});

    const [generatedAI, setGeneratedAI] = useState(false);
    const [generatingLoading, setGeneratingLoading] = useState(false);

    function clearState() {
        setKeyName("")
        setKeyContext("")
        setValuesForLanguages({})
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
            open={isOpen}
            className={styles.root}
            title={null}
            closeIcon={ <CloseOutlined />}
            footer={() => {
                return (
                    <div className={styles.footerWrapper}>
                        <Button
                            className={styles.footerBtn}
                            loading={processLoading}
                            disabled={
                                keyName.trim() === "" ||
                                processLoading
                            }
                            onClick={async () => {
                                clearState()
                            }}
                        >
                           Create new key
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

                <AntdButton
                    className={styles.footerBtn}
                    loading={generatingLoading}
                    disabled={generatingLoading}
                    btnTitle={!generatedAI ? "Generate values using AI" : "Regenerate"}
                    onPress={generateValueByAI}
                />

                <div>
                    {translatedLanguages.map(language => {
                        return(
                            <LanguageValue
                                value={valuesForLanguages[language]}
                                changeValue={(value) => {
                                    setValuesForLanguages({
                                        ...valuesForLanguages,
                                        [language]: value
                                    })
                                }}
                                languageTag={language}
                            />
                        )
                    })}
                </div>

            </div>
        </Modal>
    )
}