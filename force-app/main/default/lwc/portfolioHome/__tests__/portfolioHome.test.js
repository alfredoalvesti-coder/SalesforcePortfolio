import { createElement } from "lwc";
import PortfolioHome from "c/portfolioHome";

describe("c-portfolio-home", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders the shell and only sections with public content", () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });

    document.body.appendChild(element);

    expect(
      element.shadowRoot.querySelector('main[tabindex="-1"]')
    ).not.toBeNull();
    expect(
      element.shadowRoot.querySelector('a.skip-link[href^="#"]')
    ).not.toBeNull();
    expect(
      element.shadowRoot.querySelectorAll("section.portfolio-section")
    ).toHaveLength(2);
    expect(
      element.shadowRoot.querySelector("c-portfolio-header")
    ).not.toBeNull();
    expect(element.shadowRoot.querySelector("c-portfolio-hero")).not.toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-about")
    ).not.toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-skills")
    ).not.toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-experience")
    ).toBeNull();
    expect(element.shadowRoot.querySelector("c-portfolio-projects")).toBeNull();
    expect(element.shadowRoot.querySelector("c-portfolio-contact")).toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-footer")
    ).not.toBeNull();
  });

  it("uses configured title and introduction values", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.pageTitle = "Título configurado";
    element.introduction = "Resumo configurado";

    document.body.appendChild(element);
    await Promise.resolve();

    const hero = element.shadowRoot.querySelector("c-portfolio-hero");
    const header = element.shadowRoot.querySelector("c-portfolio-header");

    expect(hero.heading).toBe("Título configurado");
    expect(hero.summary).toBe("Resumo configurado");
    expect(header.brandLabel).toBe("Título configurado");
  });

  it("falls back to neutral text when configured content is blank", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.pageTitle = "  ";
    element.introduction = "";

    document.body.appendChild(element);
    await Promise.resolve();

    const hero = element.shadowRoot.querySelector("c-portfolio-hero");

    expect(hero.heading).toBe("Desenvolvedor Salesforce Sênior");
    expect(hero.summary).toBe(
      "Salesforce, Java, Spring Boot, integrações e arquitetura de software."
    );
  });

  it("renders configured content sections and matching anchor links", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.experienceItemsJson = JSON.stringify([
      {
        id: "experience-1",
        role: "Função informada",
        organization: "Empresa informada",
        period: "Período informado",
        description: "Descrição informada"
      }
    ]);
    element.skillGroupsJson = JSON.stringify([
      {
        id: "backend",
        category: "Back-end",
        skills: ["Java", "Spring Boot"]
      }
    ]);
    element.projectsJson = JSON.stringify([
      {
        id: "project-1",
        name: "Projeto informado",
        description: "Descrição informada",
        technologies: ["Java"],
        repositoryUrl: "https://example.com/repo"
      }
    ]);
    element.contactEmail = "portfolio@example.com";

    document.body.appendChild(element);
    await Promise.resolve();

    expect(
      element.shadowRoot.querySelector("c-portfolio-experience")
    ).not.toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-projects")
    ).not.toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-contact")
    ).not.toBeNull();
    const navigationLinks = [
      ...element.shadowRoot.querySelectorAll(".section-nav a")
    ];
    const sectionIds = [
      ...element.shadowRoot.querySelectorAll(".portfolio-section")
    ].map((section) => section.id.replace(/-\d+$/, ""));
    const anchorTargets = navigationLinks
      .map((link) => link.getAttribute("href").slice(1))
      .map((id) => id.replace(/-\d+$/, ""));

    expect(navigationLinks.map((link) => link.textContent.trim())).toEqual([
      "Sobre",
      "Experiência",
      "Habilidades",
      "Projetos",
      "Contato"
    ]);
    expect(sectionIds.sort()).toEqual([
      "about",
      "contact",
      "experience",
      "projects",
      "skills"
    ]);
    expect(anchorTargets.sort()).toEqual(sectionIds.sort());
  });

  it("surfaces invalid JSON instead of silently showing an empty section", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.experienceItemsJson = '{"broken":';

    document.body.appendChild(element);
    await Promise.resolve();

    expect(
      element.shadowRoot.querySelector('[role="alert"]').textContent
    ).toContain("Experiências: JSON inválido.");
    expect(
      element.shadowRoot.querySelector("c-portfolio-experience")
    ).toBeNull();
  });
});
