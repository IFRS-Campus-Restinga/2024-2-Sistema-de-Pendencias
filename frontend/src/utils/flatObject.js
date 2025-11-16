export default function flattenAndClean(obj, preserveField) {
  const result = {};

  function recurse(source, prefix = "") {
    for (const key in source) {
      if (!source.hasOwnProperty(key)) continue;

      // Ignorar campo id
      if (key === "id") continue;

      const value = source[key];
      const newKey = prefix ? `${prefix}_${key}` : key;

      // Não alterar o campo preservado
      if (key === preserveField) {
        result[key] = value;
        continue;
      }

      // Se for objeto, recursão
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        recurse(value, newKey);
      } else {
        result[newKey] = value;
      }
    }
  }

  recurse(obj);
  return result;
}