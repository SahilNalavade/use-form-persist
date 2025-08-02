export function shouldExcludeField<T>(
  fieldPath: string,
  excludeList: Array<keyof T | string>
): boolean {
  return excludeList.some(excludePattern => {
    if (typeof excludePattern === 'string') {
      return (
        fieldPath === excludePattern ||
        fieldPath.startsWith(`${excludePattern}.`)
      );
    }
    return fieldPath === String(excludePattern);
  });
}

export function filterExcludedFields<T extends Record<string, any>>(
  obj: T,
  excludeList: Array<keyof T | string>,
  parentPath = ''
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;

      if (!shouldExcludeField(currentPath, excludeList)) {
        const value = obj[key];

        if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          !((value as any) instanceof Date)
        ) {
          const filtered = filterExcludedFields(
            value,
            excludeList,
            currentPath
          );
          if (Object.keys(filtered).length > 0) {
            result[key] = filtered as T[Extract<keyof T, string>];
          }
        } else {
          result[key] = value;
        }
      }
    }
  }

  return result;
}
