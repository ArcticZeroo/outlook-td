export const choice = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const between = (min: number, max: number): number => Math.random() * (max - min) + min;