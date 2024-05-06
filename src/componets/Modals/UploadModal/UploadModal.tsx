import {Button, Checkbox, message, Modal, Upload} from "antd";
import styles from "./UploadModal.module.css"
import {CloseOutlined, WarningFilled, UploadOutlined} from "@ant-design/icons";
import {useState} from "react";
import {UploadChangeParam} from "antd/es/upload";
import {DataItem} from "../../../types/interfaces";
import UploadedItem from "../../UploadedItem";
import {useDispatch, useSelector} from "react-redux";
import keysSelectors from "../../../redux/bundleKeys/bundleKeysSelectors";
import {uploadTranslationKeys} from "../../../redux/bundleKeys/bundleKeysSlice";
import userSelectors from "../../../redux/user/userSelectors";

interface IUploadModalProps{
    isOpen: boolean
    onClose: () => void
    bundleId:string
    currentLanguage: string
    languages: string[]
}
export default function UploadModal({
                                        isOpen,
                                        onClose,
                                        bundleId,
                                        languages,
                                        currentLanguage
 }:IUploadModalProps){

    const dispatch = useDispatch();

    const [messageApi, contextHolder] = message.useMessage();

    const uploadLoading = useSelector(keysSelectors.getKeysUploading)

    const userId = useSelector(userSelectors.getUserId)


    const [error, setError] = useState(false);
    const [translateKeys, setTranslateKeys] = useState(true);
    const [data, setData] = useState<DataItem[]>([]);


    function clearState() {
        setError(false)
        setTranslateKeys(true)
        setData([])
    }

    const handleFileUpload = (info: UploadChangeParam) => {
        messageApi.open({
            key:'loadingKey',
            type: 'loading',
            content: 'Loading...',
        });

        if (info.file.status === 'done') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                parseCSV(content);
            };
            reader.readAsText(info.file.originFileObj as File);
        }
    };

    const parseCSV = (content:string) => {
        const rows = content.split('\n');
        const parsedData: DataItem[] = [];
        const existingKeys = new Set<string>();
        let allUnique = true;

        rows.forEach((row, index) => {
            const columns = row.split(',');
            const key = columns[0].trim();
            const context = columns[1].trim();

            if (existingKeys.has(key)) {
                messageApi.destroy( 'loadingKey');

                messageApi.open({
                    type: 'error',
                    content: `Duplicate key found in row ${index + 1}: ${key}`,
                    duration: 3
                });

                allUnique = false
                return;
            }

            existingKeys.add(key);

            parsedData.push({
                id: index + 1,
                key: key,
                context: context
            });
        });

        if(allUnique){
            setData(parsedData);
            messageApi.open({
                key:'loadingKey',
                type: 'success',
                content: 'Loaded!',
                duration: 2,
            });
        }

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
                        <Checkbox
                            onChange={() => setTranslateKeys(!translateKeys)}
                            checked={translateKeys}
                            className={styles.checkBox}
                        >
                            Translate all keys into all of your translated languages.
                        </Checkbox>
                        <Button
                            className={styles.footerBtn}
                            loading={uploadLoading}
                            disabled={uploadLoading || data.length === 0}
                            onClick={async () => {
                                try {
                                    await dispatch(uploadTranslationKeys(bundleId, {
                                        keys: data,
                                        languages: languages,
                                        needTranslate: translateKeys,
                                        currentSelectedLanguage: currentLanguage,
                                        userId
                                    }))
                                    onClose()
                                    clearState()
                                }catch (e) {
                                }
                            }}
                        >
                            {`Upload file`}
                        </Button>
                        {
                            error && (
                                <p className={styles.errorText}>Error in uploading file.Try again!</p>
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
            {contextHolder}
            <div className={styles.wrapper}>
                <div className={styles.titleWrapper}>
                    <p className={styles.title}>Upload your file</p>
                </div>
                <div className={styles.infoWrap}>
                    <WarningFilled />
                   <p className={styles.warnText}>
                       We only support the CSV file format. You can <b>upload keys</b> and their corresponding <b>contexts</b> for each key.
                   </p>
                </div>

                <Upload
                    accept={".csv"}
                    onChange={handleFileUpload}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Choose file</Button>
                </Upload>

                <div className={styles.uploadedInputs}>
                    {data.map((item) => {

                        return (
                            <UploadedItem
                                key={item.id}
                                ketWithContext={item}
                                onDelete={() => {
                                    const filteredData = data.filter(dataItem => dataItem.key !== item.key);
                                    setData(filteredData)
                                }}
                                onChange={(newItem) => {
                                    const updatedData = data.map((dataItem) => {
                                        if (dataItem.id === newItem.id) {
                                            return { ...newItem };
                                        }
                                        return dataItem;
                                    });
                                    setData(updatedData);
                                }}
                            />
                        )

                    })}
                </div>
            </div>
        </Modal>
    )
}