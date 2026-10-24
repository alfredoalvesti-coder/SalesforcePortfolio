import { createElement } from 'lwc';
import PortfolioSkills from 'c/portfolioSkills';

describe('c-portfolio-skills', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders an empty state when no skills are provided', () => {
        const element = createElement('c-portfolio-skills', {
            is: PortfolioSkills
        });

        document.body.appendChild(element);

        expect(element.shadowRoot.querySelector('.empty-state')).not.toBeNull();
        expect(element.shadowRoot.querySelector('.skill-item')).toBeNull();
    });

    it('renders the provided skills', () => {
        const element = createElement('c-portfolio-skills', {
            is: PortfolioSkills
        });
        element.skills = ['Habilidade de teste A', 'Habilidade de teste B'];

        document.body.appendChild(element);

        const skills = element.shadowRoot.querySelectorAll('.skill-item');

        expect(skills).toHaveLength(2);
        expect(skills[0].textContent).toBe('Habilidade de teste A');
        expect(skills[1].textContent).toBe('Habilidade de teste B');
    });
});
