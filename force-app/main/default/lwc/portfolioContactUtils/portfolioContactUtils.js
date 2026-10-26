import { getHttpsUrl } from "c/portfolioValidationUtils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function getContactLinks(email, linkedinUrl, githubUrl) {
  const normalizedEmail = normalize(email);
  const emailHref = EMAIL_PATTERN.test(normalizedEmail)
    ? `mailto:${normalizedEmail}`
    : "";
  const linkedinHref = getHttpsUrl(linkedinUrl);
  const githubHref = getHttpsUrl(githubUrl);

  return {
    emailHref,
    linkedinHref,
    githubHref,
    hasContactLink: Boolean(emailHref || linkedinHref || githubHref),
    hasInvalidValue: Boolean(
      (normalizedEmail && !emailHref) ||
      (normalize(linkedinUrl) && !linkedinHref) ||
      (normalize(githubUrl) && !githubHref)
    )
  };
}
