import React, { useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import styles from './DirectedGraphVisualizer.module.css';

const nodeWidth = 100;
const nodeHeight = 100;

const getHandlePositions = (direction) => {
  switch (direction) {
    case 'TB': // Top to Bottom
      return { sourcePosition: Position.Bottom, targetPosition: Position.Top };
    case 'BT': // Bottom to Top
      return { sourcePosition: Position.Top, targetPosition: Position.Bottom };
    case 'RL': // Right to Left
      return { sourcePosition: Position.Left, targetPosition: Position.Right };
    case 'LR': // Left to Right (default)
    default:
      return { sourcePosition: Position.Right, targetPosition: Position.Left };
  }
};

const NodeWithDynamicHandles = ({ data, direction = 'LR' }) => {
  const { sourcePosition, targetPosition } = getHandlePositions(direction);
  
  return (
    <div className={styles['circle-node']}>
      <Handle type="target" position={targetPosition} />
      <div>{data.label}</div>
      <Handle type="source" position={sourcePosition} />
    </div>
  );
};

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const { sourcePosition, targetPosition } = getHandlePositions(direction);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      targetPosition,
      sourcePosition,
      draggable: true,
    };
  });
};

const DirectedGraphVisualizerInner = ({ nodes: propNodes, edges: propEdges, direction = 'LR' }) => {
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const nodeTypes = useMemo(() => ({
    circle: ({ data }) => <NodeWithDynamicHandles data={data} direction={direction} />
  }), [direction]);

  const generateFlowElements = useCallback(() => {
    const rfNodes = propNodes.map((id) => ({
      id: String(id),
      type: 'circle',
      data: { label: `V${id}` },
      position: { x: 0, y: 0 },
    }));

    const rfEdges = propEdges.map(({ source, target }, index) => ({
      id: `e${source}-${target}-${index}`,
      source: String(source),
      target: String(target),
      animated: true,
      markerEnd: { type: 'arrowclosed' },
    }));

    const layoutedNodes = getLayoutedElements(rfNodes, rfEdges, direction);
    setFlowNodes(layoutedNodes);
    setFlowEdges(rfEdges);
    
    window.requestAnimationFrame(() => fitView({ duration: 200 }));
  }, [propNodes, propEdges, fitView, direction]);

  useEffect(() => {
    generateFlowElements();
  }, [generateFlowElements]);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Controls position='bottom-right' />
        <Background variant='none' gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

const DirectedGraphVisualizer = ({ direction = 'LR', ...props }) => {
  return (
    <ReactFlowProvider>
      <DirectedGraphVisualizerInner direction={direction} {...props} />
    </ReactFlowProvider>
  );
};

export default DirectedGraphVisualizer;