import { LightningElement, api } from "lwc";
import { getContactLinks } from "c/portfolioContactUtils";

const DEFAULT_PAGE_TITLE = "Desenvolvedor Salesforce Sênior";
const DEFAULT_INTRODUCTION =
  "Salesforce, Java, Spring Boot, integrações e arquitetura de software.";
const DEFAULT_ABOUT =
  "Desenvolvedor Salesforce Sênior com conhecimentos em Java, Spring Boot, integrações e arquitetura de software.";
const DEFAULT_SKILL_GROUPS = [
  {
    id: "salesforce",
    category: "Salesforce",
    skills: [
      "Salesforce DX",
      "Lightning Web Components (LWC)",
      "Experience Cloud"
    ]
  },
  {
    id: "backend",
    category: "Desenvolvimento back-end",
    skills: ["Java", "Spring Boot"]
  },
  {
    id: "integration-architecture",
    category: "Integrações e arquitetura",
    skills: ["Integrações", "Arquitetura de software"]
  }
];

const DEFAULT_SKILL_GROUPS_JSON = JSON.stringify(DEFAULT_SKILL_GROUPS);
const HTTPS_URL_PATTERN = /^https:\/\/[^\s]+$/i;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasUniqueIds(items) {
  const ids = items.map((item) => item.id);
  return new Set(ids).size === ids.length;
}

function isExperienceItem(item) {
  return (
    isObject(item) &&
    isNonEmptyString(item.id) &&
    isNonEmptyString(item.role) &&
    isNonEmptyString(item.organization) &&
    isNonEmptyString(item.period) &&
    isNonEmptyString(item.description)
  );
}

function isStringList(value) {
  return (
    Array.isArray(value) &&
    value.every((item) => isNonEmptyString(item)) &&
    new Set(value).size === value.length
  );
}

function isSkillGroup(group) {
  return (
    isObject(group) &&
    isNonEmptyString(group.id) &&
    isNonEmptyString(group.category) &&
    isStringList(group.skills)
  );
}

function isOptionalHttpsUrl(value) {
  return (
    value === undefined ||
    value === "" ||
    (typeof value === "string" && HTTPS_URL_PATTERN.test(value))
  );
}

function isProject(project) {
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

function parseArraySetting(value, label, isValidItem) {
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

export default class PortfolioHome extends LightningElement {
  @api pageTitle = DEFAULT_PAGE_TITLE;
  @api introduction = DEFAULT_INTRODUCTION;
  @api aboutText = DEFAULT_ABOUT;
  @api experienceItemsJson = "[]";
  @api skillGroupsJson = DEFAULT_SKILL_GROUPS_JSON;
  @api projectsJson = "[]";
  @api contactEmail = "";
  @api linkedinUrl = "";
  @api githubUrl = "";

  get displayPageTitle() {
    return this.getConfiguredText(this.pageTitle, DEFAULT_PAGE_TITLE);
  }

  get displayIntroduction() {
    return this.getConfiguredText(this.introduction, DEFAULT_INTRODUCTION);
  }

  get displayAbout() {
    return typeof this.aboutText === "string" ? this.aboutText.trim() : "";
  }

  get hasAbout() {
    return Boolean(this.displayAbout);
  }

  get experienceConfiguration() {
    return parseArraySetting(
      this.experienceItemsJson,
      "Experiências",
      isExperienceItem
    );
  }

  get experienceItems() {
    return this.experienceConfiguration.items;
  }

  get hasExperience() {
    return this.experienceItems.length > 0;
  }

  get skillGroupsConfiguration() {
    return parseArraySetting(this.skillGroupsJson, "Habilidades", isSkillGroup);
  }

  get skillGroups() {
    return this.skillGroupsConfiguration.items;
  }

  get hasSkills() {
    return this.skillGroups.some((group) => group.skills.length > 0);
  }

  get projectsConfiguration() {
    return parseArraySetting(this.projectsJson, "Projetos", isProject);
  }

  get projects() {
    return this.projectsConfiguration.items;
  }

  get hasProjects() {
    return this.projects.length > 0;
  }

  get contactLinks() {
    return getContactLinks(this.contactEmail, this.linkedinUrl, this.githubUrl);
  }

  get hasContact() {
    return this.contactLinks.hasContactLink;
  }

  get hasConfigurationError() {
    return this.configurationErrors.length > 0;
  }

  get configurationErrorMessage() {
    return `Não foi possível exibir: ${this.configurationErrors.join(", ")}. Revise os dados no Experience Builder.`;
  }

  get configurationErrors() {
    const errors = [
      this.experienceConfiguration.error,
      this.skillGroupsConfiguration.error,
      this.projectsConfiguration.error
    ].filter(Boolean);

    if (this.contactLinks.hasInvalidValue) {
      errors.push("canais de contato");
    }

    return errors;
  }

  getConfiguredText(value, fallback) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }
}
