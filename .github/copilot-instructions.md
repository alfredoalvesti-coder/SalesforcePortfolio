# Instruções para o Copilot neste projeto

## Escopo e arquitetura

- Este repositório é um projeto Salesforce DX com Salesforce API version 68.0.
- Implemente a interface com Lightning Web Components (LWC) em
  `force-app/main/default/lwc`.
- Mantenha `portfolioHome` como composição da página e ponto de entrada do
  Experience Builder. Seções são componentes focados, com responsabilidades
  pequenas e propriedades públicas claras.
- Prefira CSS isolado por bundle e reutilize as propriedades CSS de tema
  definidas no shell.
- Não adicione Apex, serviços externos, dependências ou camadas de dados sem
  necessidade justificada.

## Integridade do conteúdo

- Nunca invente nome, experiência, resultados, certificações, clientes,
  habilidades ou contatos do proprietário do portfólio.
- Use estados vazios ou marcadores explicitamente neutros até o proprietário
  fornecer dados reais.
- Não inclua dados pessoais ou URLs de contato nos testes, documentação ou
  exemplos sem autorização.
- Valide e-mails e aceite somente URLs HTTPS para links externos.

## LWC e acessibilidade

- Mantenha HTML semântico, labels acessíveis, navegação por teclado e foco
  visível.
- Preserve o comportamento responsivo em telas pequenas e o tema escuro com
  detalhes azuis.
- Use `@api` para a configuração pública do Experience Builder; atualize o
  arquivo `js-meta.xml` sempre que alterar essas propriedades ou targets.
- Não use manipulação direta do DOM quando o template LWC resolver o caso.
- Evite estado mutável compartilhado entre instâncias de componentes.

## Testes e validação

- Adicione ou atualize testes Jest para lógica JavaScript e comportamento visível.
- Execute `npm run lint` e `npm run test:unit` após alterações de código.
- Corrija a causa dos erros encontrados e repita as verificações afetadas.
- Atualize README e documentação técnica quando arquitetura, configuração ou
  comandos mudarem.

## Segurança e operações

- Não exponha credenciais, tokens ou arquivos locais `.sf`/`.sfdx`.
- Não execute deploy, publicação de site ou alteração remota em uma org sem
  autorização explícita do usuário.
- Não inclua segredos, dados reais de clientes ou conteúdo privado em código.
