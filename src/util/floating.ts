export const getHeightOffset = (cycleTimeMs: number, amplitude: number, secondsPerRevolution: number = 1) => {
    const cycleTimeSeconds = cycleTimeMs / 1000;
    const period = (2 * Math.PI) / secondsPerRevolution;
    return Math.sin(cycleTimeSeconds * period) * amplitude;
}