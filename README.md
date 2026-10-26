# Portfólio Salesforce

Projeto Salesforce DX para um portfólio profissional em Lightning Web Components
(LWC), preparado para ser adicionado a uma página do Experience Cloud pelo
Experience Builder.

O conteúdo profissional não é inventado neste projeto. Experiências e projetos
começam vazios; as habilidades padrão refletem apenas os domínios informados pelo
usuário e podem ser configuradas no Experience Builder.

## Arquitetura

- `portfolioHome`: composição da página e único componente exposto ao Experience
  Builder.
- `portfolioHeader`, `portfolioHero`, `portfolioAbout` e `portfolioFooter`:
  estrutura visual reutilizável.
- `portfolioExperience`, `portfolioSkills`, `portfolioProjects` e
  `portfolioContact`: seções independentes, compostas pela página principal.
- `portfolioValidationUtils` e `portfolioContactUtils`: módulos internos de
  validação (URLs HTTPS, configurações JSON e contatos).
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
4. Configure `Experiências (JSON)`, `Habilidades por categoria (JSON)` e
   `Projetos (JSON)` nas propriedades do `Portfolio Home`. Experiências e
   projetos vazios não aparecem no site público; preencha-os somente com dados
   reais autorizados para publicação.
5. Use somente links HTTPS para LinkedIn, GitHub e links de projetos. O
   componente de contato valida o formato do e-mail e aceita links externos
   apenas com HTTPS. URLs precisam começar com `https://`, ter um hostname
   válido (por exemplo, com domínio) e não conter espaços. Contatos vazios ou
   inválidos não são exibidos; projetos com links inválidos geram aviso de
   configuração.

O metadata do `portfolioHome` declara os targets
`lightningCommunity__Page` e `lightningCommunity__Default`. Os componentes de
seção são internos e são compostos pela página principal.

## Site público

O site público do portfólio é o `PortfolioPublic`, separado do site autenticado
`Portfolio`. A criação LWR, o acesso de visitantes, os comandos de deploy e as
verificações estão documentados em
[docs/public-site.md](./docs/public-site.md).

## Modelo do conteúdo

Cada item em `Experiências (JSON)` tem a forma:

```js
{
    id: 'identificador-unico',
    role: 'Cargo real',
    organization: 'Organização real',
    period: 'Período real',
    description: 'Descrição verificável'
}
```

`Habilidades por categoria (JSON)` agrupa termos informados pelo usuário:

```json
[
  {
    "id": "backend",
    "category": "Desenvolvimento back-end",
    "skills": ["Java", "Spring Boot"]
  }
]
```

Cada item em `Projetos (JSON)` tem a forma:

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
reais. Não os cadastre como projetos no site público.

## Deploy

Nenhum deploy é realizado por este README. Execute qualquer operação de deploy
somente após autorização explícita e depois de validar os metadados e o conteúdo
na org de destino.
