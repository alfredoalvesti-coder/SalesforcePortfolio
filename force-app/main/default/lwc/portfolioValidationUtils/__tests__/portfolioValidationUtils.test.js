import {
  getHttpsUrl,
  isExperienceItem,
  isHttpsUrl,
  isOptionalHttpsUrl,
  isProject,
  isSkillGroup,
  parseArraySetting
} from "c/portfolioValidationUtils";

const VALID_PROJECT = {
  id: "project-1",
  name: "Projeto de teste",
  description: "Descrição de teste",
  technologies: ["Tecnologia de teste"]
};
// Built at runtime so the negative case does not trip the no-script-url rule.
const SCRIPT_URL = ["javascript", "alert(1)"].join(":");
const MAX_LABEL = "a".repeat(63);

describe("c/portfolioValidationUtils", () => {
  describe("isHttpsUrl", () => {
    it.each([
      "https://example.com",
      "https://example.com/",
      "https://sub.example.com/path/to/repo",
      "https://example.com/path?query=1#section",
      "https://example.com:8443/path",
      "HTTPS://EXAMPLE.COM/path",
      "https://www.example.com/in/perfil-teste",
      "https://my-site.example.com",
      "https://a.b.c.example.co.uk/path",
      "https://exemplo.com.br",
      "https://example1.org",
      "https://123.example.com",
      "https://x.io",
      `https://${MAX_LABEL}.com`,
      "https://example.xn--p1ai",
      "https://xn--mnchen-3ya.de",
      "https://m\u00fcnchen.de/pfad",
      "https://example.com/path/user@domain",
      "https://example.com/?redirect=https://other.example.com"
    ])("accepts %s", (value) => {
      expect(isHttpsUrl(value)).toBe(true);
    });

    it.each([
      ["HTTP scheme", "http://example.com"],
      ["FTP scheme", "ftp://example.com/file"],
      ["javascript scheme", SCRIPT_URL],
      ["data scheme", "data:text/html,teste"],
      ["missing hostname", "https://"],
      ["missing hostname with path", "https:///path"],
      ["hostname without dot", "https://localhost"],
      ["empty hostname label", "https://example..com"],
      ["leading dot hostname", "https://.example.com"],
      ["missing slashes", "https:example.com"],
      ["single slash", "https:/example.com"],
      ["inner space", "https://exa mple.com"],
      ["space in path", "https://example.com/a b"],
      ["leading space", " https://example.com"],
      ["trailing space", "https://example.com "],
      ["tab character", "https://example.com/\tpath"],
      ["malformed string", "not a url"],
      ["relative path", "/path/to/page"],
      ["protocol-relative", "//example.com"],
      ["empty string", ""]
    ])("rejects %s", (_label, value) => {
      expect(isHttpsUrl(value)).toBe(false);
    });

    it.each([
      ["leading hyphen in label", "https://-example.com"],
      ["trailing hyphen in label", "https://example-.com"],
      ["leading hyphen in TLD", "https://example.-com"],
      ["trailing hyphen in TLD", "https://example.com-"],
      ["underscore", "https://exa_mple.com"],
      ["exclamation mark", "https://exa!mple.com"],
      ["wildcard label", "https://*.example.com"],
      ["percent sign", "https://exa%mple.com"],
      ["trailing dot", "https://example.com."],
      ["encoded trailing dot", "https://example.com%2e"],
      ["single-character TLD", "https://example.c"],
      ["numeric TLD", "https://example.123"],
      ["alphanumeric TLD", "https://example.c0m"],
      ["label longer than 63 characters", `https://${MAX_LABEL}a.com`],
      [
        "hostname longer than 253 characters",
        `https://${Array(4).fill(MAX_LABEL).join(".")}.com`
      ],
      ["IPv4 address", "https://192.168.0.1"],
      ["hexadecimal IPv4 address", "https://0x7f.0.0.1"],
      ["IPv6 address", "https://[::1]/path"],
      ["invalid port", "https://example.com:99999"],
      ["username before host", "https://example.com@other.example.org"],
      ["username and password", "https://user:secret@example.com"]
    ])("rejects malformed domain: %s", (_label, value) => {
      expect(isHttpsUrl(value)).toBe(false);
    });

    it.each([
      ["undefined", undefined],
      ["null", null],
      ["number", 42],
      ["boolean", true],
      ["object", { href: "https://example.com" }],
      ["array", ["https://example.com"]]
    ])("rejects non-string value: %s", (_label, value) => {
      expect(isHttpsUrl(value)).toBe(false);
    });
  });

  describe("getHttpsUrl", () => {
    it("trims and returns a valid HTTPS URL", () => {
      expect(getHttpsUrl("  https://example.com/perfil  ")).toBe(
        "https://example.com/perfil"
      );
    });

    it.each(["", "   ", "http://example.com", "https://", undefined, null, 42])(
      "returns an empty string for %p",
      (value) => {
        expect(getHttpsUrl(value)).toBe("");
      }
    );
  });

  describe("isOptionalHttpsUrl", () => {
    it("accepts missing or empty optional links", () => {
      expect(isOptionalHttpsUrl(undefined)).toBe(true);
      expect(isOptionalHttpsUrl("")).toBe(true);
    });

    it("rejects null and malformed optional links", () => {
      expect(isOptionalHttpsUrl(null)).toBe(false);
      expect(isOptionalHttpsUrl("http://example.com")).toBe(false);
      expect(isOptionalHttpsUrl(" https://example.com")).toBe(false);
    });
  });

  describe("item validators", () => {
    it("validates experience items", () => {
      const item = {
        id: "experience-1",
        role: "Função de teste",
        organization: "Organização de teste",
        period: "Período de teste",
        description: "Descrição de teste"
      };

      expect(isExperienceItem(item)).toBe(true);
      expect(isExperienceItem({ ...item, role: "  " })).toBe(false);
      expect(isExperienceItem({ ...item, period: 2020 })).toBe(false);
      expect(isExperienceItem([item])).toBe(false);
      expect(isExperienceItem(null)).toBe(false);
    });

    it("validates skill groups", () => {
      const group = { id: "group-1", category: "Categoria", skills: ["A"] };

      expect(isSkillGroup(group)).toBe(true);
      expect(isSkillGroup({ ...group, skills: [] })).toBe(true);
      expect(isSkillGroup({ ...group, skills: ["A", "A"] })).toBe(false);
      expect(isSkillGroup({ ...group, skills: "A" })).toBe(false);
      expect(isSkillGroup({ ...group, skills: ["A", 1] })).toBe(false);
    });

    it("validates projects and their optional links", () => {
      expect(isProject(VALID_PROJECT)).toBe(true);
      expect(
        isProject({
          ...VALID_PROJECT,
          repositoryUrl: "https://example.com/source",
          demoUrl: ""
        })
      ).toBe(true);
      expect(
        isProject({ ...VALID_PROJECT, repositoryUrl: "http://example.com" })
      ).toBe(false);
      expect(isProject({ ...VALID_PROJECT, demoUrl: "https://" })).toBe(false);
      expect(isProject({ ...VALID_PROJECT, demoUrl: SCRIPT_URL })).toBe(false);
      expect(isProject({ ...VALID_PROJECT, technologies: "Java" })).toBe(false);
    });
  });

  describe("parseArraySetting", () => {
    const parseProjects = (value) =>
      parseArraySetting(value, "Projetos", isProject);

    it.each([undefined, null, "", "   ", "[]"])(
      "returns no items and no error for empty value %p",
      (value) => {
        expect(parseProjects(value)).toEqual({ items: [], error: null });
      }
    );

    it("returns parsed items for a valid list", () => {
      const value = JSON.stringify([VALID_PROJECT]);

      expect(parseProjects(value)).toEqual({
        items: [VALID_PROJECT],
        error: null
      });
    });

    it("reports invalid JSON", () => {
      expect(parseProjects('{"broken":')).toEqual({
        items: [],
        error: "Projetos: JSON inválido."
      });
    });

    it.each([
      ["non-string setting", 42],
      ["array setting", [VALID_PROJECT]],
      ["object setting", { id: "x" }]
    ])("reports a %s", (_label, value) => {
      expect(parseProjects(value)).toEqual({
        items: [],
        error: "Projetos: informe uma lista JSON."
      });
    });

    it.each([
      ["object instead of list", JSON.stringify(VALID_PROJECT)],
      ["string JSON", JSON.stringify("texto")],
      ["number JSON", "1"],
      ["null JSON", "null"],
      ["list with invalid item", JSON.stringify([{ id: "x" }])],
      ["list with non-object item", JSON.stringify(["texto"])],
      [
        "duplicate ids",
        JSON.stringify([VALID_PROJECT, { ...VALID_PROJECT, name: "Outro" }])
      ]
    ])("reports structure errors for %s", (_label, value) => {
      expect(parseProjects(value)).toEqual({
        items: [],
        error: "Projetos: revise a estrutura e os identificadores dos itens."
      });
    });
  });
});
