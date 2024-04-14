import {
    ArrowLeftOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import styles from "./CustomTrigger.module.css"
interface ICustomTriggerProps{
    isOpen: boolean
    text: string
    onClick: () => void
}
export default function CustomTrigger({isOpen,text,onClick}:ICustomTriggerProps){
    return(
        <div className={styles.triggerWrapper}  onClick={onClick}>
            {
                !isOpen
                    ? <ArrowLeftOutlined className={styles.collapseIcon}/>
                    : <ArrowRightOutlined className={styles.collapseIcon}/>
            }
            <span className={styles.collapseText}>
                {text}
            </span>
        </div>
    )
}