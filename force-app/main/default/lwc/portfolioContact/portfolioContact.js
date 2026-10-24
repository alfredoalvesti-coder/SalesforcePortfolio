import { LightningElement, api } from 'lwc';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTPS_URL_PATTERN = /^https:\/\/[^\s]+$/i;

export default class PortfolioContact extends LightningElement {
    @api email = '';
    @api linkedinUrl = '';
    @api githubUrl = '';

    get emailHref() {
        const email = this.normalize(this.email);
        return EMAIL_PATTERN.test(email) ? `mailto:${email}` : '';
    }

    get linkedinHref() {
        return this.getHttpsUrl(this.linkedinUrl);
    }

    get githubHref() {
        return this.getHttpsUrl(this.githubUrl);
    }

    get hasContactLink() {
        return Boolean(this.emailHref || this.linkedinHref || this.githubHref);
    }

    getHttpsUrl(value) {
        const url = this.normalize(value);
        return HTTPS_URL_PATTERN.test(url) ? url : '';
    }

    normalize(value) {
        return typeof value === 'string' ? value.trim() : '';
    }
}
