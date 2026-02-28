export const calculateNewElo = (currentElo, isHot) => {
    const K_FACTOR = 32;
    const scoreChange = isHot ? K_FACTOR : -K_FACTOR;
    const newElo = currentElo + scoreChange;
    
    return Math.max(0, newElo);
};