import React, {ReactNode, useState} from 'react';
import {
    HomeOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import NavLinkItem from "../NavLink";
import styles from "./Sidebar.module.css";
import logoImg from "../../images/logo.svg";
import SelectCompany from "../SelectCompany";
import CustomTrigger from "../CustomTrigger";
import {useDispatch, useSelector} from "react-redux";
import {userSelectors} from "../../redux/user";
import {setCollapsed} from "../../redux/user/userSlice";
import HelpContainer from "../HelpContainer";


const { Header, Content, Footer, Sider } = Layout;

function Sidebar({ children }:{children?:ReactNode}) {

    const dispatch = useDispatch();

    const collapsed = useSelector(userSelectors.getCollapsed);

    const [isHelpedOpen,setHelpOpen] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }} className={styles.container}>
            <Sider
                collapsible
                style={{backgroundColor:"#ffffff"}}
                collapsed={collapsed}
                className={styles.sider}
                trigger={null}
                collapsedWidth={44}
                breakpoint={"sm"}
            >
                <div className={styles.siderInnerWrapper}>
                    <nav className={styles.navVerticalWrapper}>
                        <div>
                            <a href={"/"} className={styles.logoWrapper}>
                                <img
                                    className={styles.navVerticalIcon}
                                    src={logoImg}
                                    alt={"Logo"}
                                    width="56"
                                    height="56"
                                />
                                <span className={styles.logoText}>
                                Translatic
                            </span>
                            </a>
                        </div>

                        <NavLinkItem to={"/home"} Icon={<HomeOutlined className={styles.navVerticalIcon} />} text={"Home"}/>
                        <NavLinkItem to={"/translations"} Icon={<SwapOutlined className={styles.navVerticalIcon} />} text={"Translations"}/>
                    </nav>

                    <div  className={styles.triggerContainer}>
                        <CustomTrigger
                            text={"Collapse"}
                            isOpen={collapsed}
                            onClick={() => dispatch(setCollapsed(!collapsed))}
                        />
                    </div>

                </div>

            </Sider>
            <Layout>
                <Header className={styles.headerWrapper}>

                        <div className={styles.selectWithIconContainer}>
                            <div className={styles.selectIconWrapper}>
                                <span className={styles.selectIconWrapperText}>{"Company".charAt(0)}</span>
                            </div>
                            <SelectCompany/>
                        </div>


                    <nav className={styles.navWrapper}>

                        <div style={{position:"relative"}}>
                            <div onClick={() => setHelpOpen(!isHelpedOpen)}>
                                <p style={{ color: isHelpedOpen ? "rgba(103, 32, 255)" :"#000000"}}>Help</p>
                            </div>

                            {
                                isHelpedOpen && (
                                    <div className={styles.helpWrap}>
                                        <HelpContainer/>
                                    </div>
                                )
                            }
                        </div>


                        <NavLinkItem to={"/app-settings"} text={"App Settings"}/>
                        <NavLinkItem to={"/account"}  text={"Account"}/>
                    </nav>


                </Header>

                <Content className={styles.contentWrapper}>
                    { children }
                </Content>

                <Footer className={styles.footerWrapper}>
                    Transletic ©{new Date().getFullYear()} Created by Vladyslav Yuskiv
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Sidebar;