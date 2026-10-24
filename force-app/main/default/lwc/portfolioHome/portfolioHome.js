import { LightningElement, api } from 'lwc';

const DEFAULT_PAGE_TITLE = 'Portfólio Salesforce';
const DEFAULT_INTRODUCTION =
    'Experiência, habilidades e projetos em Salesforce.';
const EXPERIENCE_ITEMS = [];
const SKILLS = [];
const PROJECTS = [];

export default class PortfolioHome extends LightningElement {
    @api pageTitle = DEFAULT_PAGE_TITLE;
    @api introduction = DEFAULT_INTRODUCTION;
    @api contactEmail = '';
    @api linkedinUrl = '';
    @api githubUrl = '';

    get displayPageTitle() {
        return this.getConfiguredText(this.pageTitle, DEFAULT_PAGE_TITLE);
    }

    get displayIntroduction() {
        return this.getConfiguredText(this.introduction, DEFAULT_INTRODUCTION);
    }

    get experienceItems() {
        return EXPERIENCE_ITEMS;
    }

    get skills() {
        return SKILLS;
    }

    get projects() {
        return PROJECTS;
    }

    getConfiguredText(value, fallback) {
        return typeof value === 'string' && value.trim() ? value.trim() : fallback;
    }
}
