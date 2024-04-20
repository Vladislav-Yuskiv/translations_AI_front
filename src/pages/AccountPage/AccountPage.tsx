import HeaderWithContent from "../../componets/HeaderWithContent";
import {HeaderPage, SubTitlePage} from "../../componets/StyledComponents";
import AntdInput from "../../componets/AntdInput";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import userSelectors from "../../redux/user/userSelectors";
import { CloseOutlined } from '@ant-design/icons';
import styles from "./AccountPage.module.css";
import {Button, Input, Modal, Popconfirm} from "antd";
import AntdButton from "../../componets/AntdButton";
import {changePassword, logOut, setShowUnsaved, updateUser} from "../../redux/user/userSlice";
import Unsaved from "../../componets/Unsaved";

export default function AccountPage(){
    document.title = "Translatic | Account";

    const dispatch = useDispatch();

    const email = useSelector(userSelectors.getUserEmail)
    const userId = useSelector(userSelectors.getUserId)
    const name = useSelector(userSelectors.getUserName)
    const updateLoading = useSelector(userSelectors.getUserIsLoading)
    const showUnsaved = useSelector(userSelectors.getShowUnsaved)

    const [userName, setUserName] = useState(name ||  "");
    const [userEmail, setUserEmail] = useState(email ||  "");
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState( "");
    const [hasChangePasswordError, setChangePasswordError] = useState( false);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if(userEmail === email && userName === name && showUnsaved){
            dispatch(setShowUnsaved(false))
        }
    }, [userEmail,userName]);

    async function handlePasswordChange() {
        try{
            setLoading(true)
            if(newPassword !== confirmPassword){
                setLoading(false)
                setChangePasswordError(true)
                return
            }
            await  dispatch(changePassword({email, newPassword}))
            setLoading(false)
            setChangePasswordModal(false)
            console.log("update password")
        }catch (e) {
            console.log("Error in handlePasswordChange",e)
        }
    }

    async function handleSaveChnages() {
        try{
            await dispatch(updateUser(userId,{name: userName, email:userEmail}))
        }catch (e) {
            console.log("Error in handlePasswordChange",e)
        }
    }

    function handleLogOut(){
        dispatch(logOut())
    }

    const renderUnSaved = useCallback(() => {
        return (
            <Unsaved/>
        )
    },[showUnsaved])

    return(
        <HeaderWithContent>
            <div className={styles.wrapper}>
                <HeaderPage>Acccount</HeaderPage>

                <div className={styles.blockWrapper}>
                    <SubTitlePage>General</SubTitlePage>

                    <div className={styles.inputsWrapper}>

                        <AntdInput
                            value={userName}
                            label={"Name"}
                            required
                            size={"large"}
                            onChange={(e) => {
                                setUserName(e.target.value)
                                if(!showUnsaved) dispatch(setShowUnsaved(true))
                            }}
                        />

                        <AntdInput
                            value={userEmail}
                            onChange={(e) => {
                                setUserEmail(e.target.value)
                                if(!showUnsaved) dispatch(setShowUnsaved(true))
                            }}
                            label={"Email"}
                            size={"large"}
                        />

                        <p
                            className={styles.changeText}
                            onClick={() => setChangePasswordModal(true)}
                        >
                            Change password
                        </p>

                        <AntdButton
                            style={{
                                color: updateLoading
                                || userName.trim() === ""
                                || userEmail.trim() === ""
                                ||  !showUnsaved
                                    ? "#000000"
                                    : "white",
                                fontSize: 14,
                                fontWeight: 500,
                                marginTop: 20
                            }}
                            btnTitle={"Save Changes"}
                            className={styles.footerModalBtn}
                            onPress={handleSaveChnages}
                            loading={updateLoading}
                            disabled={updateLoading || userName.trim() === "" || userEmail.trim() === "" || !showUnsaved}
                        />

                    </div>


                </div>
                <div className={styles.blockWrapper}>
                    <Popconfirm
                        title="Are you sure?"
                        onConfirm={handleLogOut}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className={styles.logOutBtn}>
                            Log out
                        </Button>
                    </Popconfirm>

                </div>
                {renderUnSaved()}
            </div>

            <Modal
                open={changePasswordModal}
                title={"Change password"}
                onCancel={() => setChangePasswordModal(false)}
                style={{
                    width: 600,
                    height: 400
                }}
                footer={
                    <ModalFooter
                        onSubmit={handlePasswordChange}
                        loading={loading}
                    />
                }
                closeIcon={ <CloseOutlined />}
            >
                <div style={{marginTop: 15}}>
                    <AntdInput
                        label={'New password'}
                        value={newPassword}
                        size={"large"}
                        customInput={<Input.Password className={styles.hoverFocusInput} />}
                        rightText={"Required"}
                        onChange={(e) => {
                            setNewPassword(e.target.value)
                        }}
                    />
                </div>

                <div style={{marginTop: 15}}>
                    <AntdInput
                        label={"Confirm new password"}
                        customInput={<Input.Password className={styles.hoverFocusInput}/>}
                        value={confirmPassword}
                        rightText={"Required"}
                        size={"large"}
                        onChange={(e) => {
                            if(hasChangePasswordError) setChangePasswordError(false)
                            setConfirmPassword(e.target.value)
                        }}
                    />
                </div>

                {
                    hasChangePasswordError && (
                        <p className={styles.errorText}>Password and confirmation password do not match</p>
                    )
                }

            </Modal>
        </HeaderWithContent>
    )
}


interface IModalFooter{
    onSubmit: () => Promise<void>
    loading: boolean
}
function ModalFooter({onSubmit,loading}: IModalFooter){

    return(
            <AntdButton
                btnTitle={"Change password"}
                onPress={async () => {
                    await  onSubmit()
                }}
                style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: 500,
                    marginTop: 20
                }}
                disabled={loading}
                className={styles.footerModalBtn}
                loading={loading}
            />
    )
}