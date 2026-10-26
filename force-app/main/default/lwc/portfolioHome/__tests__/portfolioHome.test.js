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

    const content = element.shadowRoot.querySelector(".main-content");
    expect(element.shadowRoot.querySelector("main")).toBeNull();
    expect(content.tagName).toBe("DIV");
    expect(element.shadowRoot.querySelector("a.skip-link")).toBeNull();
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
    navigationLinks.forEach((link) => {
      const target = element.shadowRoot.querySelector(
        `[id="${link.getAttribute("href").slice(1)}"]`
      );
      expect(target).not.toBeNull();
      expect(target.classList.contains("portfolio-section")).toBe(true);
    });
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

  function getNavigationTargets(element) {
    return [...element.shadowRoot.querySelectorAll(".section-nav a")].map(
      (link) => link.getAttribute("href").slice(1).replace(/-\d+$/, "")
    );
  }

  it("hides sections and anchors for empty lists without warnings", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.experienceItemsJson = "[]";
    element.projectsJson = "  ";
    element.skillGroupsJson = JSON.stringify([
      { id: "empty", category: "Categoria vazia", skills: [] }
    ]);

    document.body.appendChild(element);
    await Promise.resolve();

    expect(element.shadowRoot.querySelector('[role="alert"]')).toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-experience")
    ).toBeNull();
    expect(element.shadowRoot.querySelector("c-portfolio-skills")).toBeNull();
    expect(element.shadowRoot.querySelector("c-portfolio-projects")).toBeNull();
    expect(getNavigationTargets(element)).toEqual(["about"]);
  });

  it("rejects duplicate identifiers and keeps the section hidden", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    const item = {
      id: "duplicated",
      role: "Função de teste",
      organization: "Organização de teste",
      period: "Período de teste",
      description: "Descrição de teste"
    };
    element.experienceItemsJson = JSON.stringify([item, { ...item }]);

    document.body.appendChild(element);
    await Promise.resolve();

    expect(
      element.shadowRoot.querySelector('[role="alert"]').textContent
    ).toContain("Experiências: revise a estrutura e os identificadores");
    expect(
      element.shadowRoot.querySelector("c-portfolio-experience")
    ).toBeNull();
    expect(getNavigationTargets(element)).not.toContain("experience");
  });

  it("reports unexpected setting types", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.skillGroupsJson = 42;

    document.body.appendChild(element);
    await Promise.resolve();

    expect(
      element.shadowRoot.querySelector('[role="alert"]').textContent
    ).toContain("Habilidades: informe uma lista JSON.");
    expect(element.shadowRoot.querySelector("c-portfolio-skills")).toBeNull();
  });

  it.each([
    ["HTTP", "http://example.com/source"],
    ["missing hostname", "https://"],
    ["inner space", "https://exa mple.com"],
    ["missing slashes", "https:example.com"],
    ["underscore in domain", "https://exa_mple.com/source"],
    ["credentials before host", "https://example.com@other.example.org"]
  ])(
    "rejects projects with a malformed link (%s)",
    async (_label, repositoryUrl) => {
      const element = createElement("c-portfolio-home", {
        is: PortfolioHome
      });
      element.projectsJson = JSON.stringify([
        {
          id: "project-1",
          name: "Projeto de teste",
          description: "Descrição de teste",
          technologies: ["Tecnologia de teste"],
          repositoryUrl
        }
      ]);

      document.body.appendChild(element);
      await Promise.resolve();

      expect(
        element.shadowRoot.querySelector('[role="alert"]').textContent
      ).toContain("Projetos: revise a estrutura e os identificadores");
      expect(
        element.shadowRoot.querySelector("c-portfolio-projects")
      ).toBeNull();
      expect(getNavigationTargets(element)).not.toContain("projects");
    }
  );

  it("renders projects with optional links omitted or empty", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.projectsJson = JSON.stringify([
      {
        id: "project-1",
        name: "Projeto de teste",
        description: "Descrição de teste",
        technologies: ["Tecnologia de teste"],
        demoUrl: ""
      }
    ]);

    document.body.appendChild(element);
    await Promise.resolve();

    expect(element.shadowRoot.querySelector('[role="alert"]')).toBeNull();
    expect(
      element.shadowRoot.querySelector("c-portfolio-projects")
    ).not.toBeNull();
    expect(getNavigationTargets(element)).toContain("projects");
  });

  it("warns about malformed contact links and hides the contact section", async () => {
    const element = createElement("c-portfolio-home", {
      is: PortfolioHome
    });
    element.linkedinUrl = "https:/example.com/perfil";

    document.body.appendChild(element);
    await Promise.resolve();

    expect(
      element.shadowRoot.querySelector('[role="alert"]').textContent
    ).toContain("canais de contato");
    expect(element.shadowRoot.querySelector("c-portfolio-contact")).toBeNull();
    expect(getNavigationTargets(element)).not.toContain("contact");
  });
});
