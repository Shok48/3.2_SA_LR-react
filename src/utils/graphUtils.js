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
