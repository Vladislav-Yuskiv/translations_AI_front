import styles from "./AntdButton.module.css"
import {Button} from "antd";
import {ButtonProps} from "antd/es/button/button";

interface IAntdButtonProps extends ButtonProps{
    btnTitle:string
    onPress: () => void
}
export default function AntdButton({
                                       btnTitle,
                                       onPress,
                                        ...props
                                   }:IAntdButtonProps){
    return(
        <Button
            onClick={onPress}
            className={styles.button}
            {...props}
        >
            {btnTitle}
        </Button>
    )
}