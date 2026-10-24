import { createElement } from 'lwc';
import PortfolioProjects from 'c/portfolioProjects';

describe('c-portfolio-projects', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders an empty state when no projects are provided', () => {
        const element = createElement('c-portfolio-projects', {
            is: PortfolioProjects
        });

        document.body.appendChild(element);

        expect(element.shadowRoot.querySelector('.empty-state')).not.toBeNull();
        expect(element.shadowRoot.querySelector('.project-card')).toBeNull();
    });

    it('renders project details and safe external link attributes', () => {
        const element = createElement('c-portfolio-projects', {
            is: PortfolioProjects
        });
        element.projects = [
            {
                id: 'project-test-1',
                name: 'Projeto de teste',
                description: 'Descrição de teste',
                technologies: ['Tecnologia de teste'],
                repositoryUrl: 'https://example.com/source',
                demoUrl: 'https://example.com/demo'
            }
        ];

        document.body.appendChild(element);

        const links = element.shadowRoot.querySelectorAll(
            '.project-links a[target="_blank"]'
        );

        expect(element.shadowRoot.querySelector('h3').textContent).toBe(
            'Projeto de teste'
        );
        expect(links).toHaveLength(2);
        links.forEach((link) => {
            expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        });
    });
});
