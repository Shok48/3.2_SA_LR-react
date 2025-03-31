import styles from './SubsistemsPage.module.css'
import { useState } from 'react'
import Page from '../Page/Page'
import IncidenceInput from '../../components/InсidenceInput/IncidenceInput'
import { Button, Table, Tag, Card, Typography, Space } from 'antd'
import { NodeIndexOutlined } from '@ant-design/icons'
import { convertRightIncData, topologicalDecomposition } from '../../utils/graphUtils'

const { Text, Title } = Typography;

const SubsistemsPage = () => {
    const title = 'Подсистемы';
    const [incidents, setIncidents] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [subsystems, setSubsystems] = useState(null);

    const onDataChange = (data) => {
        setIncidents(data);
    }

    const onSubmit = () => {
        const graphData = convertRightIncData(incidents);
        console.log("Граф данных", graphData);
        setGraphData(graphData);
        const subsystems = topologicalDecomposition(graphData);
        console.log("Подсистемы", subsystems);
        setSubsystems(subsystems);
    }

    const SubsistemsTable_LeftIncidents = () => {
        const cardTitle = 'Левые инциденты';

        const getLeftIncidents = (node) => graphData.edges.filter(edge => edge.target === node);

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
        ]

        const data = subsystems.map((subsystem, index) => ({
            subsystem: `S${index + 1}`,
            nodes: subsystem,
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
                            {leftIncidents.map((incident) => (
                                <div key={incident.source} className={styles.incidentItem}>
                                    <Tag color='red-inverse'>V{incident.source}</Tag>
                                    <Text style={{ margin: '0 4px' }}>→</Text>
                                    <Tag color='green-inverse'>V{incident.target}</Tag>
                                </div>
                            ))}
                        </Space>
                    ) : <Text type='secondary'>Нет входящих рёбер</Text>
                }
            }
        ]

        const expandedRowRender = (record) => {
            const expandedData = record.nodes.map((node) => ({
                key: node,
                node: `V${node}`,
                leftIncidents: getLeftIncidents(node)
            }))

            return <Table columns={expandedColumns} dataSource={expandedData} pagination={false} bordered rowKey='node' style={{ padding: 10 }}/>
        }

        return (
            <Card title={
                <Space align='center'>
                    <NodeIndexOutlined className={styles.headerIcon} />
                    <Title level={4} className={styles.headerTitle}>Левые инциденты</Title>
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
                <IncidenceInput onDataChange={onDataChange} />
                <Button type='primary' onClick={onSubmit} className={styles.submitButton}>Выделить подсистемы</Button>
                {
                    subsystems && <SubsistemsTable_LeftIncidents /> 
                }
            </div>
        </Page>
    )
}

export default SubsistemsPage
