export const epsilonRound = (value: number, epsilon: number = Number.EPSILON): number => {
    const rounded = Math.round(value);
    return Math.abs(value - rounded) < epsilon
           ? rounded
           : value;
}

export const timedSin = (currentMs: number, msPerCycle: number) => {
    return Math.sin((currentMs / msPerCycle) * 2 * Math.PI);
}