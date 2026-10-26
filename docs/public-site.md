# Site público do portfólio

## Estado atual

O site público foi criado separadamente do site autenticado anterior:

| Propriedade       | Valor                                                                    |
| ----------------- | ------------------------------------------------------------------------ |
| Nome              | `PortfolioPublic`                                                        |
| Template          | `Build Your Own (LWR)`                                                   |
| Acesso            | `AUTHENTICATED_WITH_PUBLIC_ACCESS_ENABLED`                               |
| Status do Network | `Live`                                                                   |
| Status do Site    | `Active`                                                                 |
| URL pública       | <https://orgfarm-349195c4a9-dev-ed.develop.my.site.com/portfoliopublic/> |
| Página inicial    | Componente LWC `c:portfolioHome`                                         |

O site antigo `Portfolio` não foi convertido nem substituído; permanece separado
e autenticado. O site público usa o bundle
[`PortfolioPublic1`](../force-app/main/default/digitalExperiences/site/PortfolioPublic1/PortfolioPublic1.digitalExperience-meta.xml).

## Por que foi criado um segundo site

O site original foi criado como LWR autenticado. A Salesforce não permitiu
alterar esse site para `UNAUTHENTICATED` por deploy, e o template LWR rejeitou
essa opção na criação. Para permitir visitantes sem login, o novo site foi
criado com `AUTHENTICATED_WITH_PUBLIC_ACCESS_ENABLED`, que habilita acesso
público por guest user sem remover a possibilidade de autenticação.

Essa configuração de acesso é diferente de **Send welcome email**: email de
boas-vindas não torna um site público e não é necessário para visitantes
anônimos.

## Como o site foi montado

1. **Criar o site público LWR.** O comando cria o site em estado de preparação e
   retorna uma operação assíncrona:

   ```powershell
   sf community create --name "PortfolioPublic" --template-name "Build Your Own (LWR)" --target-org vscodeOrg --url-path-prefix "portfoliopublic" templateParams.AuthenticationType=AUTHENTICATED_WITH_PUBLIC_ACCESS_ENABLED
   ```

   Aguarde a operação `Connect API Site Create` terminar antes de recuperar o
   bundle. O Salesforce pode acrescentar um sufixo ao `UrlPathPrefix` interno;
   o endereço público atual é o listado na tabela acima.

2. **Recuperar o bundle criado na org.** O nome do bundle neste projeto é
   `site/PortfolioPublic1`:

   ```powershell
   sf project retrieve start --metadata "DigitalExperienceBundle:site/PortfolioPublic1" --target-org vscodeOrg --wait 30
   ```

3. **Compor a página inicial.** Em
   [`home/content.json`](../force-app/main/default/digitalExperiences/site/PortfolioPublic1/sfdc_cms__view/home/content.json),
   a região principal da view `home` instancia `c:portfolioHome`. As propriedades
   usam apenas as áreas profissionais informadas pelo usuário; experiências,
   projetos e canais de contato específicos permanecem vazios:

   ```json
   {
     "pageTitle": "Desenvolvedor Salesforce Sênior",
     "introduction": "Salesforce, Java, Spring Boot, integrações e arquitetura de software.",
     "aboutText": "Desenvolvedor Salesforce Sênior com conhecimentos em Java, Spring Boot, integrações e arquitetura de software.",
     "experienceItemsJson": "[]",
     "skillGroupsJson": "[{\"id\":\"backend\",\"category\":\"Desenvolvimento back-end\",\"skills\":[\"Java\",\"Spring Boot\"]}]",
     "projectsJson": "[]",
     "contactEmail": "",
     "linkedinUrl": "",
     "githubUrl": ""
   }
   ```

   A página oculta experiência, projetos e contato enquanto não houver dados
   válidos, evitando exibir instruções de preenchimento aos visitantes.

   O site reutiliza os componentes LWC em
   [`force-app/main/default/lwc`](../force-app/main/default/lwc), sem Apex ou
   chamadas a serviços externos.

4. **Implantar o bundle no site novo.**

   ```powershell
   sf project deploy start --source-dir "force-app\main\default\digitalExperiences\site\PortfolioPublic1" --target-org vscodeOrg --wait 30
   ```

5. **Publicar o Experience Builder site.**

   ```powershell
   sf community publish --name PortfolioPublic --target-org vscodeOrg
   ```

   A publicação é assíncrona. Aguarde a operação `Connect API Site Publish`
   terminar e confira o estado do Network:

   ```powershell
   sf data query --query "SELECT Id, Name, Status, UrlPathPrefix FROM Network WHERE Name = 'PortfolioPublic'" --target-org vscodeOrg
   ```

   Nesta org, a operação de publicação terminou, mas o Network continuou em
   `UnderConstruction`. Depois de confirmar que a operação terminou, foi
   necessário ativar o Network:

   ```powershell
   sf data update record --sobject Network --record-id "<NETWORK_ID>" --values "Status=Live" --target-org vscodeOrg
   ```

   Use o ID retornado pela consulta da sua própria org; não reutilize IDs de
   outra organização. Confirme também que o registro `Site` está `Active`.

## Verificar o acesso público

Teste a URL sem sessão Salesforce — por exemplo, em uma janela privada ou com
uma requisição HTTP sem cookies:

```powershell
curl.exe --silent --show-error --location --output NUL --write-out "HTTP=%{http_code} URL=%{url_effective}`n" "https://orgfarm-349195c4a9-dev-ed.develop.my.site.com/portfoliopublic/"
```

Um redirecionamento para `/login` indica que o acesso anônimo ainda não está
funcionando. Na publicação atual, a URL final retornou HTTP `200` sem login e a
página inicial exibiu o `portfolioHome`.

## Segurança e manutenção

- Acesso público significa que qualquer visitante pode abrir o conteúdo
  disponibilizado no site.
- Antes de preencher experiências, projetos ou canais de contato, revise o
  conteúdo para confirmar que ele pode ser publicado.
- O portfólio atual é estático. Se forem adicionados dados Salesforce, Apex,
  arquivos ou integrações, revise as permissões do Guest User Profile, o
  compartilhamento e o acesso aos registros antes de publicar.
- O tipo de autenticação é definido na criação do site LWR. Para mudar esse
  modo, crie outro site com a configuração adequada em vez de tentar converter
  o existente por deploy.
- Não armazene senhas nem tokens no repositório. Use os mecanismos de
  autenticação do Salesforce CLI.
