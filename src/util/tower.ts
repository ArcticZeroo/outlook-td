export const getTierCost = (tierIndex: number) => {
	if (tierIndex === 0) {
		return 0;
	}

	return Math.pow(2, tierIndex - 1) * 50;
}