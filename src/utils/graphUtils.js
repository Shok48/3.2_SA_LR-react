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
