import Page from '../Page/Page';
import styles from './HierarchyPage.module.css';
import IncidenceInput from '../../components/InsidenceInput/IncidenceInput';
import AdjacencyMatrix from '../../components/AdjacencyMatrix/AdjacencyMatrix'
import { useState } from 'react';
import { convertLefIncData, getHierarchyLevels } from '../../utils/graphUtils';
import { Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const HierarchyPage = () => {
    const title = 'Выделение иерархических уровней';
    const [graphData, setGraphData] = useState(null);
    const [hierarchyGraph, setHierarchyGraph] = useState(null);
    const [mapping, setMapping] = useState(null);
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
        const { newGraphData, mapping } = renumberGraph(graphData, hierarchy);
        console.log('newGraphData', newGraphData);
        setHierarchyGraph(newGraphData);
        console.log('mapping', mapping);
        setMapping(mapping);
    }

    const renumberGraph = (data, HL) => {
        const { nodes, edges } = data;

        const nodeMap = new Map();
        let newId = 1;
        for (const level of HL) {
            for (const node of level.level) {
                nodeMap.set(node, newId++);
            }
        }

        const newEdges = edges.map((edge) => ({
            source: nodeMap.get(edge.source),
            target: nodeMap.get(edge.target),
        }))

        const newGraphData = {
            nodes: Array.from(nodeMap.values()),
            edges: newEdges,
        }

        return { 
            newGraphData,
            mapping: nodeMap
        }
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
                {graphData && (
                    <AdjacencyMatrix 
                        nodes={graphData.nodes}
                        edges={graphData.edges}
                    />
                )}
                {hierarchyGraph && (
                    <AdjacencyMatrix 
                        nodes={hierarchyGraph.nodes}
                        edges={hierarchyGraph.edges}
                        headers={Array.from(mapping.entries()).map(([key, value]) => `V'${value} (V${key})`)}
                    />
                )}
            </div>
        </Page>
    );
};

export default HierarchyPage;
