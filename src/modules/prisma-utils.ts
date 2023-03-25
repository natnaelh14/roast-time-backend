export function excludeFromSingleObject<Obj, Key extends keyof Obj>(obj: Obj, keys: Key[]): Omit<Obj, Key> {
	// eslint-disable-next-line no-restricted-syntax
	for (const key of keys) {
		// eslint-disable-next-line no-param-reassign
		delete obj[key];
	}
	return obj;
}

export function excludeFromArrayOfObjects(arr: Record<string, unknown>[], keys: string[]): Record<string, unknown>[] {
	const newArr = [];
	for (const val of arr) {
		newArr.push(excludeFromSingleObject(val, keys));
	}
	return newArr;
}
