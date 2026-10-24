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
├── portfolioExperience
├── portfolioSkills
├── portfolioProjects
├── portfolioContact
└── portfolioFooter
```

O shell é responsável por tema, navegação e layout geral. Cada seção se limita à
apresentação do seu próprio conteúdo; a lógica de validação de contato está
isolada em `portfolioContact`.

## Componentes

| Bundle | Responsabilidade |
| --- | --- |
| `portfolioHome` | Compor a página, expor propriedades ao Experience Builder e fornecer conteúdo às seções. |
| `portfolioHeader` | Exibir a identificação configurada do portfólio. |
| `portfolioHero` | Apresentar o título e o resumo configurados. |
| `portfolioExperience` | Renderizar itens de experiência ou um estado vazio. |
| `portfolioSkills` | Renderizar habilidades ou um estado vazio. |
| `portfolioProjects` | Renderizar projetos, tecnologias e links opcionais. |
| `portfolioContact` | Validar e exibir canais de contato configurados. |
| `portfolioFooter` | Exibir o rodapé do portfólio. |

Os componentes filhos são internos (`isExposed=false`); a página principal é
adicionada ao Builder. Isso evita manter várias configurações independentes de
conteúdo para a mesma página.

## Conteúdo e configuração

`portfolioHome.js` é a fonte das coleções `EXPERIENCE_ITEMS`, `SKILLS` e
`PROJECTS`. No estado inicial essas coleções estão vazias intencionalmente. O
Experience Builder configura `pageTitle`, `introduction`, `contactEmail`,
`linkedinUrl` e `githubUrl` pelo metadata do `portfolioHome`.

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
- Links de contato aceitam e-mail em formato simples válido e URLs HTTPS. Links
  externos abrem em nova aba com `rel="noopener noreferrer"`.

## Testes e qualidade

- Jest com `@salesforce/sfdx-lwc-jest`: testes próximos aos bundles em
  `__tests__`.
- ESLint para JavaScript LWC.
- Executar `npm run lint` e `npm run test:unit` antes de concluir alterações.
- Mudanças em templates, propriedades públicas ou lógica devem manter ou
  atualizar os testes correspondentes.

## Metadados Experience Cloud

O metadata de `portfolioHome` declara `lightningCommunity__Page` e
`lightningCommunity__Default`, com propriedades do Builder para título, resumo e
canais de contato. Os metadados de um site Experience Cloud (por exemplo,
ExperienceBundle e configuração de publicação) não fazem parte do escopo atual.
Adicionar o LWC ao Builder e publicar o site são operações distintas; deploy ou
publicação exigem autorização explícita.
