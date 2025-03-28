import Page from '../Page/Page';
import styles from './HierarchyPage.module.css';
import IncidenceInput from '../../components/InsidenceInput/IncidenceInput';
import { useState, useEffect } from 'react';
import { convertLefIncData, getHierarchyLevels } from '../../utils/graphUtils';
import { Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';


const HierarchyPage = () => {
    const title = 'Выделение иерархических уровней';
    const [graphData, setGraphData] = useState(null);
    const [hierarchyGraph, setHierarchyGraph] = useState(null);
    const [incData, setIncData] = useState({});

    const handleDataChange = (data) => {
        setIncData(data);
    }

    const handleHierarchy = () => {
        console.log('Множество инциденций', incData);
        const graphData = convertLefIncData(incData);
        console.log('Граф данных', graphData);
        setGraphData(graphData);
        const hierarchy = getHierarchyLevels(graphData);
        console.log('Иерархические уровни', hierarchy);
    }

    return (
        <Page title={title}>
            <div className={styles.hierarchyPage}>
                <IncidenceInput onDataChange={handleDataChange}/>
                <Button 
                    className={styles.hierarchyButton} 
                    type="primary" 
                    icon={<PlayCircleOutlined  />} 
                    onClick={handleHierarchy}
                >Выделить иерархические уровни</Button>
            </div>
        </Page>
    );
};

export default HierarchyPage;
