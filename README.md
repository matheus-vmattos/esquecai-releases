# esquecai-releases

Instaladores de beta do EsquecAI e o feed de auto-atualização que o app usa
para se atualizar sozinho. O código-fonte do app é privado; este repositório
guarda só os artefatos de build.

## "O Windows protegeu o computador" ao instalar

O instalador (`esquecai-X.Y.Z-setup.exe`) não é assinado digitalmente --
um certificado de assinatura de código custa dinheiro e não compensa pra
um beta com poucos usuários (ver `signExecutable: false` no
`electron-builder.yml` do repo de código-fonte). Por causa disso, o
SmartScreen do Windows mostra um aviso de "editor desconhecido" no
instalador novo -- é sempre assim com qualquer app sem esse certificado,
não é sinal de vírus.

Pra instalar mesmo assim:

1. Na tela azul "O Windows protegeu o computador", clique em
   **"Mais informações"**.
2. Confira que o nome do aplicativo é **EsquecAI**.
3. Clique em **"Executar assim mesmo"**.

Se o antivírus (Windows Defender ou outro) também colocar o `.exe` em
quarentena, restaure o arquivo a partir do histórico de proteção do
antivírus -- mesmo motivo (falta de assinatura), não é detecção de
malware real.

## Por que o instalador vai sair daqui (e como fazer)

Este repositório guarda o instalador **dentro do git**, e isso tem um
custo que só cresce: cada versão fica no histórico para sempre. Hoje são
27 versões e o repositório pesa **666 MB** no GitHub -- quem clona baixa
todas as versões antigas junto. Além disso o GitHub recusa qualquer
arquivo acima de **100 MiB** num push, e a 0.84.0 ficou em 96,7 MiB: a
margem é de 3,2 MiB.

O lugar certo de um binário é **GitHub Releases**: limite de 2 GB por
arquivo, e nada entra no histórico do git. O feed de atualização continua
funcionando sem mudar nada no app, porque o `latest.yml` (348 bytes,
continua aqui) pode apontar para uma URL absoluta -- o electron-updater
resolve com `new URL(url, base)`, e uma URL absoluta sobrepõe a base.
Verificado no código do electron-updater (`out/providers/Provider.js`,
função `resolveFiles`).

### O procedimento, na ordem certa

A ordem importa: se o `latest.yml` apontar para um asset que ainda não
existe, todo mundo que tentar atualizar recebe erro. **Primeiro o asset,
depois o feed.**

1. No GitHub, em **Releases → Draft a new release**, criar a tag
   `vX.Y.Z` e arrastar para lá os dois arquivos:
   `esquecai-X.Y.Z-setup.exe` e `esquecai-X.Y.Z-setup.exe.blockmap`.
   (O `.blockmap` é o que permite a atualização diferencial -- sem ele o
   app baixa o instalador inteiro toda vez.)
2. Publicar o release e conferir que a URL do asset é
   `https://github.com/matheus-vmattos/esquecai-releases/releases/download/vX.Y.Z/esquecai-X.Y.Z-setup.exe`
3. No `latest.yml` deste repositório, trocar os dois campos de caminho
   (`files[0].url` e `path`) pela URL absoluta acima. Os campos `sha512`
   e `size` **não mudam** -- eles descrevem o arquivo, não onde ele está,
   e é com eles que o app confere o download.
4. `git rm` do `.exe` e do `.blockmap`, e commit.

Exemplo do `latest.yml` depois da mudança:

```yaml
version: 0.84.0
files:
  - url: https://github.com/matheus-vmattos/esquecai-releases/releases/download/v0.84.0/esquecai-0.84.0-setup.exe
    sha512: IRCtMVIGtsULQ/QsrYobrM41XkXhGdUJmGwWxbd+k1OkO+qvVrSNR/ACdI4aQ2YY7eBd8CdERTFmG8gimxB+Wg==
    size: 101448476
path: https://github.com/matheus-vmattos/esquecai-releases/releases/download/v0.84.0/esquecai-0.84.0-setup.exe
sha512: IRCtMVIGtsULQ/QsrYobrM41XkXhGdUJmGwWxbd+k1OkO+qvVrSNR/ACdI4aQ2YY7eBd8CdERTFmG8gimxB+Wg==
releaseDate: '2026-09-20T01:59:08.596Z'
```

Tirar o `.exe` do commit novo **não encolhe** o repositório: os 666 MB
continuam no histórico. Encolher exige reescrever o histórico
(`git filter-repo`) e um push forçado, que reescreve todos os commits --
vale fazer uma vez, com calma, não junto de uma publicação.

### Uma armadilha: Git LFS não serve aqui

LFS parece a solução óbvia e quebraria a atualização automática: o
`raw.githubusercontent.com`, de onde o app baixa o feed, devolve o
**arquivo-ponteiro de texto** de um arquivo LFS, não o binário. O app
baixaria ~130 bytes achando que baixou o instalador.
