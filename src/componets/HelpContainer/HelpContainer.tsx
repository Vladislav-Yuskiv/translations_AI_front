import styles from "./HelpContainer.module.css"
import {
    WechatWorkOutlined,
    ReadOutlined,
    CopyOutlined
} from '@ant-design/icons';
export default function HelpContainer(){

    return(
        <div className={styles.wrapper}>
            <ul className={styles.listContainer}>
                <li className={styles.helpItem1}>
                    <WechatWorkOutlined className={styles.helpItemIcon}/>
                    <span className={styles.helpText}>Chat</span>
                </li>
                <li className={styles.helpItem}>
                    <div className={styles.additionalHelpWrap}>
                        <div className={styles.additionalHelpWrapInner}>
                            <ReadOutlined className={styles.helpItemIcon}/>
                            <p className={styles.helpText}>Emails us</p>
                        </div>
                        <div className={styles.additionalHelpWrapInner} style={{paddingLeft: 14}}>
                            <p className={styles.additionalHelpText}>support@transletic.com</p>
                            <CopyOutlined style={{fontSize: 18,color: "rgba(0,0,0,0.3)"}}/>
                        </div>

                    </div>
                </li>
                <li className={styles.helpItem1}>
                    <ReadOutlined className={styles.helpItemIcon}/>
                    <span className={styles.helpText}>Read docs</span>
                </li>
            </ul>
        </div>
    )
}