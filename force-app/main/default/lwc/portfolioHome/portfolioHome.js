import { LightningElement, api } from "lwc";
import { getContactLinks } from "c/portfolioContactUtils";
import {
  isExperienceItem,
  isProject,
  isSkillGroup,
  parseArraySetting
} from "c/portfolioValidationUtils";

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
