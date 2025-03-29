import Page from '../Page/Page'
import styles from './ConverterPage.module.css'
import IncidenceInput from '../../components/InsidenceInput/IncidenceInput'
import { Button } from 'antd'
import { TransactionOutlined, PlayCircleOutlined  } from '@ant-design/icons'
import { useState } from 'react'
import { convertLefIncData, convertToAdjMatrix } from '../../utils/graphUtils'
import AdjacencyMatrix from '../../components/AdjacencyMatrix/AdjacencyMatrix'
import IncidenceMatrix from '../../components/IncidenceMatrix/IncidenceMatrix'

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
        const adjMatrix = convertToAdjMatrix(graphData);
        console.log('Матрица смежности', adjMatrix);
    }

    return (
        <Page title={title}>
            <div className={styles.converterPage}>
                <IncidenceInput onDataChange={handleDataChange}/>
                <Button 
                    className={styles.converterButton} 
                    type="primary" 
                    icon={<PlayCircleOutlined  />} 
                    onClick={convertData}
                >Конвертировать</Button>
                {graphData && (
                    <>
                        <AdjacencyMatrix 
                            nodes={graphData.nodes} 
                            edges={graphData.edges} 
                        />
                        <IncidenceMatrix
                            nodes={graphData.nodes}
                            edges={graphData.edges}
                        />
                    </>
                    
                )}
            </div>
        </Page>
    )
}

export default ConverterPage;