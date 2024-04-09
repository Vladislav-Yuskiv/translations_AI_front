import styles from "./RegistrationPage.module.css"
import logoImg from '../../images/logo.svg';
import AntdInput from "../../componets/AntdInput";
import {Form, Input, Select, SelectProps} from "antd";
import AntdButton from "../../componets/AntdButton";

type FieldType = {
    name?: string;
    email?: string;
    password?:string;
    howHear?: string;
};

const options: SelectProps['options'] = [
    {label:"Recommendation",value:"Recommendation"},
    {label:"LinkedIn",value:"LinkedIn"},
    {label:"Github",value:"Github"},
    {label:"Event",value:"Event"},
    {label:"Other",value:"other"},
];

export default function RegistrationPage(){

    function onSubmit(values:FieldType){
        console.log('values',values)
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.logoWrapper}>
                <img
                    className={styles.logo}
                    src={logoImg}
                    alt={"Logo"}
                    width="40"
                    height="40"
                />
                <h1 className={styles.title}>Transletic</h1>
            </div>

            <div className={styles.formWrapper}>

                <Form
                    name={"Sign up 🤝"}
                    initialValues={{remember: true}}
                    onFinish={onSubmit}
                    style={{maxWidth: 500, width: "90%"}}
                    autoComplete="off"
                >

                    <h2 className={styles.secondaryTitle}>Sign Up 🤝</h2>

                    <Form.Item<FieldType>
                        name={"name"}
                        rules={[{required: true, message: 'Required field'}]}
                    >
                        <AntdInput
                            label={"Email"}
                            value={""}
                            size={"large"}
                            placeholder={"Enter your name"}
                            rightText={"Required"}
                        />
                    </Form.Item>

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

                    <Form.Item<FieldType>
                        name={"howHear"}
                        rules={[{required: true, message: 'Required field'}]}
                    >
                        <AntdInput
                            label={"How did you hear about us?"}
                            value={""}
                            size={"large"}
                            customInput={
                                <Select
                                    options={options}
                                />
                            }
                            placeholder={"Choose an option"}
                            rightText={"Required"}
                        />
                    </Form.Item>

                    <div className={styles.submitWrapper}>
                        <AntdButton
                            btnTitle={"Sign in"}
                            type={"primary"}
                            htmlType={"submit"}
                            onPress={() => null}
                            className={styles.submitBtn}
                        />

                        <span className={styles.termsText}>
                            By signing up to Adapty you agree to
                               <a href={"https://goggle.com"} className={styles.termsTextAccent}> Terms of Service </a>
                                and
                                <a href={"https://goggle.com"} className={styles.termsTextAccent}> Privacy Policy</a>
                                .
                        </span>
                    </div>


                    <span className={styles.newUserText}>
                        Already have an account?
                        <a href={"/login"} className={styles.newUserTextAccent}>    Sign in</a>
                    </span>
                </Form>
            </div>

        </div>
    )
}