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


## Integração com Obsidian — Documentação obrigatória

### Fonte de conhecimento

O Obsidian é o repositório principal de documentação técnica, decisões arquiteturais e histórico de desenvolvimento.

- Cofre: `EstudoSalesforce-Brain`
- Projeto: `Projetos/SalesforcePortfolio`
- Arquivo inicial: `Projetos/SalesforcePortfolio/README.md`

Os caminhos acima são relativos à raiz do cofre. Localize o cofre no workspace antes de utilizar esses caminhos. Não presuma que ele está dentro do repositório Salesforce.

### Antes de implementar

Para cada tarefa de desenvolvimento:

1. Identificar os componentes e funcionalidades envolvidos.
2. Localizar o cofre Obsidian no workspace.
3. Consultar o índice do projeto e os documentos relevantes.
4. Comparar a documentação com o código existente.
5. Identificar regras de negócio, decisões arquiteturais e dependências.
6. Planejar a alteração respeitando a arquitetura atual.

Se a documentação estiver ausente ou desatualizada, registrar a situação e utilizar o código existente como referência para verificar o comportamento implementado.

Se o cofre não estiver acessível, informar explicitamente. Nunca afirmar que consultou documentos sem realmente lê-los.

### Durante a implementação

- Respeitar decisões arquiteturais documentadas.
- Reutilizar componentes e padrões existentes.
- Evitar implementações duplicadas.
- Registrar decisões técnicas relevantes.
- Não alterar a documentação para justificar uma implementação incorreta.

### Após implementar

Atualizar os documentos afetados no Obsidian:

- `arquitetura.md`: mudanças estruturais e dependências.
- `componentes.md`: componentes LWC criados ou modificados.
- `decisoes.md`: decisões técnicas e justificativas.
- `testes.md`: testes executados e seus resultados reais.
- `historico.md`: resumo das alterações e arquivos afetados.
- `README.md`: índice, estado do projeto e documentação disponível.

Atualizar apenas os documentos relacionados à tarefa. Não gerar registros repetitivos ou desnecessários.

### Critérios de conclusão

Antes de considerar uma tarefa concluída:

1. Verificar se a implementação atende aos requisitos.
2. Executar os testes pertinentes.
3. Revisar os resultados e corrigir falhas identificadas.
4. Atualizar a documentação afetada no Obsidian.
5. Informar quais documentos foram consultados e atualizados.
6. Informar pendências, limitações e testes não executados.

Uma tarefa com alteração técnica relevante não deve ser considerada completamente documentada enquanto os registros correspondentes estiverem pendentes.

### Segurança da documentação

- Nunca registrar credenciais ou tokens.
- Nunca copiar dados confidenciais de clientes.
- Não incluir informações pessoais sem autorização.
- Não enviar o cofre Obsidian ao GitHub sem autorização explícita.
- Manter a documentação consistente com o estado real do código.