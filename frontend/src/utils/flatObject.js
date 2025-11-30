export default function flattenAndClean(obj, preserveField) {
  const result = {};

  function recurse(source, prefix = "") {
    for (const key in source) {
      if (!source.hasOwnProperty(key)) continue;

      const value = source[key];

      // Se o campo é o que deve ser preservado, NÃO planifica
      if (key === preserveField) {
        result[key] = value;   // mantém como veio
        continue;
      }

      const newKey = prefix ? `${prefix}` : key;

      // Se for objeto, planificar normalmente
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        recurse(value, newKey);
      } else {
        result[newKey] = value;
      }
    }
  }

  recurse(obj);
  return result;
}
