import { LightningElement, api } from 'lwc';

export default class PortfolioExperience extends LightningElement {
    @api items = [];

    get hasItems() {
        return Array.isArray(this.items) && this.items.length > 0;
    }
}
