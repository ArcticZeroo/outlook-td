export const getTierCost = (tierIndex: number, originalCost: number) => {
	if (tierIndex === 0) {
		return 0;
	}

	return Math.round(Math.max(50, originalCost * (Math.pow(1.85, tierIndex - 1) - 0.25)));
}