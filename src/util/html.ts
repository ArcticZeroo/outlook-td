export const createElement = <TName extends keyof HTMLElementTagNameMap>(tagName: TName, props?: Partial<HTMLElementTagNameMap[TName]>): HTMLElementTagNameMap[TName] => {
	if (!props) {
		return document.createElement(tagName);
	}
	return Object.assign(document.createElement(tagName), props);
}

export const createChildElement = <TName extends keyof HTMLElementTagNameMap>(parent: Node, tagName: TName, props?: Partial<HTMLElementTagNameMap[TName]>): HTMLElementTagNameMap[TName] => {
	const element = createElement(tagName, props);
	parent.appendChild(element);
	return element;
}

export const createMaterialIcon = (iconName: string) => {
	return createElement('span', {
		innerHTML: iconName,
		className: 'material-symbols-outlined',
	});
};

export const assertElementIsExactHtml = <T extends HTMLElement>(element: unknown, exactType: (new () => T)): T => {
	if (!(element instanceof exactType)) {
		throw new Error(`Element is not an HTML ${exactType.name} element`);
	}

	return element;
}

export const assertElementIsAnyHtml = (element: unknown) => {
	return assertElementIsExactHtml(element, HTMLElement);
}

export const whenDocumentReady = (onReady: () => void) => {
	if (document.readyState === 'loading') {
		const listener = () => {
			// This is different from the load event, but currently the only usage (SAE) doesn't want to wait until load
			// since we want to fully replace the entire DOM tree.
			if (document.readyState === 'interactive') {
				onReady();
			}
			document.removeEventListener('readystatechange', listener);
		};

		document.addEventListener('readystatechange', listener);
	} else {
		onReady();
	}
};

export const isParentInTree = (current: Node | null, ...targetParents: Node[]) => {
	while (current != null) {
		for (const targetParent of targetParents) {
			if (current === targetParent) {
				return true;
			}
		}
		current = current.parentNode;
	}
	return false;
};