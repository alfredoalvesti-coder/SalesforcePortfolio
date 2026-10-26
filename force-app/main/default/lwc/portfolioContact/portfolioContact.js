import { LightningElement, api } from "lwc";
import { getContactLinks } from "c/portfolioContactUtils";

export default class PortfolioContact extends LightningElement {
  @api email = "";
  @api linkedinUrl = "";
  @api githubUrl = "";

  get contactLinks() {
    return getContactLinks(this.email, this.linkedinUrl, this.githubUrl);
  }

  get emailHref() {
    return this.contactLinks.emailHref;
  }

  get linkedinHref() {
    return this.contactLinks.linkedinHref;
  }

  get githubHref() {
    return this.contactLinks.githubHref;
  }

  get hasContactLink() {
    return this.contactLinks.hasContactLink;
  }
}
