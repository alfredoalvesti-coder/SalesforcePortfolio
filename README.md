# Portfólio Salesforce

Projeto Salesforce DX para um portfólio profissional em Lightning Web Components
(LWC), preparado para ser adicionado a uma página do Experience Cloud pelo
Experience Builder.

O conteúdo pessoal não é presumido neste projeto. As listas de experiência,
habilidades e projetos começam vazias; preencha-as somente com informações reais
que você queira publicar.

## Arquitetura

- `portfolioHome`: composição da página e único componente exposto ao Experience
  Builder.
- `portfolioHeader`, `portfolioHero` e `portfolioFooter`: estrutura visual
  reutilizável.
- `portfolioExperience`, `portfolioSkills`, `portfolioProjects` e
  `portfolioContact`: seções independentes, compostas pela página principal.
- CSS isolado por componente, tema escuro com detalhes azuis e layout adaptável.
- Sem Apex ou serviço externo: o conteúdo é estático e as formas de contato são
  links configurados no Builder.

Consulte [docs/architecture.md](./docs/architecture.md) para detalhes dos
componentes e dos modelos de conteúdo.

## Requisitos

- Salesforce CLI
- Node.js e npm compatíveis com as dependências do projeto
- Uma org Salesforce com Experience Cloud habilitado para montar e visualizar a
  página no Experience Builder

## Instalação e verificações locais

```bash
npm install
npm run lint
npm run test:unit
```

Os testes Jest dos componentes LWC ficam junto aos respectivos bundles em
`force-app/main/default/lwc/<componente>/__tests__/`.

## Usar no Experience Builder

1. Abra ou crie um site Experience Cloud e abra uma página no Experience Builder.
2. Adicione o componente **Portfolio Home** à página.
3. Configure o título, o resumo e, se desejar, e-mail, LinkedIn e GitHub nas
   propriedades do componente.
4. Para exibir experiência, habilidades e projetos, edite as coleções vazias
   `EXPERIENCE_ITEMS`, `SKILLS` e `PROJECTS` em
   `force-app/main/default/lwc/portfolioHome/portfolioHome.js`.
5. Use somente links HTTPS para LinkedIn, GitHub e links de projetos. O
   componente de contato valida o formato do e-mail e aceita links externos
   apenas com HTTPS.

O metadata do `portfolioHome` declara os targets
`lightningCommunity__Page` e `lightningCommunity__Default`. Os componentes de
seção são internos e são compostos pela página principal.

## Modelo do conteúdo

Cada item em `EXPERIENCE_ITEMS` tem a forma:

```js
{
    id: 'identificador-unico',
    role: 'Cargo real',
    organization: 'Organização real',
    period: 'Período real',
    description: 'Descrição verificável'
}
```

`SKILLS` é uma lista de strings. Cada item em `PROJECTS` tem a forma:

```js
{
    id: 'identificador-unico',
    name: 'Nome do projeto',
    description: 'Descrição que possa ser compartilhada',
    technologies: ['Tecnologia utilizada'],
    repositoryUrl: 'https://example.com/repositorio',
    demoUrl: 'https://example.com/demonstracao'
}
```

Os endereços `example.com` acima são apenas exemplos de formato, não projetos
reais. Remova ou substitua esses valores antes de publicar.

## Deploy

Nenhum deploy é realizado por este README. Execute qualquer operação de deploy
somente após autorização explícita e depois de validar os metadados e o conteúdo
na org de destino.
