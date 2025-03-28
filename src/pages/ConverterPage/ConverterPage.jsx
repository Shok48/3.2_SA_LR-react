import Page from '../Page/Page'
import styles from './ConverterPage.module.css'
import IncidenceInput from '../../components/InsidenceInput/IncidenceInput'
import { Button } from 'antd'
import { TransactionOutlined } from '@ant-design/icons'

const ConverterPage = () => {

    return (
        <Page title="Конвертер">
            <div className={styles.converterPage}>
                <IncidenceInput/>
                <Button 
                    className={styles.converterButton} 
                    type="primary" 
                    icon={<TransactionOutlined />} 
                    onClick={() => {}}
                >Конвертировать</Button>
            </div>
            
        </Page>
    )
}

export default ConverterPage;