import styles from './AdjacencyMatrix.module.css';
import { Table, Tag, Tooltip } from 'antd';
import 'antd/dist/reset.css';
import { useMemo } from 'react';
import { convertToAdjMatrix } from '../../utils/graphUtils';


const AdjacencyMatrix = ({ nodes, edges, title = 'Матрица смежности', headers = null }) => {
    const matrix = useMemo(() => convertToAdjMatrix({ nodes, edges }), [nodes, edges]);
    headers = headers || nodes.map((_, index) => `V${index + 1}`);

    const dataSource = useMemo(() => matrix.map((row, rowIndex) => ({
        key: `row-${rowIndex}`,
        vertex: headers[rowIndex],
        ...Object.fromEntries(row.map((value, colIndex) => [`col${colIndex}`, value])),
    })), [matrix]);
    
    const columns = useMemo(() => [
        {
            title: title,
            dataIndex: 'vertex',
            key: 'vertex',
            render: (text) => <Tag color='blue'>{text}</Tag>
        },
        ...headers.map((header, index) => ({
            title: header,
            dataIndex: `col${index}`,
            key: `col${index}`,
            render: (value, record) => (
                <Tooltip title={value === 1 ? `Дуга: ${record.vertex} → ${headers[index]}` : ''}>
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
