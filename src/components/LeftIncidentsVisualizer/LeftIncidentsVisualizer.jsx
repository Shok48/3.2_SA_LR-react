import React from 'react';
import { Table, Card, Select, Tag, Typography } from 'antd';
import { NodeIndexOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './LeftIncidentsVisualizer.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

const LeftIncidentsVisualizer = ({ graph }) => {
  const [selectedNode, setSelectedNode] = React.useState('all');

  const getLeftIncidents = (node) => {
    return graph.edges.filter(edge => edge.target === node);
  };

  const tableData = selectedNode === 'all'
    ? graph.nodes.map(node => ({
        key: node,
        node,
        incidents: getLeftIncidents(node),
      }))
    : [{
        key: selectedNode,
        node: selectedNode,
        incidents: getLeftIncidents(selectedNode),
      }];

  const columns = [
    {
      title: 'Вершина',
      dataIndex: 'node',
      key: 'node',
      render: (text) => <Tag color="orange">{text}</Tag>,
      width: 100,
    },
    {
      title: 'Левые инциденции (входящие рёбра)',
      key: 'incidents',
      render: (_, record) => (
        <div className={styles.incidentsContainer}>
          {record.incidents.length > 0 ? (
            record.incidents.map((incident, idx) => (
              <React.Fragment key={idx}>
                <div className={styles.incidentItem}>
                    <Tag color="blue">{incident.source}</Tag>
                  <Text style={{ margin: '0 4px' }}>→</Text>
                  <Tag color="green">{incident.target}</Tag>
                </div>
              </React.Fragment>
            ))
          ) : (
            <Text type="secondary">Нет входящих рёбер</Text>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card 
      className={styles.container}
      title={
        <div className={styles.header}>
          <NodeIndexOutlined className={styles.headerIcon} />
          <Title level={4} className={styles.headerTitle}>Левые инциденции графа</Title>
        </div>
      }
      extra={
        <Select
          className={styles.selector}
          placeholder="Выберите вершину"
          onChange={setSelectedNode}
          value={selectedNode}
        >
          <Option value="all">Показать все</Option>
          {graph.nodes.map(node => (
            <Option key={node} value={node}>
              {node}
            </Option>
          ))}
        </Select>
      }
    >
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        locale={{
          emptyText: 'Граф не содержит вершин',
        }}
      />
    </Card>
  );
};

LeftIncidentsVisualizer.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ])
    ).isRequired,
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]).isRequired,
        target: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default LeftIncidentsVisualizer;