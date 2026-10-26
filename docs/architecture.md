# Arquitetura técnica

## Visão geral

O projeto é um Salesforce DX organizado em bundles LWC sob
`force-app/main/default/lwc`. `portfolioHome` é o ponto de composição da página
e o único componente exposto ao Experience Builder. Ele possui as propriedades
simples de configuração da página e passa os dados às seções filhas.

```text
portfolioHome
├── portfolioHeader
├── portfolioHero
├── portfolioAbout
├── portfolioExperience
├── portfolioSkills
├── portfolioProjects
├── portfolioContact
└── portfolioFooter
```

O shell é responsável por tema, navegação e layout geral. Cada seção se limita à
apresentação do seu próprio conteúdo. As regras de validação ficam em módulos
utilitários internos, sem template:

- `portfolioValidationUtils`: validação centralizada de URLs HTTPS,
  `parseArraySetting` e validadores dos itens de experiência, habilidades e
  projetos. É usado por `portfolioHome` e `portfolioContactUtils`.
- `portfolioContactUtils`: validação de e-mail e montagem dos links de contato,
  reutilizando a validação de URL de `portfolioValidationUtils`.

## Componentes

| Bundle                | Responsabilidade                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `portfolioHome`       | Compor a página, expor propriedades ao Experience Builder e fornecer conteúdo às seções. |
| `portfolioHeader`     | Exibir a identificação configurada do portfólio.                                         |
| `portfolioHero`       | Apresentar o título e o resumo configurados.                                             |
| `portfolioAbout`      | Apresentar o resumo profissional configurado.                                            |
| `portfolioExperience` | Renderizar itens de experiência ou um estado vazio.                                      |
| `portfolioSkills`     | Renderizar habilidades ou um estado vazio.                                               |
| `portfolioProjects`   | Renderizar projetos, tecnologias e links opcionais.                                      |
| `portfolioContact`    | Validar e exibir canais de contato configurados.                                         |
| `portfolioFooter`     | Exibir o rodapé do portfólio.                                                            |

Os componentes filhos são internos (`isExposed=false`); a página principal é
adicionada ao Builder. Isso evita manter várias configurações independentes de
conteúdo para a mesma página.

## Conteúdo e configuração

`portfolioHome` orquestra a página e recebe o conteúdo estruturado nas
propriedades JSON do Experience Builder:

- `experienceItemsJson`: itens com `id`, `role`, `organization`, `period` e
  `description`.
- `skillGroupsJson`: grupos com `id`, `category` e uma lista `skills`.
- `projectsJson`: itens com `id`, `name`, `description`, `technologies` e URLs
  opcionais HTTPS.

Também são configuráveis `pageTitle`, `introduction`, `aboutText`,
`contactEmail`, `linkedinUrl` e `githubUrl`. Experiências e projetos começam
vazios e suas seções e âncoras são omitidas até haver conteúdo válido. Contato
vazio ou inválido não é exibido; entradas JSON inválidas geram um aviso de
configuração em vez de falharem silenciosamente. Os grupos de habilidades
padrão refletem somente as áreas informadas pelo usuário.

Não há Apex, chamadas de rede ou persistência. Para este portfólio estático, os
componentes recebem os dados por propriedades públicas (`@api`). Se o escopo
futuramente exigir edição de conteúdo por usuários não técnicos, avaliar CMS ou
Custom Metadata em uma etapa separada, sem introduzir essa complexidade no
shell inicial.

## UI, acessibilidade e responsividade

- CSS é encapsulado por bundle; o shell define propriedades CSS de tema que os
  componentes filhos reutilizam.
- A estrutura usa landmarks e headings semânticos, link para pular ao conteúdo,
  navegação entre seções e estilos de foco visíveis.
- Grid, flexbox, medidas fluidas e breakpoints adaptam as seções a telas menores.
- O shell inclui fallback `100vh` e `100svh` para a altura dinâmica de viewport.
- Links de contato aceitam e-mail em formato simples válido. Links externos
  (LinkedIn, GitHub, repositório e demonstração) abrem em nova aba com
  `rel="noopener noreferrer"`.

## Validação de URLs externas

`isHttpsUrl` em `portfolioValidationUtils` aceita uma URL somente quando:

- o valor é uma string que começa literalmente com `https://` e não contém
  espaços ou outros caracteres de espaço em branco;
- `new URL()` consegue interpretá-la (erros são tratados com `try/catch`);
- o protocolo resultante é `https:`;
- o hostname tem ao menos dois rótulos não vazios separados por ponto.

Links de contato são aparados (`trim`) antes da validação. Links opcionais de
projeto podem estar ausentes ou vazios; qualquer outro valor precisa ser uma
URL HTTPS válida, caso contrário a lista de projetos gera aviso de
configuração. O valor exibido no `href` é o informado (aparado no caso de
contato), sem normalização adicional.

## Testes e qualidade

- Jest com `@salesforce/sfdx-lwc-jest`: testes próximos aos bundles em
  `__tests__`. `portfolioValidationUtils` tem testes unitários diretos para
  URLs válidas e inválidas, tipos inesperados e configurações JSON.
- ESLint para JavaScript LWC.
- Executar `npm run lint` e `npm run test:unit` antes de concluir alterações.
- Mudanças em templates, propriedades públicas ou lógica devem manter ou
  atualizar os testes correspondentes.

## Metadados Experience Cloud

O metadata de `portfolioHome` declara `lightningCommunity__Page` e
`lightningCommunity__Default`, com propriedades do Builder para título,
apresentação, dados JSON e canais de contato. O site público `PortfolioPublic` usa um
`DigitalExperienceBundle` em
`force-app/main/default/digitalExperiences/site/PortfolioPublic1` e a página
inicial compõe o LWC `c:portfolioHome`. O site autenticado `Portfolio` é
independente e não foi convertido.

O tipo de autenticação e a publicação do Experience Cloud são configurações
separadas do bundle LWC. O site público foi criado como LWR com
`AUTHENTICATED_WITH_PUBLIC_ACCESS_ENABLED`; veja
[public-site.md](./public-site.md) para os comandos, ativação do Network e
verificação de acesso anônimo.
