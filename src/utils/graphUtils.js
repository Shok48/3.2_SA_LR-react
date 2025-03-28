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
