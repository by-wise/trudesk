<h1 align="center">
<a href="http://trudesk.io"><img src="http://trudesk.io/TD_Black.png" width="500" /></a>
<br />Community Edition — By Wise Fork
</h1>
<p align="center">
<a href="https://github.com/by-wise/trudesk/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-APACHE%202-green.svg?style=flat-square" /></a>
<a href="https://github.com/by-wise/trudesk/pkgs/container/trudesk"><img src="https://img.shields.io/badge/ghcr.io-by--wise%2Ftrudesk-blue?style=flat-square&logo=docker" /></a>
<a href="https://github.com/by-wise/trudesk/releases"><img src="https://img.shields.io/badge/version-1.3.0--by--wise-orange.svg?style=flat-square" /></a>
<a href="https://github.com/polonel/trudesk"><img src="https://img.shields.io/badge/upstream-polonel%2Ftrudesk-lightgrey.svg?style=flat-square" /></a>
<br />
<sub>© 2014-2023, Trudesk, Inc. (<b><a href="https://trudesk.io">@trudesk</a></b>). Fork mantido por <b>By Wise</b>.</sub>
</p>
<br />

### Open Source Help Desk - Simply Organized.
Solução de help desk simples e organizada. Este repositório é um **fork interno mantido pela By Wise**, baseado no [Trudesk Community Edition](https://github.com/polonel/trudesk), com customizações específicas para a operação da empresa.

### Sobre este fork
- **Upstream:** [polonel/trudesk](https://github.com/polonel/trudesk)
- **Este repositório:** [by-wise/trudesk](https://github.com/by-wise/trudesk)
- **Versão atual:** `1.3.0-by-wise`
- **Imagem Docker:** `ghcr.io/by-wise/trudesk` (tags `1.3.0`, `1.2.11`, ... e `latest`)

O objetivo do fork é manter o Trudesk CE atualizável a partir do projeto original, aplicando por cima ajustes de internacionalização, deploy/Docker, backup/restore e correções pontuais usadas no dia a dia da By Wise.

### Customizações aplicadas neste fork
Resumo das principais mudanças feitas a partir da base do mantenedor (detalhes completos no [CHANGELOG.md](CHANGELOG.md)):

- **Internacionalização (i18n)**: suporte a `en-US` e `pt-BR` via `@ladjs/i18n`, com endpoint de tradução, preferência de locale no perfil do usuário, middleware de detecção de idioma e helpers do Handlebars para traduzir as views.
- **Docker & Deploy**:
  - Imagem publicada em `ghcr.io/by-wise/trudesk` (com tag `latest` sempre apontando para o último release).
  - `docker-compose.yml` de produção com portas do MongoDB e Elasticsearch vinculadas a `127.0.0.1` (segurança), volume de configuração montado como diretório e dependência explícita do serviço `mongo`.
  - `docker-compose.dev.yml` para desenvolvimento local, com bind mount do projeto e volume anônimo de `node_modules` (evita conflitos de dependências nativas como `bcrypt` no macOS ARM64).
  - Inicialização via PM2 (`ecosystem.config.js`), garantindo que stdout/stderr sejam gravados em `logs/output.log` e a tela administrativa de logs funcione corretamente dentro do container.
  - Scripts `docker:build`, `docker:publish`, `docker:up`, `docker:down`, `docker:dev:up` e `docker:dev:down` no `package.json`.
- **Backup & Restore**: após uma restauração bem-sucedida, a flag de configuração `installed` é forçada para `true` automaticamente — útil para restaurações automatizadas via Docker, sem passar pelo wizard de instalação. Também foi adicionada a flag `global.isDocker` (baseada na env `TRUDESK_DOCKER`).
- **Verificação de e-mail (IMAP MailCheck)**: correção da cadeia de callbacks para garantir que todas as mensagens não lidas sejam processadas e `handleMessages` seja chamado corretamente após o fetch.
- **Anexos de tickets**: mensagens de erro mais descritivas (mostram o mime-type/extensão inválido), suporte a `application/zip` e aumento do limite de upload para 20MB.
- **Logs**: nível de log padrão alterado para `debug`.

#### Deploy Trudesk Anywhere
**Trudesk** é construído com <a href="https://nodejs.org">nodejs</a> e <a href="https://mongodb.org">mongodb</a> e roda em qualquer provedor de nuvem, Docker, bare-metal ou até um Raspberry Pi.

##### Produção (Docker Compose)
```bash
docker compose up -d
```
Usa a imagem `ghcr.io/by-wise/trudesk:1.3.0`, com configuração persistida em `./config` e dados de upload/backup em volumes nomeados.

##### Desenvolvimento (Docker Compose)
```bash
yarn docker:dev:up
```
Sobe o stack com `docker-compose.dev.yml`, montando o projeto local dentro do container para hot-reload.

#### Requirements
- NodeJS 16+
- MongoDB 5.0+
- Elasticsearch 8 (opcional, habilita busca)

### Documentação
- Documentação original do Trudesk CE: [https://docs.trudesk.io/v1.2](https://docs.trudesk.io/v1.2)
- Mudanças específicas deste fork: [CHANGELOG.md](CHANGELOG.md)
- Manifests de Kubernetes: [kubernetes/](kubernetes)

### Contribuindo
Para mudanças que façam sentido para o projeto original, considere também enviar um PR para [polonel/trudesk](https://github.com/polonel/trudesk). Para customizações específicas da By Wise, abra um PR neste repositório.

### Créditos
Este projeto é baseado no [Trudesk Community Edition](https://github.com/polonel/trudesk), criado e mantido por Chris Brame / Trudesk, Inc. Agradecimentos também aos sponsors originais do projeto, como o [BrowserStack](https://browserstack.com).

### License

    Copyright 2014-2023 Trudesk, Inc.
    Modifications Copyright 2025-2026 By Wise.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
