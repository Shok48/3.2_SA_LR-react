import styles from './AdjacencyMatrix.module.css';
import { Table, Tag, Tooltip } from 'antd';
import 'antd/dist/reset.css';
import { useMemo } from 'react';
import { convertToAdjMatrix } from '../../utils/graphUtils';


const AdjacencyMatrix = ({ nodes, edges, title = 'Матрица смежности' }) => {
    const matrix = useMemo(() => convertToAdjMatrix({ nodes, edges }), [nodes, edges]);

    const dataSource = useMemo(() => matrix.map((row, rowIndex) => ({
        key: `row-${rowIndex}`,
        vertex: `v${rowIndex + 1}`,
        ...Object.fromEntries(row.map((value, colIndex) => [`col${colIndex}`, value])),
    })), [matrix]);
    
    const columns = useMemo(() => [
        {
            title: title,
            dataIndex: 'vertex',
            key: 'vertex',
            render: (text) => <Tag color='blue'>{text}</Tag>
        },
        ...nodes.map((node, index) => ({
            title: `v${index + 1}`,
            dataIndex: `col${index}`,
            key: `col${index}`,
            render: (value, record) => (
                <Tooltip title={value === 1 ? `Дуга: ${record.vertex} → v${index + 1}` : ''}>
                    <Tag color={value === 1 ? 'green' : 'default'}>{value}</Tag>
                </Tooltip>
            )
        }))
    ], [nodes, title]);

    return (
        <Table 
            className={styles.adjacencyMatrix}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered  
        />
    )
}

export default AdjacencyMatrix;
