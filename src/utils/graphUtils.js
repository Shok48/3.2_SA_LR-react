export const convertLefIncData = (leftIncData) => {
    const nodes = Object.keys(leftIncData).map(Number);
    const edges = Object.entries(leftIncData).reduce((acc, [node, neighbors]) => {
        neighbors.forEach(neighbor => {
            acc.push({
                source: Number(neighbor),
                target: Number(node)
            });
        });
        return acc;
    }, []);

    return {
        nodes,
        edges,
    };
};

export const convertRightIncData = (rightIncData) => {
    const nodes = Object.keys(rightIncData).map(Number);
    const edges = Object.entries(rightIncData).reduce((acc, [node, neighbors]) => {
        neighbors.forEach(neighbor => {
            acc.push({
                source: Number(node),
                target: Number(neighbor)
            });
        });
        return acc;
    }, []);

    return {
        nodes,
        edges,
    };
}

export const convertToAdjMatrix = ({nodes, edges}) => {
    const adjMatrix = Array(nodes.length).fill(null).map(() => Array(nodes.length).fill(0));

    edges.forEach(({ source, target }) => {
        const sourceIndex = nodes.indexOf(source);
        const targetIndex = nodes.indexOf(target);
        if (sourceIndex !== -1 && targetIndex !== -1) {
            adjMatrix[sourceIndex][targetIndex] = 1;
        }
    });

    return adjMatrix;
}

export const convertToIncMatrix = ({nodes, edges}) => {
    const incMatrix = Array(nodes.length).fill(null).map(() => Array(edges.length).fill(0));

    edges.forEach(({ source, target }, edgeIndex) => {
        const sourceIndex = nodes.indexOf(source);
        const targetIndex = nodes.indexOf(target);

        if (sourceIndex !== -1 && targetIndex !== -1) {
            incMatrix[sourceIndex][edgeIndex] = -1;
            incMatrix[targetIndex][edgeIndex] = 1;
        }
    });

    return incMatrix;
}

export const getHierarchyLevels = ({nodes, edges}) => {
    const HL = []; // Иерархические уровни
    const usedV = new Set(); // Используем множество для быстрого поиска
    let notUsedV = new Set(nodes); // Оставшиеся вершины

    // Подсчитываем входящие рёбра для каждой вершины
    const inDegree = new Map(nodes.map(node => [node, 0]));
    for (const edge of edges) {
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    // Шаг 1: Формирование уровней
    while (notUsedV.size > 0) {
        const currentLevel = [];
        for (const vertex of notUsedV) {
            let k = inDegree.get(vertex);
            for (const edge of edges) {
                if (usedV.has(edge.source) && edge.target === vertex) {
                    k--;
                }
            }
            if (k === 0) currentLevel.push(vertex);
        }

        if (currentLevel.length === 0) break; // Защита от бесконечного цикла (циклы в графе)

        HL.push({ level: currentLevel });
        for (const vertex of currentLevel) {
            usedV.add(vertex);
            notUsedV.delete(vertex);
        }
    }

    return HL;
}

const DFS = (node, endNode, edges, visited) => {
    visited[node] = true;

    if (node === endNode) return true;

    for (const edge of edges) {
        if (edge.source === node && !visited[edge.target]) {
            if (DFS(edge.target, endNode, edges, visited)) return true;
            visited[edge.target] = false;
        }
    }

    return false;
}

export const topologicalDecomposition = ({nodes, edges}) => {
    const notUsedV = new Set(nodes);
    const Sub = [];

    while (notUsedV.size > 0) {
        const R = [];
        const Q = [];
        const visited = [];

        for (const notUsedNode of notUsedV) {
            for (const node of nodes) visited.push(!notUsedV.has(node));
            if (DFS([...notUsedV][0], notUsedNode, edges, visited)) R.push(notUsedNode);
            for (const node of nodes) visited[node] = !notUsedV.has(node);
            if (DFS(notUsedNode, [...notUsedV][0], edges, visited)) Q.push(notUsedNode);
        }

        const intersection = R.filter(node => Q.includes(node));
        Sub.push(intersection);
        intersection.forEach(node => {
            notUsedV.delete(node);
        })
    }

    return Sub;
}
