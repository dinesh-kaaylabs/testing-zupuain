// String case transformations with minimal overhead
export const lowerCaseFirstLetter = (str: string): string => 
    str ? str[0].toLowerCase() + str.slice(1) : str;
  
export const upperCaseFirstLetter = (str: string): string => 
    str ? str[0].toUpperCase() + str.slice(1) : str;
  
  export const toTitleCase = (str: string): string => 
    str ? str.toLowerCase().split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : str;
  
  export const truncate = (str: string, max: number): string => 
    str?.length > max ? str.slice(0, max) + '...' : str;
  
  export const isEmptyOrWhitespace = (str: string | null | undefined): boolean => 
    !str?.trim();
  
  export const removeWhitespace = (str: string): string => str.replace(/\s+/g, '');
  
  export const toKebabCase = (str: string): string => 
    str ? str.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : str;
  
export const toCamelCase = (str: string): string => 
  str ? str.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) : str;

export const lowerCaseAllLetters = (str: string): string => 
  str ? str.toLowerCase() : str;

// Base64 decode and JSON parse utility
export const decodeBase64Json = <T = any>(encodedString: string): T | null => {
  try {
    const decodedString = atob(encodedString);
    const parsedData: T = JSON.parse(decodedString);
    return parsedData;
  } catch (error) {
    console.error('❌ Failed to decode base64 JSON:', error);
    return null;
  }
};
