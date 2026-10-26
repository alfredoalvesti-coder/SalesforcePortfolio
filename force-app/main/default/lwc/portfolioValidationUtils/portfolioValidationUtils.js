const HTTPS_PREFIX_PATTERN = /^https:\/\//i;
const WHITESPACE_PATTERN = /\s/;

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValidHostname(hostname) {
  const labels = hostname.split(".");
  return labels.length > 1 && labels.every((label) => label.length > 0);
}

// The URL parser accepts shorthand such as "https:example.com", so the literal
// prefix and whitespace are checked before parsing.
export function isHttpsUrl(value) {
  if (
    typeof value !== "string" ||
    !HTTPS_PREFIX_PATTERN.test(value) ||
    WHITESPACE_PATTERN.test(value)
  ) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && hasValidHostname(url.hostname);
  } catch {
    return false;
  }
}

export function getHttpsUrl(value) {
  const url = typeof value === "string" ? value.trim() : "";
  return isHttpsUrl(url) ? url : "";
}

export function isOptionalHttpsUrl(value) {
  return value === undefined || value === "" || isHttpsUrl(value);
}

function hasUniqueIds(items) {
  const ids = items.map((item) => item.id);
  return new Set(ids).size === ids.length;
}

function isStringList(value) {
  return (
    Array.isArray(value) &&
    value.every((item) => isNonEmptyString(item)) &&
    new Set(value).size === value.length
  );
}

export function isExperienceItem(item) {
  return (
    isObject(item) &&
    isNonEmptyString(item.id) &&
    isNonEmptyString(item.role) &&
    isNonEmptyString(item.organization) &&
    isNonEmptyString(item.period) &&
    isNonEmptyString(item.description)
  );
}

export function isSkillGroup(group) {
  return (
    isObject(group) &&
    isNonEmptyString(group.id) &&
    isNonEmptyString(group.category) &&
    isStringList(group.skills)
  );
}

export function isProject(project) {
  return (
    isObject(project) &&
    isNonEmptyString(project.id) &&
    isNonEmptyString(project.name) &&
    isNonEmptyString(project.description) &&
    isStringList(project.technologies) &&
    isOptionalHttpsUrl(project.repositoryUrl) &&
    isOptionalHttpsUrl(project.demoUrl)
  );
}

export function parseArraySetting(value, label, isValidItem) {
  if (value === undefined || value === null || value === "") {
    return { items: [], error: null };
  }
  if (typeof value !== "string") {
    return { items: [], error: `${label}: informe uma lista JSON.` };
  }
  if (!value.trim()) {
    return { items: [], error: null };
  }

  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { items: [], error: `${label}: JSON inválido.` };
    }
    throw error;
  }

  if (
    !Array.isArray(parsed) ||
    !parsed.every(isValidItem) ||
    !hasUniqueIds(parsed)
  ) {
    return {
      items: [],
      error: `${label}: revise a estrutura e os identificadores dos itens.`
    };
  }

  return { items: parsed, error: null };
}
