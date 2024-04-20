import styles from "./SelectCompany.module.css"
import {useEffect, useRef, useState} from "react";
import { PlusCircleFilled ,DownOutlined ,UpOutlined,LoadingOutlined} from '@ant-design/icons';
import {Button, Divider, InputRef, Select, Space} from "antd";
import {useMediaQuery} from "@mui/material";
import {IBundle} from "../../types/interfaces";
import {useSelector} from "react-redux";
import bundlesSelectors from "../../redux/bundles/bundlesSelectors";

export default function SelectCompany(){

    const bundlesLoading = useSelector(bundlesSelectors.getLoading)
    const currentBundle = useSelector(bundlesSelectors.getCurrentBundle)
    const availableCompanies = useSelector(bundlesSelectors.getAvailable)

    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<IBundle[]>(availableCompanies);
    const inputRef = useRef<InputRef>(null);

    const isAtLeastTable = useMediaQuery('(min-width:768px)');

    useEffect(() => {
        setItems(availableCompanies)
    }, [availableCompanies,currentBundle]);

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    
    function onSelect(value: string) {
        console.log("Selected value",value)
    }

    return (
        <Select
            style={{ width: "auto"}}
            placeholder="Select bundle"
            bordered={false}
            open={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            dropdownStyle={{
                width: isAtLeastTable ? 300 : 200
            }}
            disabled={bundlesLoading || items.length === 0 }
            rootClassName={styles.select}
            suffixIcon={
                bundlesLoading || items.length === 0
                    ? <LoadingOutlined />
                    : !isOpen
                        ? <DownOutlined className={styles.downIcon}/>
                        : <UpOutlined className={styles.upIcon} />
            }
            onChange={onSelect}
            value={currentBundle?._id}
            dropdownRender={(menu) => (
                <div>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                        <Button
                            className={styles.button}
                            type="text"
                            icon={
                                <PlusCircleFilled className={styles.plusIcon}
                                />
                            }
                            onClick={addItem}
                        >
                            Add a new bundle
                        </Button>
                    </Space>
                </div>
            )}
            optionRender={(option)=>{
                return(
                    <div className={styles.labelWrapper}>
                        <span className={styles.label}>{option.label}</span>
                    </div>
                )
            }}
            options={items.map((item) => ({ label: item.name, value: item._id }))}
        />
    );
}