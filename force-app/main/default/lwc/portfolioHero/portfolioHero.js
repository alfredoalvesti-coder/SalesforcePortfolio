import { LightningElement, api } from 'lwc';

export default class PortfolioHero extends LightningElement {
    @api heading;
    @api summary;
}
