import { LightningElement, api } from "lwc";

export default class PortfolioSkills extends LightningElement {
  @api groups = [];

  get visibleGroups() {
    if (!Array.isArray(this.groups)) {
      return [];
    }

    return this.groups.filter(
      (group) => Array.isArray(group.skills) && group.skills.length > 0
    );
  }

  get hasGroups() {
    return this.visibleGroups.length > 0;
  }
}
