import { createElement } from "lwc";
import PortfolioAbout from "c/portfolioAbout";

describe("c-portfolio-about", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders the configured profile description accessibly", () => {
    const element = createElement("c-portfolio-about", {
      is: PortfolioAbout
    });
    element.description =
      "Desenvolvedor Salesforce Sênior com conhecimentos em Java.";

    document.body.appendChild(element);

    const section = element.shadowRoot.querySelector("section");
    const heading = element.shadowRoot.querySelector("h2");

    expect(section).not.toBeNull();
    expect(section.getAttribute("aria-labelledby")).toBe(heading.id);
    expect(heading.textContent).toBe("Perfil profissional");
    expect(
      element.shadowRoot.querySelector(".description").textContent
    ).toContain("conhecimentos em Java");
  });
});
