import styles from "./LoginPage.module.css"
import logoImgPath from '../../images/logo.svg';
import AntdInput from "../../componets/AntdInput";
import { Form, Input} from "antd";
import AntdButton from "../../componets/AntdButton";

type FieldType = {
    email?: string;
    password?: string;
};
export default function LoginPage(){

    function onSubmit(values:FieldType){
        console.log('values',values)
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.logoWrapper}>
                <img
                    className={styles.logo}
                    src={logoImgPath}
                    alt={"Logo"}
                    width="40"
                    height="40"
                />
                <h1 className={styles.title}>Transletic</h1>
            </div>

            <div className={styles.formWrapper}>

                <Form
                    name={"Sign In ✌️"}
                    initialValues={{remember: true}}
                    onFinish={onSubmit}
                    style={{maxWidth: 500, width: "90%"}}
                    autoComplete="off"
                >

                    <h2 className={styles.secondaryTitle}>Sign In ✌️</h2>

                    <Form.Item<FieldType>
                        name={"email"}
                        rules={[{type: 'email', required: true, message: 'Required field'}]}
                    >
                        <AntdInput
                            label={"Email"}
                            value={""}
                            size={"large"}
                            placeholder={"Enter your email"}
                            rightText={"Required"}
                        />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name={"password"}
                        rules={[{required: true, message: 'Required field'}]}
                    >
                        <AntdInput
                            label={"Password"}
                            value={""}
                            size={"large"}
                            customInput={<Input.Password className={styles.hoverFocusInput}/>}
                            placeholder={"Enter your password"}
                            rightText={"Required"}
                        />
                    </Form.Item>

                    <AntdButton
                        btnTitle={"Sign in"}
                        type={"primary"}
                        htmlType={"submit"}
                        onPress={() => null}
                        className={styles.submitBtn}
                    />

                    <span className={styles.newUserText}>
                        New user?
                        <a href={"/registration"} className={styles.newUserTextAccent}>    Create an account</a>
                    </span>
                </Form>
            </div>

        </div>
    )
}