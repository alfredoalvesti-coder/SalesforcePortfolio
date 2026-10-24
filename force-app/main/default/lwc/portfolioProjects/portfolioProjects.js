import { LightningElement, api } from 'lwc';

export default class PortfolioProjects extends LightningElement {
    @api projects = [];

    get hasProjects() {
        return Array.isArray(this.projects) && this.projects.length > 0;
    }
}
