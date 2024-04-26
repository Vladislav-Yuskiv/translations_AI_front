import HeaderWithContent from "../../componets/HeaderWithContent";
import * as locale from 'locale-codes'
import styles from "./TranslationsPage.module.css"
import {HeaderPage} from "../../componets/StyledComponents";
import {Select, Table} from "antd";
import TranslationsColumns from "./TranslationsColumns";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bundleKeysSelectors} from "../../redux/bundleKeys";
import bundlesSelectors from "../../redux/bundles/bundlesSelectors";
import {CheckOutlined, DownOutlined, UpOutlined} from "@ant-design/icons";
import {getKeysByBundleId} from "../../redux/bundleKeys/bundleKeysSlice";
import Loader from "../../componets/Loader";
import valuesSelectors from "../../redux/bundleKeysValues/bundleKeysValuesSelectors";
import {getValuesByKeyIds} from "../../redux/bundleKeysValues/bundleKeysValuesSlice";
export default function TranslationsPage(){
    document.title = "Translatic | Translations";

    const dispatch = useDispatch();

    const keys = useSelector(bundleKeysSelectors.getAllKeys);
    const keysLoading = useSelector(bundleKeysSelectors.getKeysLoading)
    const keysInfo = useSelector(bundleKeysSelectors.getKeysInfo);
    const keysInfoLoading = useSelector(bundleKeysSelectors.getKeysInfoLoading);
    const keysValuesLoading = useSelector(valuesSelectors.getKeysValuesLoading);
    const keysValues = useSelector(valuesSelectors.getKeysValues);
    const currentBundle = useSelector(bundlesSelectors.getCurrentBundle);
    const pagination = useSelector(bundleKeysSelectors.getPagination);

    const [translationData, setTranslationData] = useState<any[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if(!currentBundle || !keys[currentBundle._id]) return

        const keysForBundle = keys[currentBundle._id]

        const dataTable = keysForBundle.map(bundleKey => {

            return {
                key: bundleKey._id,
                name: bundleKey.name,
                description: bundleKey.description,
                keyValue: ""
            }
        })

        setTranslationData(dataTable)

    }, [keys,currentBundle]);

    useEffect(() => {
        if(!currentBundle) return

        setSelectedLanguage(currentBundle.translatedLanguages[0])

        dispatch(getKeysByBundleId(currentBundle._id, {page: 1, limit: 5}))

    }, [currentBundle]);

    useEffect(() => {
        if(!currentBundle) return

        const getBundleKeys = keys[currentBundle._id];

        if(!getBundleKeys) return;

        const keysIds = getBundleKeys.map(key => key._id)

        dispatch(getValuesByKeyIds(currentBundle._id, selectedLanguage, keysIds))
    }, [keys,currentBundle,selectedLanguage]);

    useEffect(() => {
        if(translationData.length <= 0) return

        const updatedTableData = translationData.map(tableData => {

            const foundValue = keysValues.find(value => {
                return (
                    value.translation_key === tableData.key
                    &&  value.language === selectedLanguage
                )
            });
            if(foundValue){
                return {
                    ...tableData,
                    keyValue: foundValue.value
                }
            }else{
                return tableData
            }

        })

        setTranslationData(updatedTableData)

    }, [keysValues]);

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
        setSelectedLanguage(value)

    }


    // console.log(locale.all)
    //console.log(locale.where('tag', 'en'))
    return(
        <HeaderWithContent>
            <div className={styles.wrapper}>
                <HeaderPage>Translations</HeaderPage>
                {
                    !currentBundle || keysInfoLoading ? (
                        <Loader/>
                    ) : (
                        <>
                            <div className={styles.actionsContainer}>
                                <div  className={styles.selecteWrapper}>
                                    <p className={styles.selectedWrapperText}>Selected language:

                                        <Select
                                            open={isOpen}
                                            variant={"borderless"}
                                            value={selectedLanguage}
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
                                                            option.value === selectedLanguage && (
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
                                loading={keysLoading}
                                columns={TranslationsColumns({
                                    selectedLanguage,
                                    keysValuesLoading
                                })}
                                dataSource={translationData}
                                pagination={ {
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

            </div>
        </HeaderWithContent>
    )
}