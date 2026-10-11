# Encurtador do EsquecAI

`https://esquecai-link.mvmattos.workers.dev/<id>` → endereço guardado em
Firestore `linksCurtos/<id>`. O app cria o documento (regra em
docs/firestore-0.99.37.rules do repositório do app); este worker só lê por id e
redireciona (302, cache de 5 minutos). Sem segredos no código.

Publicação: `.github/workflows/encurtador.yml` (wrangler), com os segredos do
repositório `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`, que o dono cria
(o Claude nunca vê o valor).
