import {Spin, TableColumnsType, Tooltip} from "antd";
import styles from "./TranslationsPage.module.css"
import {DeleteFilled, WarningFilled} from "@ant-design/icons";
import * as locale from 'locale-codes'
import ReactCountryFlag from "react-country-flag";

interface ITranslationsColumnsProps{
    availableLanguages: string[]
    selectedLanguage:string
    keysValuesLoading: boolean
    setIsDeleteModalKeyId: (keyId:string) => void
    setModalDeleteLanguage: (languageTag: string) => void
}
export default function TranslationsColumns({
                                                availableLanguages,
                                                selectedLanguage,
                                                keysValuesLoading,
                                                setIsDeleteModalKeyId,
                                                setModalDeleteLanguage
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
                                           <ReactCountryFlag
                                               countryCode={"US"}
                                               style={{fontSize: 24}}
                                           />
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
                       <div className={styles.flagWithActionContainer}>
                           <div className={styles.flagWithName}>
                               <div className={styles.langWrap}>
                                   <ReactCountryFlag
                                       countryCode={selectedLanguage === "en" ? "US" : selectedLanguage.toUpperCase()}
                                       style={{fontSize: 24}}
                                   />
                               </div>

                               <p>{langName}</p>
                           </div>

                           {
                               availableLanguages.length > 1 && (
                                   <DeleteFilled
                                       className={styles.actionColumnIcon}
                                       onClick={() => setModalDeleteLanguage(selectedLanguage)}
                                   />
                               )
                           }

                       </div>
                   )
               },
               dataIndex: 'keyValue',
               key: 'keyValue',
               render: (value) => {
                   if(keysValuesLoading){
                       return (
                           <div className={styles.valueWrapper}>
                               <Spin size={"small"}/>
                           </div>
                       )
                   }else{
                      return(
                          value.trim() === ""
                              ?   <WarningFilled style={{color:"red"}} />
                              :   value
                      )
                   }
               }
           },
           {
               title: 'Actions',
               dataIndex: 'keyActions',
               key: 'keyActions',
               render: (value, record) => {
                   return (
                       <div className={styles.actionColumnWrapper}>
                            <div className={styles.actionColumnIconWrap}>
                                <DeleteFilled
                                    className={styles.actionColumnIcon}
                                    onClick={() => setIsDeleteModalKeyId(record.key)}
                                />
                            </div>
                       </div>
                   )
               }
           },
       ]
    )
}