import styles from "./SelectCompany.module.css"
import {useRef, useState} from "react";
import { PlusCircleFilled ,DownOutlined ,UpOutlined} from '@ant-design/icons';
import {Button, Divider, InputRef, Select, Space} from "antd";
import {useMediaQuery} from "@mui/material";

interface ISelectCompanyProps {
    currentCompany: string
    availableCompanies: string[]
}
export default function SelectCompany({currentCompany, availableCompanies}:ISelectCompanyProps){

    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState(availableCompanies);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const isAtLeastTable = useMediaQuery('(min-width:768px)');

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

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
            //loading={true}
            placeholder="Select Company"
            bordered={false}
            open={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            defaultValue={currentCompany}
            dropdownStyle={{
                width: isAtLeastTable ? 300 : 200
            }}
            suffixIcon={!isOpen ? <DownOutlined className={styles.downIcon}/> : <UpOutlined className={styles.upIcon} />}
            onSelect={(value) => onSelect(value)}
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
                            Add a new company
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
            options={items.map((item) => ({ label: item, value: item }))}
        />
    );
}