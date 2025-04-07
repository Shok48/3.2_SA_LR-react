import styles from './SubsistemsPage.module.css'
import { useState, useEffect } from 'react'
import Page from '../Page/Page'
import IncidenceInput from '../../components/InсidenceInput/IncidenceInput'
import { Button, Table, Tag, Card, Typography, Space } from 'antd'
import { NodeIndexOutlined } from '@ant-design/icons'
import { convertRightIncData, topologicalDecomposition } from '../../utils/graphUtils'
import DirectedGraphVisualizer from '../../components/DirectedGraphVisualizer/DirectedGraphVisualizer'

const { Text, Title } = Typography;

const SubsistemsPage = () => {
    const title = 'Подсистемы';
    const [incidents, setIncidents] = useState(null);
    const [graphData, setGraphData] = useState({nodes: [], edges: []});
    const [subsystems, setSubsystems] = useState(null);

    const onDataChange = (data) => {
        setIncidents(data);
    }

    useEffect(() => {
        incidents && setGraphData(convertRightIncData(incidents));
    }, [incidents])

    const onSubmit = () => {
        const graphData = convertRightIncData(incidents);
        console.log("Граф данных", graphData);
        const subsystems = topologicalDecomposition(graphData);
        console.log("Подсистемы", subsystems);
        setSubsystems(subsystems);
    }

    const SubsistemsTable_LeftIncidents = () => {
        const cardTitle = 'Левые инциденты';

        const getLeftIncidents = (node) => graphData.edges.filter(edge => edge.target === node);

        const getSubsystemLeftIncidents = (subIndex, subsystems, graph) => {
            const nodeToSubsystem = {};
            subsystems.forEach((subsystem, idx) => {
                subsystem.forEach(node => nodeToSubsystem[node] = idx);
            });

            const uniqueEdges = new Set();
            const incidents = [];

            graph.edges.forEach(edge => {
                const sourceSub = nodeToSubsystem[edge.source];
                const targetSub = nodeToSubsystem[edge.target];
                
                if (targetSub === subIndex && sourceSub !== subIndex) {
                    const edgeKey = `${sourceSub}-${targetSub}`;
                    if (!uniqueEdges.has(edgeKey)) {
                        uniqueEdges.add(edgeKey);
                        incidents.push({
                            source: sourceSub,
                            target: targetSub
                        });
                    }
                }
            });

            return incidents;
        }

        const columns = [
            {
                title: 'Подсистемы',
                dataIndex: 'subsystem',
                key: 'subsystem',
                render: (text) => <Tag color='blue-inverse'>{text}</Tag>
            },
            {
                title: 'Вершины',
                dataIndex: 'nodes',
                key: 'nodes',
                render: (nodes) => {
                    return nodes.map((node) => (<Tag key={node} color='green-inverse'>V{node}</Tag>))
                }
            },
            {
                title: 'Левые инциденции',
                dataIndex: 'leftInc',
                key: 'leftInc',
                render: (leftInc) => {
                    return leftInc.length > 0 ? (
                        <Space>
                            <Text>&#123;</Text>
                            {leftInc.map((incident, index) => (
                                <div key={incident.source} className={styles.incidentItem}>
                                    <Tag color='red-inverse' style={{marginRight: 0}}>S{incident.source + 1}</Tag>
                                    <Text>{index === leftInc.length - 1 ? '' : ';' }</Text>
                                </div>
                            ))}
                            <Text style={{ margin: '0' }}>&#125;</Text>
                            <Text style={{ margin: '0 4px' }}>→</Text>
                            <Tag color='green-inverse'>S{leftInc[0].target + 1}</Tag>
                        </Space>
                    ) : <Text type='secondary'>Нет входящих рёбер</Text>
                }
            },
        ]

        const data = subsystems.map((subsystem, index) => ({
            subsystem: `S${index + 1}`,
            nodes: subsystem,
            leftInc: getSubsystemLeftIncidents(index, subsystems, graphData)
        }));
        
        const expandedColumns = [
            {
                title: 'Вершина',
                dataIndex: 'node',
                key: 'node',
                render: (text) => <Tag color='green-inverse'>{text}</Tag>
            },
            {
                title: 'Левые инциденты',
                dataIndex: 'leftIncidents',
                key: 'leftIncidents',
                render: (leftIncidents) => {
                    return leftIncidents.length > 0 ? (
                        <Space>
                            <Text>&#123;</Text>
                            {leftIncidents.map((incident, index) => (
                                <div key={incident.source} className={styles.incidentItem}>
                                    <Tag color='red-inverse' style={{marginRight: 0}}>V{incident.source}</Tag>
                                    <Text>{index === leftIncidents.length - 1 ? '' : ';' }</Text>
                                </div>
                            ))}
                            <Text style={{ margin: '0' }}>&#125;</Text>
                            <Text style={{ margin: '0 4px' }}>→</Text>
                            <Tag color='green-inverse'>V{leftIncidents[0].target}</Tag>
                        </Space>
                    ) : <Text type='secondary'>Нет входящих рёбер</Text>
                }
            }
        ]

        const expandedRowRender = (record) => {
            const expandedData = record.nodes.map((node) => ({
                key: node,
                node: `V${node}`,
                leftIncidents: getLeftIncidents(node).filter((edge) => record.nodes.includes(edge.source)),
            }))

            return (
                <Table 
                    columns={expandedColumns} 
                    dataSource={expandedData} 
                    pagination={false} 
                    bordered 
                    rowKey='node' 
                    style={{ padding: 10 }}
                />
            )
        }

        return (
            <Card title={
                <Space align='center'>
                    <NodeIndexOutlined className={styles.headerIcon} />
                    <Title level={4} className={styles.headerTitle}>{cardTitle}</Title>
                </Space>
            }>
                <Table 
                    columns={columns}
                    dataSource={data}
                    expandable={{ expandedRowRender, defaultExpandedRowKeys: ['S1'] }}
                    pagination={false}
                    bordered
                    rowKey='subsystem'
                />
            </Card>
        )
    }

    return (
        <Page title={title}>
            <div className={styles.subsistemsPage}>
                <Space direction="horizontal" align="start" justify='space-between' style={{justifyContent: 'space-between'}}>
                    <Space direction="vertical" style={{  width: '100%' }}>
                        <IncidenceInput onDataChange={onDataChange} />
                        <Button type="primary" onClick={onSubmit}>Выделить подсистемы</Button>
                    </Space>
                    {graphData.nodes.length > 0 && (
                        <div style={{width: '900px', flex: 1 }}>
                            <DirectedGraphVisualizer nodes={graphData.nodes} edges={graphData.edges} />
                        </div>
                    )}
                </Space>
                {
                    subsystems && <SubsistemsTable_LeftIncidents /> 
                }
            </div>
        </Page>
    )
}

export default SubsistemsPage
