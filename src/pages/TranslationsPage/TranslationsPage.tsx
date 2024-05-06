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
import {createTranslationKey, deleteTranslationKey, getKeysByBundleId} from "../../redux/bundleKeys/bundleKeysSlice";
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
import {
    IAxiosFetchWithTokenRefresh,
    IModalKeyEditConfig,
    IModalKeyValueEditConfig,
    ITableKeyItem
} from "../../types/interfaces";
import EditKeyValueModal from "../../componets/Modals/EditKeyValueModal";
import CreateKeyModal from "../../componets/Modals/CreateKeyModal";
import DownloadModal from "../../componets/Modals/DownloadModal";
import UploadModal from "../../componets/Modals/UploadModal";
import {axiosFetchWithTokenRefresh} from "../../services/axiosFetch";
import {errorNotification} from "../../utils/authErrorHandler";

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
    const [downloadModal, setDownloadModal] = useState(false);
    const [uploadModal, setUploadModal] = useState(false);
    const [isModalKeyCreate, setIsModalKeyCreate] = useState(false);
    const [isDeleteModalKeyId, setIsDeleteModalKeyId] = useState("");
    const [isModalDeleteLanguage, setModalDeleteLanguage] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearchData, setIsSearchData] = useState(false);

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
        if(!currentBundle || !keys[currentBundle._id] || isSearchData) return

        const keysForBundle = keys[currentBundle._id]

        const dataTable = keysForBundle.map(bundleKey => {

            //check if obj in table already exist
            const existingKeyInTable = translationData.length > 0
                ? translationData.find(data => data.key === bundleKey._id)
                : null

            const foundValue = keysValues.find(value => {
                return (
                    value?.translation_key === bundleKey._id
                    &&  value?.language === currentLanguagesForBundle[currentBundle?._id!]
                )
            });

            let valuesForKey = {}

            if(foundValue){
                valuesForKey = {
                    keyValueId: foundValue._id,
                    keyValue: foundValue.value,
                    valueCreatedAt: foundValue.createdAt,
                    valueUpdatedAt: foundValue.updatedAt,
                    valueAddedBy: foundValue.addedUser,
                    valueUpdatedBy: foundValue.updatedUser
                }
            }

            if(existingKeyInTable){
                return {
                    ...existingKeyInTable,
                    ...valuesForKey,
                    key: bundleKey._id,
                    name: bundleKey.name,
                    description: bundleKey.description,
                    createdAt: bundleKey.createdAt,
                    updatedAt: bundleKey.updatedAt,
                    updatedBy: bundleKey.updatedBy,
                    createdBy: bundleKey.createdBy,
                }
            }else{
                return {
                    key: bundleKey._id,
                    name: bundleKey.name,
                    description: bundleKey.description,
                    createdAt: bundleKey.createdAt,
                    updatedAt: bundleKey.updatedAt,
                    updatedBy: bundleKey.updatedBy,
                    createdBy: bundleKey.createdBy,
                    keyValue: "",
                    ...valuesForKey
                }
            }

        })

        setTranslationData([...dataTable])

    }, [keys,currentBundle,keysValues,isSearchData]);

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

    }, [pagination[currentBundle?._id!],currentBundle,currentLanguagesForBundle]);


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

    const fetchData = async (searchText:string) => {
        try {
            if(searchText.trim() === "") return
            setSearchLoading(true)
            const config: IAxiosFetchWithTokenRefresh = {
                method: "get",
                url: `/bundles/${currentBundle?._id!}/${currentLanguagesForBundle[currentBundle?._id!]}/search?value=${searchText}`,
            }

            const result = await axiosFetchWithTokenRefresh<ITableKeyItem[]>(config);
            setTranslationData(result)
            setIsSearchData(true)
            setSearchLoading(false)
        }catch (e) {
            console.log("Error in searching",e)
            errorNotification("Try again!")
            if(isSearchData) setIsSearchData(false)
            setSearchLoading(false)
        }

    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.trim() === ""){
            setSearchValue("")
            setIsSearchData(false)
            return
        }
        setSearchValue(value);
    };

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
                                        onClick={() => {
                                            if(!currentBundle) return

                                            setIsModalKeyCreate(true)
                                        }}
                                        size={"large"}
                                    >
                                        Create key
                                    </Button>
                                    <AntdButton
                                        className={styles.actionBtn}
                                        btnTitle={"Download File"}
                                        onPress={() => setDownloadModal(true)}
                                        size={"large"}
                                    />
                                    <AntdButton
                                        btnTitle={"Upload File"}
                                        className={styles.actionBtn}
                                        onPress={() => setUploadModal(true)}
                                        size={"large"}
                                    />
                            </div>
                            <div className={styles.searchAndSelectWrapper}>
                                <Search
                                    rootClassName={styles.searchRoot}
                                    placeholder="Search  by key name, key context or key value"
                                    allowClear
                                    size="large"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    onSearch={fetchData}
                                    onPressEnter={(e:any) => fetchData(e.target.value)}
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
                                loading={keysLoading || searchLoading}
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
                                pagination={!isSearchData ? {
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
                                } : false}
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
                    bundleId={currentBundle?._id!}
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
                    bundleId={currentBundle?._id!}
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
                    currentLanguage={currentLanguagesForBundle[currentBundle?._id!]}
                    isOpen={isModalKeyCreate}
                    onCreate={async  (payload) => {
                        await dispatch(createTranslationKey(
                            currentBundle?._id!,
                            payload
                        ))
                    } }
                    onClose={() => setIsModalKeyCreate(false)}
                    translatedLanguages={currentBundle?.translatedLanguages || []}
                />

                <DownloadModal
                    isOpen={downloadModal}
                    onClose={() => setDownloadModal(false)}
                    languageTag={currentLanguagesForBundle[currentBundle?._id!]}
                    name={currentBundle?.name || ""}
                    bundleId={currentBundle?._id!}
                />

                <UploadModal
                    isOpen={uploadModal}
                    onClose={() => setUploadModal(false)}
                    bundleId={currentBundle?._id!}
                    languages={currentBundle?.translatedLanguages || []}
                    currentLanguage={currentLanguagesForBundle[currentBundle?._id!]}
                />

            </div>
        </HeaderWithContent>
    )
}