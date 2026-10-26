const HTTPS_PREFIX_PATTERN = /^https:\/\//i;
const WHITESPACE_PATTERN = /\s/;
const MAX_HOSTNAME_LENGTH = 253;
const HOSTNAME_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
// Alphabetic or punycode TLD; this also rules out IPv4 hosts.
const TOP_LEVEL_DOMAIN_PATTERN = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Expects the hostname already normalized by the URL parser (lowercase,
// punycode for internationalized domains).
function isValidDomainName(hostname) {
  if (hostname.length > MAX_HOSTNAME_LENGTH) {
    return false;
  }

  const labels = hostname.split(".");
  return (
    labels.length > 1 &&
    labels.every((label) => HOSTNAME_LABEL_PATTERN.test(label)) &&
    TOP_LEVEL_DOMAIN_PATTERN.test(labels[labels.length - 1])
  );
}

// The URL parser accepts shorthand such as "https:example.com", so the literal
// prefix and whitespace are checked before parsing. Credentials are rejected
// because "https://trusted.com@other.com" points to other.com.
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
    return (
      url.protocol === "https:" &&
      url.username === "" &&
      url.password === "" &&
      isValidDomainName(url.hostname)
    );
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
