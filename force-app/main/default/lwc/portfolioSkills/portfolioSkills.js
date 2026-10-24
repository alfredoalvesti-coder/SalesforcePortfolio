import { LightningElement, api } from 'lwc';

export default class PortfolioSkills extends LightningElement {
    @api skills = [];

    get hasSkills() {
        return Array.isArray(this.skills) && this.skills.length > 0;
    }
}
