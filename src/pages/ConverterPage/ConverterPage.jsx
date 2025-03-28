import Page from '../Page/Page'
import styles from './ConverterPage.module.css'
import IncidenceInput from '../../components/InsidenceInput/IncidenceInput'
import { Button } from 'antd'
import { TransactionOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { convertLefIncData } from '../../utils/graphUtils'

const ConverterPage = () => {
    const title = 'Конвертер левых инцидентов в матрицы смежности и инцидентности';
    const [graphData, setGraphData] = useState(null);
    const [incData, setIncData] = useState({});

    const handleDataChange = (data) => {
        setIncData(data);
    }

    const convertData = () => {
        console.log('Левые инциденты', incData);
        const graphData = convertLefIncData(incData);
        setGraphData(graphData);
        console.log('Граф данных', graphData);
    }

    return (
        <Page title={title}>
            <div className={styles.converterPage}>
                <IncidenceInput onDataChange={handleDataChange}/>
                <Button 
                    className={styles.converterButton} 
                    type="primary" 
                    icon={<TransactionOutlined />} 
                    onClick={convertData}
                >Конвертировать</Button>
            </div>
            
        </Page>
    )
}

export default ConverterPage;