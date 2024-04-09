import { TailSpin } from 'react-loader-spinner';
import styles from './Loader.module.css';
export default function Loader(){
    return (
        <div className={styles.wrap}>
            <TailSpin color="#4A56E2" height={80} width={80} />
        </div>
    );
}