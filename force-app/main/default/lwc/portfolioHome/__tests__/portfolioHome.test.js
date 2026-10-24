import { createElement } from 'lwc';
import PortfolioHome from 'c/portfolioHome';

describe('c-portfolio-home', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the page shell and all portfolio sections', () => {
        const element = createElement('c-portfolio-home', {
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
            element.shadowRoot.querySelectorAll('section.portfolio-section')
        ).toHaveLength(4);
        expect(element.shadowRoot.querySelector('c-portfolio-header')).not.toBeNull();
        expect(element.shadowRoot.querySelector('c-portfolio-hero')).not.toBeNull();
        expect(element.shadowRoot.querySelector('c-portfolio-footer')).not.toBeNull();
    });

    it('uses configured title and introduction values', async () => {
        const element = createElement('c-portfolio-home', {
            is: PortfolioHome
        });
        element.pageTitle = 'Título configurado';
        element.introduction = 'Resumo configurado';

        document.body.appendChild(element);
        await Promise.resolve();

        const hero = element.shadowRoot.querySelector('c-portfolio-hero');
        const header = element.shadowRoot.querySelector('c-portfolio-header');

        expect(hero.heading).toBe('Título configurado');
        expect(hero.summary).toBe('Resumo configurado');
        expect(header.brandLabel).toBe('Título configurado');
    });

    it('falls back to neutral text when configured content is blank', async () => {
        const element = createElement('c-portfolio-home', {
            is: PortfolioHome
        });
        element.pageTitle = '  ';
        element.introduction = '';

        document.body.appendChild(element);
        await Promise.resolve();

        const hero = element.shadowRoot.querySelector('c-portfolio-hero');

        expect(hero.heading).toBe('Portfólio Salesforce');
        expect(hero.summary).toBe(
            'Experiência, habilidades e projetos em Salesforce.'
        );
    });
});
