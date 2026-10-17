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

## Onde ficam os instaladores

Cada versão do EsquecAI tem um release próprio, com a tag `vX.Y.Z`, na aba
[Releases](https://github.com/matheus-vmattos/esquecai-releases/releases). Ele
traz o instalador (`esquecai-X.Y.Z-setup.exe`) e o arquivo `.blockmap`, que
permite a atualização diferencial. A página do beta baixa a cópia de nome fixo
`EsquecAI-Setup.exe`, que acompanha a versão mais recente.

O arquivo `latest.yml` deste repositório é o feed que o app consulta para se
atualizar sozinho. Ele aponta para o instalador do release da versão atual e
traz o SHA-512 e o tamanho do arquivo, que o app confere antes de instalar.

Os instaladores das versões novas não são commitados neste repositório.
