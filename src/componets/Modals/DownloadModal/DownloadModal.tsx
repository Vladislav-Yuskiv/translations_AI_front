import {Button, Checkbox, Modal} from "antd";
import styles from "./DownloadModal.module.css";
import {CloseOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import ReactCountryFlag from "react-country-flag";
import * as locale from "locale-codes";
import moment from "moment";
import AntdInput from "../../AntdInput";
import { Radio } from 'antd';
import {IAxiosFetchWithTokenRefresh, IItemForDownload} from "../../../types/interfaces";
import {axiosFetchWithTokenRefresh} from "../../../services/axiosFetch";

interface DownloadModalProps{
    isOpen: boolean
    onClose: () => void
    languageTag: string
    name:  string
    bundleId:string
}
export default function DownloadModal({
    isOpen,
    onClose,
    languageTag,
    name,
    bundleId
 }:DownloadModalProps){

    const currentDate = moment().format("DD_MM_YY");
    const initialFileName = `translation_${currentDate}`

    const [isJson, setJSON] = useState(false);
    const [fileName, setFileName] = useState(initialFileName);
    const [includeKeyContext, setIncludeKeyContext] = useState(false);
    const [columnNameKey, setColumnNameKey] = useState('Key name');
    const [columnValueKey, setColumnValueKey] = useState("Value");
    const [columnKeyContext, setColumnKeyContext] = useState("Key context");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if(!isOpen) return
        const fileName = `${name}_${locale.where('tag', languageTag)?.name || "lag"}_${currentDate}`

        setFileName(fileName)
    }, [isOpen,name]);

    function clearState() {
        setJSON(false)
        setFileName(initialFileName)
        setIncludeKeyContext(false)
        setColumnNameKey('Key name')
        setColumnValueKey("Value")
        setColumnKeyContext("Key context")
    }

    const handleJSONDownload = (jsonDataObj:any[]) => {
        const jsonData = JSON.stringify(jsonDataObj, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const convertToCSV = (objArray:any[]) => {
        const array = [Object.keys(objArray[0])].concat(objArray.map(obj => Object.values(obj)));
        return array.map(row => row.join(',')).join('\n');
    };

    const handleCSVDownload = (csvDataObj: any[]) => {
        const csvData = convertToCSV(csvDataObj);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    function convertDataForDownload(data:IItemForDownload[]){
        return data.map(itemForDownload => {
            if(includeKeyContext){
                return {
                    [isJson ? removeGapsFromKeys(columnNameKey) : columnNameKey]: itemForDownload.keyName,
                    [isJson ? removeGapsFromKeys(columnKeyContext) : columnKeyContext]: itemForDownload.keyDescription,
                    [isJson ? removeGapsFromKeys(columnValueKey) : columnValueKey]:itemForDownload.keyValue
                }
            }else{
                return {
                    [isJson ? removeGapsFromKeys(columnNameKey) : columnNameKey]: itemForDownload.keyName,
                    [isJson ? removeGapsFromKeys(columnValueKey) : columnValueKey]:itemForDownload.keyValue
                }
            }

        })
    }
    async function downloadFile(){
        try {
            if(error) setError(false)

            setLoading(true)
            const config: IAxiosFetchWithTokenRefresh = {
                method: "get",
                url: `/bundles/${bundleId}/download?language=${languageTag}`,
            }

            const result = await  axiosFetchWithTokenRefresh<IItemForDownload[]>(config)

            const makeDataToDownload = convertDataForDownload(result)

            if(isJson){
                handleJSONDownload(makeDataToDownload)
            }else{
                handleCSVDownload(makeDataToDownload)
            }

            setLoading(false)
        }catch (e) {
            console.log("Error in downloadFile",e)
            setError(true)
            setLoading(false)
        }
    }

    function removeGapsFromKeys(input:string) {
        return input.replace(/\s/g, '');
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
                            loading={loading}
                            disabled={
                                fileName.trim() === "" ||
                                loading ||
                                isJson && (columnKeyContext.trim() === "" || columnNameKey.trim() === '' || columnValueKey.trim() === '')

                            }
                            onClick={async () => {
                                await downloadFile()
                                onClose()
                                clearState()
                            }}
                        >
                            {`Download ${isJson ? "JSON" : "CSV"} file`}
                        </Button>
                        {
                            error && (
                                <p className={styles.errorText}>Error in downloading file.Try again!</p>
                            )
                        }
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
                <div className={styles.titleWrapper}>
                    <p className={styles.title}>Download your file</p>
                </div>
                <div className={styles.infoWrap}>
                    <div className={styles.langWrap}>
                        <ReactCountryFlag
                            countryCode={languageTag === "en" ? "US" : languageTag.toUpperCase()}
                            style={{fontSize: 24}}
                        />
                    </div>

                    <p> Language -
                        <span className={styles.accentColor}>{locale.where('tag', languageTag)?.name || ""}</span>
                    </p>
                </div>

                <div className={styles.titleWrapper}>
                    <Radio.Group
                        value={isJson ? "b" : "a"}
                        onChange={e => setJSON(e.target.value === "b")}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="a">CSV file</Radio.Button>
                        <Radio.Button value="b">JSON file</Radio.Button>
                    </Radio.Group>
                </div>

                <AntdInput
                    label={`File name ${isJson ? "JSON" : "CSV" }`}
                    value={fileName}
                    rightText={"Required"}
                    size={"large"}
                    onChange={(e) => {
                        setFileName(removeGapsFromKeys(e.target.value))
                    }}
                />

                <AntdInput
                    label={`Name for key ${isJson ? "field" : "column" }`}
                    value={columnNameKey}
                    rightText={"Optional"}
                    size={"large"}
                    onChange={(e) => {
                        if(isJson){
                            setColumnNameKey(removeGapsFromKeys(e.target.value))
                        }else{
                            setColumnNameKey(e.target.value)
                        }
                    }}
                />

                <AntdInput
                    label={`Name for value ${isJson ? "field" : "column" }`}
                    value={columnValueKey}
                    rightText={"Optional"}
                    size={"large"}
                    onChange={(e) => {
                        if(isJson){
                            setColumnValueKey(removeGapsFromKeys(e.target.value))
                        }else{
                            setColumnValueKey(e.target.value)
                        }
                    }}
                />

                <div>
                    <Checkbox
                        onChange={() => setIncludeKeyContext(!includeKeyContext)}
                        checked={includeKeyContext}
                        className={styles.checkbox}
                    >
                        Add key context/description to file
                    </Checkbox>
                </div>


                {
                    includeKeyContext && (
                        <AntdInput
                            label={`Name for context ${isJson ? "field" : "column" }`}
                            value={columnKeyContext}
                            rightText={"Optional"}
                            size={"large"}
                            onChange={(e) => {
                                if(isJson){
                                    setColumnKeyContext(removeGapsFromKeys(e.target.value))
                                }else{
                                    setColumnKeyContext(e.target.value)
                                }
                            }}
                        />
                    )
                }

            </div>
        </Modal>
    )
}