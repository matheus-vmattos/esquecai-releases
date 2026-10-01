# EsquecAI — releases

Este repositório publica o instalador Windows e o feed de atualização do EsquecAI.
O código e o workflow de validação ficam no repositório fonte
[`matheus-vmattos/esquecAI`](https://github.com/matheus-vmattos/esquecAI).

## Baixar

Abra a [versão mais recente](https://github.com/matheus-vmattos/esquecai-releases/releases/latest)
e baixe o arquivo `esquecai-<versão>-setup.exe`. O aplicativo consulta `latest.yml`
em `main` para detectar e baixar atualizações.

O instalador beta ainda não tem assinatura de código; o Windows pode mostrar o
aviso de editor não verificado.

## Publicar uma versão

1. Atualize a versão no código fonte e execute o workflow Windows numa branch
   `codex/release-*`. Ele compila, executa os testes unitários e valida o updater
   real, o app instalado e a persistência usando apenas dados sintéticos.
2. Obtenha setup, blockmap, `latest.yml` e `windows-validation.json` do candidato
   privado ou do artefato `windows-release`. Confira o commit de origem, tamanho,
   SHA-256 e SHA-512 do setup.
3. Prepare o feed numa branch deste repositório. Substitua somente as URLs
   relativas pelas URLs absolutas do release correspondente.
4. Publique setup, blockmap e manifesto no release `v<versão>`. Baixe novamente
   o setup público e confirme que tamanho e SHA-512 correspondem ao feed.
5. Só depois promova o commit do feed para `main`. Guarde o feed anterior para
   rollback; nunca substitua um artefato já usado por um feed publicado.

O workflow do repositório fonte não altera este feed automaticamente. A publicação
usa o acesso GitHub do operador/Codex depois da conferência dos arquivos. Regras
Firebase são publicadas separadamente e não fazem parte do instalador.
