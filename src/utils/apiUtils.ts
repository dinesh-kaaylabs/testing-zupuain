const isMeaningfulValue = (value: any): boolean => 
  value !== '' && value !== null && value !== undefined && 
  !(Array.isArray(value) && value.length === 0);

export const cleanApiParams = <T extends Record<string, any>>(obj: T): Partial<T> => 
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => isMeaningfulValue(value))
  ) as Partial<T>;

export const stringifyParams = <T extends Record<string, any>>(obj: T): Record<string, string> => 
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, String(value)])
  );

export const buildApiParams = <T extends Record<string, any>>(
  params: T,
  defaults: Partial<T> = {}
): Record<string, string> => 
  stringifyParams(cleanApiParams({ ...defaults, ...params }));
