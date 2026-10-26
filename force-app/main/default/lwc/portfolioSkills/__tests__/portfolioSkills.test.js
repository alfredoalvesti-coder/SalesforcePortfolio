import { createElement } from "lwc";
import PortfolioSkills from "c/portfolioSkills";

describe("c-portfolio-skills", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders an empty state when no skill groups are provided", () => {
    const element = createElement("c-portfolio-skills", {
      is: PortfolioSkills
    });

    document.body.appendChild(element);

    expect(element.shadowRoot.querySelector(".empty-state")).not.toBeNull();
    expect(element.shadowRoot.querySelector(".skill-item")).toBeNull();
  });

  it("renders skills grouped by category", () => {
    const element = createElement("c-portfolio-skills", {
      is: PortfolioSkills
    });
    element.groups = [
      {
        id: "backend",
        category: "Back-end",
        skills: ["Java", "Spring Boot"]
      },
      {
        id: "salesforce",
        category: "Salesforce",
        skills: ["LWC"]
      }
    ];

    document.body.appendChild(element);

    const groups = element.shadowRoot.querySelectorAll(".skill-group");

    expect(groups).toHaveLength(2);
    expect(groups[0].querySelector("h3").textContent).toBe("Back-end");
    expect(groups[0].querySelectorAll(".skill-item")).toHaveLength(2);
    expect(groups[1].querySelector("h3").textContent).toBe("Salesforce");
  });

  it("does not render categories without skills", () => {
    const element = createElement("c-portfolio-skills", {
      is: PortfolioSkills
    });
    element.groups = [
      {
        id: "empty-category",
        category: "Categoria sem conteúdo",
        skills: []
      }
    ];

    document.body.appendChild(element);

    expect(element.shadowRoot.querySelector(".empty-state")).not.toBeNull();
    expect(element.shadowRoot.querySelector(".skill-group")).toBeNull();
  });
});
