import HeaderWithContent from "../../componets/HeaderWithContent";
import * as locale from 'locale-codes'
import styles from "./TranslationsPage.module.css"
import {HeaderPage} from "../../componets/StyledComponents";
import {Button, Select, Table} from "antd";
import TranslationsColumns from "./TranslationsColumns";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bundleKeysSelectors} from "../../redux/bundleKeys";
import bundlesSelectors from "../../redux/bundles/bundlesSelectors";
import {CheckOutlined, DownOutlined, UpOutlined,WarningFilled} from "@ant-design/icons";
import {deleteTranslationKey, getKeysByBundleId} from "../../redux/bundleKeys/bundleKeysSlice";
import Loader from "../../componets/Loader";
import valuesSelectors from "../../redux/bundleKeysValues/bundleKeysValuesSelectors";
import {getValuesByKeyIds} from "../../redux/bundleKeysValues/bundleKeysValuesSlice";
import ExpandedItemTable from "../../componets/ExpandedItemTable";
import { Input } from 'antd';
import AntdButton from "../../componets/AntdButton"
import {checkBundleAlert, deleteLanguageFromBundle, setCurrentLanguageForBundle} from "../../redux/bundles/bundleSlice";
import AddLanguageModal from "../../componets/Modals/AddLanguageModal";
import AreYouSureModal from "../../componets/Modals/AreYouSureModal";
import EditBundleKeyModal from "../../componets/Modals/EditBundleKeyModal";
import {IModalKeyEditConfig, IModalKeyValueEditConfig} from "../../types/interfaces";
import EditKeyValueModal from "../../componets/Modals/EditKeyValueModal";
import CreateKeyModal from "../../componets/Modals/CreateKeyModal";

const { Search } = Input;

export default function TranslationsPage(){
    document.title = "Translatic | Translations";

    const dispatch = useDispatch();

    const keys = useSelector(bundleKeysSelectors.getAllKeys);
    const keysLoading = useSelector(bundleKeysSelectors.getKeysLoading);
    const keysProcessLoading = useSelector(bundleKeysSelectors.getProcessKeyLoading)
    const keysInfo = useSelector(bundleKeysSelectors.getKeysInfo);
    const keysInfoLoading = useSelector(bundleKeysSelectors.getKeysInfoLoading);
    const keysValuesLoading = useSelector(valuesSelectors.getKeysValuesLoading);
    const keysValues = useSelector(valuesSelectors.getKeysValues);
    const currentBundle = useSelector(bundlesSelectors.getCurrentBundle);
    const pagination = useSelector(bundleKeysSelectors.getPagination);
    const bundleAlert = useSelector(bundlesSelectors.getBundleAlert);
    const currentLanguagesForBundle = useSelector(bundlesSelectors.getCurrentLanguageForBundles)
    const deletingLanguage = useSelector(bundlesSelectors.getDeletingLanguage)


    const [translationData, setTranslationData] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [addLanguageModal, setAddLanguageModal] = useState(false);
    const [isModalKeyCreate, setIsModalKeyCreate] = useState(false);
    const [isDeleteModalKeyId, setIsDeleteModalKeyId] = useState("");
    const [isModalDeleteLanguage, setModalDeleteLanguage] = useState("");

    const [editKeyModalConfig, setEditKeyModalConfig] = useState<IModalKeyEditConfig>({
        isOpen: false,
        keyInfo: {
            keyId:"",
            keyName:"",
            keyContext:""
        }
    });

    const [editKeyValueModalConfig, setEditKeyValueModalConfig] = useState<IModalKeyValueEditConfig>({
        isOpen: false,
        valueInfo: {
            keyId:"",
            keyName: "",
            keyDescription:"",
            value:"",
            valueId:"",
            language: ""
        }
    });


    useEffect(() => {
        if(!currentBundle || !keys[currentBundle._id]) return

        const keysForBundle = keys[currentBundle._id]

        const dataTable = keysForBundle.map(bundleKey => {

            return {
                key: bundleKey._id,
                name: bundleKey.name,
                description: bundleKey.description,
                createdAt: bundleKey.createdAt,
                updatedAt: bundleKey.updatedAt,
                updatedBy: bundleKey.updatedBy,
                createdBy: bundleKey.createdBy,
                keyValue: ""
            }
        })

        setTranslationData(dataTable)

    }, [keys,currentBundle]);

    useEffect(() => {
        if(!currentBundle) return

        dispatch(getKeysByBundleId(currentBundle._id, {page: 1, limit: 5}))

    }, [currentBundle]);

    useEffect(() => {
        if(!currentBundle) return

        const getBundleKeys = keys[currentBundle._id];

        if(!getBundleKeys) return;

        const keysIds = getBundleKeys.map(key => key._id)

        dispatch(getValuesByKeyIds(currentBundle._id, currentLanguagesForBundle[currentBundle._id], keysIds))
    }, [keys,currentBundle,currentLanguagesForBundle]);

    useEffect(() => {
        if(translationData.length <= 0) return

        const updatedTableData = translationData.map(tableData => {

            const foundValue = keysValues.find(value => {
                return (
                    value.translation_key === tableData.key
                    &&  value.language === currentLanguagesForBundle[currentBundle?._id!]
                )
            });

            if(foundValue){
                return {
                    ...tableData,
                    keyValueId: foundValue._id,
                    keyValue: foundValue.value,
                    valueCreatedAt: foundValue.createdAt,
                    valueUpdatedAt: foundValue.updatedAt,
                    valueAddedBy: foundValue.addedUser,
                    valueUpdatedBy: foundValue.updatedUser
                }
            }else{
                return tableData
            }

        })

        setTranslationData(updatedTableData)

    }, [keysValues]);

    useEffect(() => {
        if(!currentBundle) return

        dispatch(checkBundleAlert(currentBundle._id,currentLanguagesForBundle[currentBundle._id]))

    }, [keysValues,currentBundle,currentLanguagesForBundle]);

    function getFilterArray(){
        if(!currentBundle) return []

        return currentBundle.translatedLanguages.map(lang => {

            return {
                label: locale.where('tag', lang).name,
                value: lang
            }
        })
    }

    function onSelect(value: string){
        dispatch(setCurrentLanguageForBundle({
            ...currentLanguagesForBundle,
            [currentBundle?._id!]: value
        }))
    }


    return(
        <HeaderWithContent>
            <div className={styles.wrapper}>
                <div className={styles.titleWithBtnContainer}>
                    <div className={styles.titleWithWarn}>
                        <HeaderPage>Translations</HeaderPage>

                        <div
                            className={styles.warningWrapper}
                            style={{
                                display: bundleAlert ? "flex" : "none"
                            }}
                        >
                            <WarningFilled />
                            <p className={styles.warnText}>
                                {`You have not completed the translation of this language for this ${currentBundle?.name ? currentBundle.name : "bundle"}`}
                            </p>
                        </div>
                    </div>
                    {
                        currentBundle && (
                            <AntdButton
                                btnTitle={"Add new language"}
                                className={styles.actionBtn}
                                size={"large"}
                                onPress={() => setAddLanguageModal(true)}
                            />
                        )
                    }

                </div>


                {
                    !currentBundle || keysInfoLoading ? (
                        <Loader/>
                    ) : (
                        <>
                            <div className={styles.actionsContainer}>
                                    <Button
                                        className={styles.addKey}
                                        onClick={() => setIsModalKeyCreate(true)}
                                        size={"large"}
                                    >
                                        Create key
                                    </Button>
                                    <AntdButton
                                        className={styles.actionBtn}
                                        btnTitle={"Download CSV"}
                                        onPress={() => console.log("")}
                                        size={"large"}
                                    />
                                    <AntdButton
                                        btnTitle={"Upload CSV"}
                                        className={styles.actionBtn}
                                        onPress={() => console.log("")}
                                        size={"large"}
                                    />
                            </div>
                            <div className={styles.searchAndSelectWrapper}>
                                <Search
                                    rootClassName={styles.searchRoot}
                                    placeholder="Search  by key name, key context or key value"
                                    allowClear
                                    size="large"
                                />
                                <div  className={styles.selectWrapper}>
                                    <p className={styles.selectedWrapperText}>Selected language:

                                        <Select
                                            open={isOpen}
                                            variant={"borderless"}
                                            value={currentLanguagesForBundle[currentBundle._id]}
                                            suffixIcon={
                                                !isOpen
                                                    ? <DownOutlined className={styles.downIcon}/>
                                                    : <UpOutlined className={styles.upIcon} />
                                            }
                                            onClick={() => setIsOpen(!isOpen)}
                                            onChange={onSelect}
                                            dropdownStyle={{
                                                width: 200
                                            }}
                                            options={getFilterArray()}
                                            optionRender={(option)=>{
                                                return(
                                                    <div className={styles.labelWrapper}>
                                                        <span className={styles.label}>{option.label}</span>
                                                        {
                                                            option.value === currentLanguagesForBundle[currentBundle?._id] && (
                                                                <CheckOutlined style={{
                                                                    marginLeft: 15,
                                                                    fontWeight:'bold'
                                                                }} />
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }}
                                        />

                                    </p>
                                </div>
                            </div>

                            <Table
                                bordered
                                rootClassName={styles.rootTable}
                                loading={keysLoading}
                                columns={TranslationsColumns({
                                    availableLanguages: currentBundle.translatedLanguages,
                                    selectedLanguage: currentLanguagesForBundle[currentBundle._id],
                                    keysValuesLoading,
                                    setIsDeleteModalKeyId,
                                    setModalDeleteLanguage,
                                    setEditKeyModalConfig,
                                    setEditKeyValueModalConfig
                                })}
                                dataSource={translationData}
                                expandable={{
                                    expandedRowRender: (record) => {
                                        const valueInfo = {
                                            value: record?.keyValue || "",
                                            valueCreatedAt: record?.valueCreatedAt || "",
                                            valueUpdatedAt: record?.valueUpdatedAt || "",
                                            valueUpdatedBy: record?.valueUpdatedBy || "",
                                            valueAddedBy: record?.valueAddedBy || ""
                                        }

                                        const keyInfo = {
                                            name:record.name,
                                            description: record.description,
                                            updatedAt: record.updatedAt,
                                            createdAt: record.createdAt,
                                            createdBy: record.createdBy,
                                            updatedBy: record.updatedBy
                                        }

                                        return (
                                            <ExpandedItemTable
                                                initialKeyInfo={keyInfo}
                                                initialValueInfo={valueInfo}
                                            />
                                        )
                                    }
                                }}
                                pagination={{
                                    position: ['bottomRight'],
                                    total: keysInfo[currentBundle._id]?.totalCount || 0,
                                    pageSize: pagination[currentBundle._id]?.limit || 10,
                                    pageSizeOptions: ['5',"20",'50', '100'],
                                    showSizeChanger: true,
                                    current:  pagination[currentBundle._id]?.page || 1,
                                    onChange: page => {
                                        dispatch(
                                            getKeysByBundleId(currentBundle?._id!, {
                                                page: page,
                                                limit: pagination[currentBundle?._id].limit,
                                            }),
                                        )
                                    },
                                    onShowSizeChange: (_, pageSize) => {
                                        dispatch(
                                            getKeysByBundleId(currentBundle?._id!, {
                                                page: 1,
                                                limit: pageSize,
                                            }),
                                        )
                                    },
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} results`,
                                } }
                            />
                        </>
                    )
                }
                <AddLanguageModal
                    isOpen={addLanguageModal}
                    onClose={() => setAddLanguageModal(false)}
                    bundleId={currentBundle?._id!}
                    alreadyAddedLanguages={currentBundle?.translatedLanguages!}
                />
                <AreYouSureModal
                    title={"Are you sure?"}
                    isOpen={Boolean(isDeleteModalKeyId)}
                    onClose={() => setIsDeleteModalKeyId("")}
                    confirmLoading={keysProcessLoading}
                    description={"This key and its values will be deleted for all languages."}
                    onSubmit={() => {
                        dispatch(deleteTranslationKey(currentBundle?._id!,isDeleteModalKeyId))
                        setIsDeleteModalKeyId("")
                    }}
                />
                <AreYouSureModal
                    title={"Are you sure?"}
                    isOpen={Boolean(isModalDeleteLanguage)}
                    onClose={() => setModalDeleteLanguage("")}
                    confirmLoading={deletingLanguage}
                    description={"This language and its values will be deleted for all languages."}
                    onSubmit={() => {
                        dispatch(deleteLanguageFromBundle(
                            currentBundle?._id!,
                            currentLanguagesForBundle[currentBundle?._id!]
                        ))
                        setModalDeleteLanguage("")
                    }}
                />
                <EditBundleKeyModal
                    config={editKeyModalConfig}
                    onClose={() => {
                        setEditKeyModalConfig({
                            isOpen: false,
                            keyInfo: {
                                keyId: "",
                                keyName: "",
                                keyContext: ""
                            }
                        })
                    }}
                />

                <EditKeyValueModal
                    config={editKeyValueModalConfig}
                    onClose={() => {
                        setEditKeyValueModalConfig({
                            isOpen: false,
                            valueInfo: {
                                value:"",
                                keyName: "",
                                valueId:"",
                                keyDescription: "",
                                keyId: "",
                                language: ""
                            }
                        })
                    }}
                />

                <CreateKeyModal
                    isOpen={isModalKeyCreate}
                    onClose={() => setIsModalKeyCreate(false)}
                    translatedLanguages={currentBundle?.translatedLanguages || []}
                />

            </div>
        </HeaderWithContent>
    )
}