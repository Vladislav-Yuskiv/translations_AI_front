import styles from "./AddLanguageModal.module.css"
import {AutoComplete, Button, Checkbox, Modal, Spin} from "antd";
import {CloseOutlined,WarningFilled} from "@ant-design/icons";
import AntdInput from "../../AntdInput";
import {useEffect, useState} from "react";
import * as locale from 'locale-codes'
import {useDispatch, useSelector} from "react-redux";
import bundlesSelectors from "../../../redux/bundles/bundlesSelectors";
import {addNewLanguageToBundle} from "../../../redux/bundles/bundleSlice";
import userSelectors from "../../../redux/user/userSelectors";

interface ILanguageOption{
    label: string,
    value: string
}
interface IAddLanguageModalProps{
    isOpen: boolean
    onClose: () => void
    bundleId: string
    alreadyAddedLanguages: string[],
}
export default function AddLanguageModal({
    isOpen,
    onClose,
    bundleId,
    alreadyAddedLanguages,
}:IAddLanguageModalProps){

    const dispatch = useDispatch();

    const creatingNewLanguageLoading = useSelector(bundlesSelectors.getCreatingNewLanguageLoading);
    const userId = useSelector(userSelectors.getUserId)

    const [translateAllKeys, setTranslateAllKeys] = useState(true)
    const [isAlreadyAdded, setIsAlreadyAdded] = useState(false)
    const [originalLanguageOptions, setOriginalLanguageOptions] = useState<ILanguageOption[]>([])
    const [languageOptions, setLanguageOptions] = useState<ILanguageOption[]>([])
    const [initialLoading, setInitialLoading] = useState(true)
    const [selectedLanguage, setSelectedLanguage] = useState("")

    useEffect(() => {
        if(!isOpen) return

        const filteredLanguages = locale.all.filter(localeItem => !localeItem.location )

        const options:ILanguageOption[] = filteredLanguages.map(localeItem => {

            return(
                {
                    label: localeItem.name,
                    value: localeItem.tag
                }
            )
        })

        setOriginalLanguageOptions(options)
        setLanguageOptions(options)

        setInitialLoading(false)

    }, [isOpen]);

    useEffect(() => {
        if(!selectedLanguage) return

        if(alreadyAddedLanguages.includes(selectedLanguage)){
            setIsAlreadyAdded(true)
        }else{
            setIsAlreadyAdded(false)
        }
    }, [selectedLanguage]);


    function clearState() {
        setTranslateAllKeys(true)
        setInitialLoading(true)
        setLanguageOptions([])
        setIsAlreadyAdded(false)
        setOriginalLanguageOptions([])
        setSelectedLanguage("")
    }

    const onSelect = (languageTag: string) => {
        setSelectedLanguage(languageTag)
    };

    const onSearch = (text: string) => {
        if(text.trim() === ""){
            setLanguageOptions(originalLanguageOptions)
            return
        }
        const filteredOptions = originalLanguageOptions.filter(optionItem => optionItem.label.toLowerCase().includes(text.toLowerCase()));
        setLanguageOptions(filteredOptions)
    };

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
                            loading={creatingNewLanguageLoading}
                            disabled={initialLoading || !selectedLanguage || isAlreadyAdded || creatingNewLanguageLoading}
                            onClick={async () => {
                                dispatch(addNewLanguageToBundle(
                                    bundleId,
                                    {
                                        userId,
                                        language: selectedLanguage,
                                        languageName: locale.where('tag', selectedLanguage).name,
                                        needToTranslate: translateAllKeys

                                    })
                                )
                                onClose()
                                clearState()
                            }}
                        >
                            Add new language
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
                {
                    initialLoading
                        ? (
                            <div className={styles.loaderWrap}>
                                <Spin size={"large"}/>
                            </div>

                        )
                        : (
                            <>
                                <div>
                                    <AntdInput
                                        label={"Select language"}
                                        value={""}
                                        rightText={"Required"}
                                        placeholder="Enter your preferred language"
                                        style={{ width: "100%" }}
                                        size={"large"}
                                        customInput={
                                            <AutoComplete
                                                options={languageOptions}
                                                disabled={originalLanguageOptions.length === 0}
                                                rootClassName={styles.autoCompleteCustom}
                                                notFoundContent={<p>Language not found</p>}
                                                onSelect={onSelect}
                                                onSearch={onSearch}
                                            />
                                        }
                                    />
                                    {isAlreadyAdded && (
                                        <div className={styles.warnWrapper}>

                                            <WarningFilled style={{color: "red"}}/>

                                            <p className={styles.warnText}>
                                                This language has already been added! Choose another one.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <Checkbox
                                    onChange={() => setTranslateAllKeys(!translateAllKeys)}
                                    checked={translateAllKeys}
                                >
                                    Translate all keys using AI
                                </Checkbox>
                                {!translateAllKeys && (
                                    <div className={styles.warnWrapper}>

                                        <WarningFilled style={{color: "red"}}/>

                                        <p className={styles.warnText}>
                                            This language will not be available until you translate all keys.
                                        </p>
                                    </div>
                                )}
                            </>
                        )
                }

            </div>

        </Modal>
    )
}