import {Layout, Menu, MenuProps} from 'antd';
import {
    MenuOutlined,
    CloseOutlined,
    MessageOutlined,
    UserOutlined,
    SettingOutlined,
    SwapOutlined,
    HomeOutlined
} from '@ant-design/icons';
import styles from "./BurgerMenu.module.css";
import logoImg from "../../images/logo.svg";
import {ReactNode, useState} from "react";
import NavLinkItem from "../NavLink";
import SelectCompany from "../SelectCompany";
const {Header,Content} = Layout
export default function BurgerMenu({children }:{children?:ReactNode}){

    const [isOpen, setIsOpen] = useState(false)


    return(
        <Layout>
            <Header style={{backgroundColor:"#ffffff",zIndex: 99,  position: 'fixed', width:"100%"}} className={styles.header}>
                <div className={styles.headerLogoAndDropdown}>
                    <img
                        className={styles.logo}
                        src={logoImg}
                        alt={"Logo"}
                        width="40"
                        height="40"
                    />
                    <SelectCompany/>
                </div>

                {
                    isOpen
                        ? <CloseOutlined onClick={() => setIsOpen(false)}/>
                        : <MenuOutlined  onClick={() => setIsOpen(true)}/>
                }
                {
                    isOpen &&   (
                        <nav className={styles.navWrapper}>
                            <ul>
                                <NavLinkItem to={"/home"} Icon={<HomeOutlined className={styles.navIcon} />} text={"Home"}/>
                                <NavLinkItem to={"/translations"} Icon={<SwapOutlined className={styles.navIcon} />} text={"Translations"}/>
                                <NavLinkItem to={"/account"} Icon={<UserOutlined className={styles.navIcon} />} text={"Account"}/>
                                <NavLinkItem to={"/app-settings"} Icon={<SettingOutlined className={styles.navIcon} />} text={"App Settings"}/>
                            </ul>
                        </nav>
                    )
                }

            </Header>
            <Content  style={{ backgroundColor:"#ffffff", padding: 20}}>
                {children}
            </Content>
        </Layout>

    )
}