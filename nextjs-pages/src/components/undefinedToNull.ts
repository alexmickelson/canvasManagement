export function undefinedWithNull<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(undefinedWithNull) as unknown as T;
  } else if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const value = (obj as Record<string, unknown>)[key];
      acc[key] = value === undefined ? null : undefinedWithNull(value);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  return obj;
}
