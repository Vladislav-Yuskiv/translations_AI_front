import {Spin, TableColumnsType, Tooltip} from "antd";
import styles from "./TranslationsPage.module.css"
import {EditFilled,DeleteFilled} from "@ant-design/icons";
import * as locale from 'locale-codes'

interface ITranslationsColumnsProps{
    selectedLanguage:string
    keysValuesLoading: boolean
}
export default function TranslationsColumns({
                                                selectedLanguage,
                                                keysValuesLoading,
}:ITranslationsColumnsProps):TableColumnsType<any>{

    return(
       [
           {
               title: 'Translation Key',
               dataIndex: 'key',
               key: 'key',
               render: (value, record) => {
                   return record.name
               }
           },
           {
               title: () => {
                   return (
                       <div>
                           Key context

                           <Tooltip title="You can not change default language in beta" placement="topLeft">
                               <div className={styles.langContainer}>
                                   <p className={styles.defaultContextText}>Default context  language:</p>

                                       <div className={styles.langWrap}>
                                           <img src="https://flagsapi.com/US/flat/24.png"/>
                                       </div>
                               </div>
                           </Tooltip>
                       </div>
                   )
               },
               dataIndex: 'description',
               key: 'key',
           },
           {
               title: () => {
                   const langName = locale.where('tag', selectedLanguage).name
                   return (
                       <div className={styles.langContainer}>
                           <div className={styles.langWrap}>
                               <img src="https://flagsapi.com/US/flat/24.png"/>
                           </div>

                           <p>{langName}</p>
                       </div>
                   )
               },
               dataIndex: 'keyValue',
               key: 'keyValue',
               render: (value) => {
                   return (
                       <div className={styles.valueWrapper}>
                           {
                               keysValuesLoading
                                   ? <Spin size={"small"}/>
                                   : value
                           }
                       </div>
                   )
               }
           },
           {
               title: 'Actions',
               dataIndex: 'keyActions',
               key: 'keyActions',
               render: () => {
                   return (
                       <div className={styles.actionColumnWrapper}>
                           <div className={styles.actionColumnIconWrap}>
                               <EditFilled className={styles.actionColumnIcon}/>
                           </div>

                            <div className={styles.actionColumnIconWrap}>
                                <DeleteFilled className={styles.actionColumnIcon}/>
                            </div>
                       </div>
                   )
               }
           },
       ]
    )
}