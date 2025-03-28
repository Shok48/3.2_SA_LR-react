import styles from './IncidenceMatrix.module.css';
import { Table, Tag, Tooltip } from 'antd';
import { convertToIncMatrix } from '../../utils/graphUtils';
import 'antd/dist/reset.css';
import { useMemo } from 'react';

const IncidenceMatrix = ({ nodes, edges, title = 'Матрица инцидентности' }) => {
    const matrix = useMemo(() => convertToIncMatrix({ nodes, edges}), [nodes, edges]);
    
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
        ...edges.map((edge, edgeIndex) => ({
            title: `e${edgeIndex + 1}`,
            dataIndex: `col${edgeIndex}`,
            key: `col${edgeIndex}`,
            render: (value) => (
                <Tooltip title={value === -1 ? `Начало дуги: e${edgeIndex + 1}` : value === 1 ? `Конец дуги: e${edgeIndex + 1}` : ''}>
                    <Tag color={value === -1 ? 'red' : value === 1 ? 'green' : 'default'}>{value}</Tag>
                </Tooltip>
            )
        }))
    ], [edges, title]);

    return (
        <Table
            className={styles.table}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
        />
    )
}

export default IncidenceMatrix;