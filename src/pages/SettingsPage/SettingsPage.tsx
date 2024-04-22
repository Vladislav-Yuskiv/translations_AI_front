import HeaderWithContent from "../../componets/HeaderWithContent";
import {HeaderPage, SubTitlePage} from "../../componets/StyledComponents";
import {CopyOutlined, InboxOutlined, CheckCircleFilled, PlusCircleFilled} from '@ant-design/icons';
import styles from "./SettingsPage.module.css";
import {Button, Input, Select, SelectProps, Table, TableColumnsType, Tooltip} from "antd";
import AntdInput from "../../componets/AntdInput";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import bundlesSelectors from "../../redux/bundles/bundlesSelectors";
import Loader from "../../componets/Loader";
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import AntdButton from "../../componets/AntdButton";
import {
    deleteBundleById,
    deleteUserInBundleById,
    getUsersByBundleId,
    updateCurrentBundle
} from "../../redux/bundles/bundleSlice";
import {setShowUnsaved} from "../../redux/user/userSlice";
import Unsaved from "../../componets/Unsaved";
import userSelectors from "../../redux/user/userSelectors";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useMediaQuery} from "@mui/material";
import AreYouSureModal from "../../componets/Modals/AreYouSureModal";

const { Dragger } = Upload;

const categoryOptions: SelectProps['options'] = [
    {label:"Business",value:"Business"},
    {label:"Music",value:"Music"},
    {label:"Finance",value:"Finance"},
    {label:"Education",value:"Education"},
    {label:"Other",value:"other"},
];

const { TextArea } = Input;
export default function SettingsPage(){
    document.title = "Translatic | Settings";

    const isAtLeastTable = useMediaQuery('(min-width:768px)');

    const currentUserEmail = useSelector(userSelectors.getUserEmail)

    const dispatch = useDispatch();
    const bundlesLoading = useSelector(bundlesSelectors.getLoading)
    const availableBundles = useSelector(bundlesSelectors.getAvailable)
    const deleteLoading = useSelector(bundlesSelectors.getDeleteLoading)
    const updateBundleLoading = useSelector(bundlesSelectors.getUpdateBundleLoading)
    const currentBundle = useSelector(bundlesSelectors.getCurrentBundle)
    const showUnsaved = useSelector(userSelectors.getShowUnsaved)
    const usersByBundleId = useSelector(bundlesSelectors.getCurrentBundleUsers);
    const bundleUsersLoading = useSelector(bundlesSelectors.getBundleUsersLoading);

    const [bundleName, setBundleName] = useState(currentBundle?.name || "");
    const [bundleDescription, setBundleDescription] = useState(currentBundle?.description ||  "")
    const [bundleCategory, setBundleCategory] = useState(currentBundle?.category ||  "Business")

    const [tableData, setTableData] = useState<any[]>([])
    const [sureModal, setSureModal] = useState<"bundleDelete" | "userDelete" | null>(null)
    const [isAPICopy, setAPICopy] = useState(false);
    const [userToDelete, setUserToDelete] = useState("");
    const [isUsersLimitResearch, setUsersLimitResearch] = useState(false);

    useEffect(() => {
        if(
            bundleName === currentBundle?.name
            && bundleDescription === currentBundle.description
            && bundleCategory  === currentBundle.category
            && showUnsaved
        ){
            dispatch(setShowUnsaved(false))
        }
    }, [bundleName,bundleDescription,bundleCategory]);

    useEffect(() => {
        if(!currentBundle?._id) return

        dispatch(getUsersByBundleId(currentBundle._id))
    }, [currentBundle]);


    useEffect(() => {
        if(usersByBundleId && usersByBundleId.length === 0) return

        const filteredTableData = usersByBundleId.map((user, index) => {
            return {
                key: user._id,
                name: user.name,
                email: user.email,
                role: "Admin",
            }
        })

        setTableData(filteredTableData)
    }, [usersByBundleId]);
    async function handleDeleteBundle(){
        setSureModal(null)
        if(availableBundles.length === 1){
            return window.alert("You need to have at least one translation bundle")
        }

        if(!currentBundle?._id){
            return window.alert("Something went wrong")
        }

        dispatch(deleteBundleById(currentBundle._id))
    }

    function handleDeleteUser(userId: string){
        if(!currentBundle?._id) return
        setSureModal(null)
        dispatch(deleteUserInBundleById(currentBundle._id,userId))
        setUserToDelete("")
    }


    async function handleSaveChanges() {
        try{
            if(!currentBundle?._id){
                window.alert("Something went wrong")
                return
            }

            await dispatch(updateCurrentBundle(currentBundle._id,{
                    name: bundleName,
                    description:bundleDescription,
                    category: bundleCategory
                }))

        }catch (e) {
            console.log("Error in handlePasswordChange",e)
        }
    }

    const draggerProps: UploadProps = {
        name: 'file',
        multiple: true,
        disabled: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    
    function handleCopyAPI() {
        setAPICopy(true)

        setTimeout(() => {
            setAPICopy(false)
        },1500)
    }

    const renderUnSaved = useCallback(() => {
        return (
            <Unsaved/>
        )
    },[showUnsaved])

    const renderSaveButton = useCallback(() => {

        const isDisabled =  updateBundleLoading
            || bundleName.trim() === ""
            || bundleDescription.trim() === ""
            || !showUnsaved

        return (
            <AntdButton
                style={{
                    color: isDisabled ? "#000000" : "white",
                    fontSize: 14,
                    fontWeight: 500,
                    marginTop: 20
                }}
                btnTitle={"Save Changes"}
                className={styles.saveBtn}
                onPress={handleSaveChanges}
                loading={updateBundleLoading}
                disabled={isDisabled}
            />
        )
    }, [
        updateBundleLoading,
        currentBundle,
        bundleDescription,
        bundleCategory,
        bundleName,
        showUnsaved
    ])

    const columns: TableColumnsType<any> = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'E-mail', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (user) => {
                if(user.email !== currentUserEmail){
                    return (
                        <AntdButton
                            btnTitle={'Delete'}
                            onPress={() => {
                                setUserToDelete(user.key)
                                setSureModal("userDelete")
                            }}
                            style={{
                                color: "white"
                            }}
                            className={styles.btnUserDelete}
                            disabled={deleteLoading}
                            loading={deleteLoading}
                         />
                    )
                }else{
                    return  ""
                }

            }
        },
    ];

    function addNewMemberToBundle() {
        if(usersByBundleId.length >= 3){
            setUsersLimitResearch(true)

            setTimeout(() => {
                setUsersLimitResearch(false)
            },2000)
        }

        console.log('addNewMemberToBundle')
    }

    return(
        <HeaderWithContent>
            <div>
                <HeaderPage>Bundle Settings</HeaderPage>

                {
                    bundlesLoading
                    ? <Loader/>
                    :(
                           <>
                               <div className={styles.blockWrapper}>
                                   <SubTitlePage>General</SubTitlePage>

                                   <div className={styles.inputsWrapper}>
                                       <AntdInput
                                           label={"Bundle name"}
                                           value={bundleName}
                                           rightText={"Required"}
                                           size={"large"}
                                           onChange={(e) => {
                                               setBundleName(e.target.value)
                                               if(!showUnsaved) dispatch(setShowUnsaved(true))
                                           }}
                                       />

                                       <AntdInput
                                           value={""}
                                           label={"Bundle description"}
                                           rightText={"Required"}
                                           size={"large"}
                                           onChange={(e) => {
                                               setBundleDescription(e.target.value)
                                               if(!showUnsaved) dispatch(setShowUnsaved(true))
                                           }}
                                           customInput={<TextArea autoSize={{ minRows: 3, maxRows: 5 }}  value={bundleDescription}/>}
                                       />

                                       <div>
                                           <div className={styles.appIconWrapper}>
                                               <p className={styles.labelSubBlock}>App Icon</p>
                                               <p className={styles.comingSoon}>Coming soon</p>
                                           </div>

                                           <Dragger {...draggerProps } className={styles.dragger}>
                                               <p className="ant-upload-drag-icon">
                                                   <InboxOutlined style={{color:"rgba(103, 32, 255)"}}/>
                                               </p>
                                               <p className="ant-upload-text">Click here or drag the file to this area to upload</p>
                                               <p className="ant-upload-hint">
                                                   PNG, JPG, max size 2MB.
                                               </p>
                                           </Dragger>
                                       </div>

                                       <AntdInput
                                           label={"Category"}
                                           value={""}
                                           size={"large"}
                                           customInput={
                                               <Select
                                                   options={categoryOptions}
                                                   value={bundleCategory}
                                                   className={styles.categorySelect}
                                                   onChange={v => {
                                                       setBundleCategory(v)
                                                       if(!showUnsaved) dispatch(setShowUnsaved(true))
                                                   }}
                                               />
                                           }
                                           style={{
                                               width: "100%"
                                           }}
                                           placeholder={"Choose an option"}
                                           rightText={"Required"}
                                       />

                                       {renderSaveButton()}
                                   </div>
                               </div>

                               <div className={styles.blockWrapper}>
                                   <SubTitlePage>Members</SubTitlePage>

                                   <div className={styles.inputsWrapper}>
                                       {
                                           isAtLeastTable
                                                    ? (
                                                       <Table
                                                           dataSource={tableData}
                                                           pagination={false}
                                                           columns={columns}
                                                           loading={bundleUsersLoading}
                                                       />
                                                    )
                                                    : (
                                                        <div>
                                                            {
                                                                tableData.map(user => {
                                                                    return (
                                                                        <div key={user.key} className={styles.tableMobileWrapper}>
                                                                            <p className={styles.tableMobileTitle}>Name:
                                                                                <span className={styles.tableValueAccent}>{user.name}</span>
                                                                            </p>
                                                                            <p className={styles.tableMobileTitle}>E-email:
                                                                                <span className={styles.tableValueAccent}>{user.email}</span>
                                                                            </p>
                                                                            <p className={styles.tableMobileTitle}>Role:
                                                                                <span className={styles.tableValueAccent}>{user.role}</span>
                                                                            </p>
                                                                            {
                                                                                user.email !== currentUserEmail && (
                                                                                    <AntdButton
                                                                                        btnTitle={"Delete"}
                                                                                        onPress={() => {
                                                                                            setUserToDelete(user.key)
                                                                                            setSureModal("userDelete")
                                                                                        }}
                                                                                        className={styles.btnUserDelete}
                                                                                        style={{
                                                                                            color:"white"
                                                                                        }}
                                                                                    />
                                                                                )
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                       }

                                       <Tooltip open={isUsersLimitResearch} placement="bottom" title={"In beta you can add only 3 users"}>
                                           <Button
                                               className={styles.addMemberButton}
                                               type="text"
                                               icon={
                                                   <PlusCircleFilled
                                                       className={styles.plusIcon}
                                                   />
                                               }
                                               onClick={addNewMemberToBundle}
                                           >
                                               Add member
                                           </Button>
                                       </Tooltip>
                                   </div>
                               </div>

                               <div className={styles.blockWrapper}>
                                   <SubTitlePage>Api Key</SubTitlePage>

                                   <div className={styles.inputsWrapper}>
                                       <div style={{position:"relative"}}>
                                           <AntdInput
                                               label={"Public API key"}
                                               value={currentBundle?.apiKey || ""}
                                               disabled={true}
                                               size={"large"}
                                           />
                                           {
                                               isAPICopy 
                                                   ? (
                                                       <Tooltip open={isAPICopy} title={"Copied!"}>
                                                           <CheckCircleFilled
                                                               className={styles.copyIcon}
                                                               style={{
                                                                   color: "green"
                                                               }}
                                                           />
                                                       </Tooltip>

                                                   )
                                                   : (
                                                       <CopyToClipboard
                                                           text={currentBundle?.apiKey || ""}
                                                           onCopy={handleCopyAPI}
                                                       >
                                                           <CopyOutlined
                                                               className={styles.copyIcon}
                                                           />
                                                       </CopyToClipboard>
                                                   )
                                           }
                                       </div>
                                   </div>
                               </div>

                               <div className={styles.blockWrapper}>
                                       <Button
                                           className={styles.deleteBtn}
                                           disabled={deleteLoading}
                                           loading={deleteLoading}
                                           onClick={() => setSureModal('bundleDelete')}
                                       >
                                           Delete translation bundle
                                       </Button>
                               </div>

                               {renderUnSaved()}
                           </>
                    )
                }
            </div>

            {
                <AreYouSureModal
                    isOpen={Boolean(sureModal)}
                    onSubmit={sureModal === "bundleDelete" ? handleDeleteBundle : () => handleDeleteUser(userToDelete)}
                    title={"Are you sure?"}
                    onClose={() =>{
                        setUserToDelete("")
                        setSureModal(null)
                    }}
                />
            }

        </HeaderWithContent>
    )
}