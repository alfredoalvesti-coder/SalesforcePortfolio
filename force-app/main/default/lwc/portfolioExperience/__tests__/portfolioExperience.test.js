import { createElement } from 'lwc';
import PortfolioExperience from 'c/portfolioExperience';

describe('c-portfolio-experience', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders an empty state when no experiences are provided', () => {
        const element = createElement('c-portfolio-experience', {
            is: PortfolioExperience
        });

        document.body.appendChild(element);

        expect(element.shadowRoot.querySelector('.empty-state')).not.toBeNull();
        expect(element.shadowRoot.querySelector('.experience-card')).toBeNull();
    });

    it('renders each experience entry', () => {
        const element = createElement('c-portfolio-experience', {
            is: PortfolioExperience
        });
        element.items = [
            {
                id: 'experience-test-1',
                role: 'Função de teste',
                organization: 'Organização de teste',
                period: 'Período de teste',
                description: 'Descrição de teste'
            }
        ];

        document.body.appendChild(element);

        expect(
            element.shadowRoot.querySelector('.experience-card').textContent
        ).toContain('Função de teste');
        expect(element.shadowRoot.querySelector('.organization').textContent).toBe(
            'Organização de teste'
        );
    });
});
