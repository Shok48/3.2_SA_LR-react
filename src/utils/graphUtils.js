export const convertLefIncData = (leftIncData) => {
    const nodes = Object.keys(leftIncData).map(Number);
    const edges = Object.entries(leftIncData).flatMap(([node, neighbors]) => 
        neighbors.map(Number).map(neighbor => ({
            source: neighbor,
            target: node,
        }))
    );

    return {
        nodes,
        edges,
    };
};