import { createElement } from 'lwc';
import PortfolioContact from 'c/portfolioContact';

describe('c-portfolio-contact', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('shows a neutral empty state when contact values are invalid', () => {
        const element = createElement('c-portfolio-contact', {
            is: PortfolioContact
        });
        element.email = 'e-mail inválido';
        element.linkedinUrl = 'ftp://example.com/profile';
        element.githubUrl = 'http://example.com/profile';

        document.body.appendChild(element);

        expect(element.shadowRoot.querySelectorAll('.contact-links a')).toHaveLength(
            0
        );
        expect(element.shadowRoot.querySelector('.empty-state')).not.toBeNull();
    });

    it('renders valid email and HTTPS contact links', () => {
        const element = createElement('c-portfolio-contact', {
            is: PortfolioContact
        });
        element.email = '  portfolio@example.com  ';
        element.linkedinUrl = ' https://linkedin.com/in/example ';
        element.githubUrl = 'https://github.com/example';

        document.body.appendChild(element);

        const emailLink = element.shadowRoot.querySelector(
            'a[href="mailto:portfolio@example.com"]'
        );
        const externalLinks = element.shadowRoot.querySelectorAll(
            'a[target="_blank"]'
        );

        expect(emailLink).not.toBeNull();
        expect(externalLinks).toHaveLength(2);
        externalLinks.forEach((link) => {
            expect(link.getAttribute('rel')).toBe('noopener noreferrer');
            expect(link.getAttribute('href')).toMatch(/^https:\/\//);
        });
        expect(element.shadowRoot.querySelector('.empty-state')).toBeNull();
    });

    it.each([
        ['missing hostname', 'https://'],
        ['inner space', 'https://exa mple.com/perfil'],
        ['missing slashes', 'https:example.com/perfil'],
        ['javascript scheme', ['javascript', 'alert(1)'].join(':')],
        ['hostname without dot', 'https://localhost/perfil'],
        ['credentials before host', 'https://example.com@other.example.org'],
        ['leading hyphen in domain', 'https://-example.com/perfil'],
        ['IPv4 address', 'https://192.168.0.1/perfil']
    ])('does not render malformed HTTPS links (%s)', (_label, url) => {
        const element = createElement('c-portfolio-contact', {
            is: PortfolioContact
        });
        element.linkedinUrl = url;
        element.githubUrl = url;

        document.body.appendChild(element);

        expect(
            element.shadowRoot.querySelectorAll('.contact-links a')
        ).toHaveLength(0);
        expect(element.shadowRoot.querySelector('.empty-state')).not.toBeNull();
    });

    it('ignores non-string contact values', () => {
        const element = createElement('c-portfolio-contact', {
            is: PortfolioContact
        });
        element.email = 42;
        element.linkedinUrl = { href: 'https://example.com' };
        element.githubUrl = null;

        document.body.appendChild(element);

        expect(
            element.shadowRoot.querySelectorAll('.contact-links a')
        ).toHaveLength(0);
    });
});
