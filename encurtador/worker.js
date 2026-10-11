// Encurtador do EsquecAI: /<id> → 302 para o endereço guardado em
// Firestore linksCurtos/<id> (só leitura pública por id; quem cria é o app,
// com a conta do EsquecAI, pelas regras do Firestore). Sem segredos aqui.
const PROJETO = 'esquecai'
const ID = /^[A-Za-z0-9]{8}$/

function pagina(status, texto) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>EsquecAI</title><p style="font:16px system-ui;margin:3rem auto;max-width:28rem;text-align:center">${texto}</p>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  )
}

export default {
  async fetch(pedido, env, ctx) {
    if (pedido.method !== 'GET' && pedido.method !== 'HEAD') return pagina(405, 'Método não aceito.')
    const id = new URL(pedido.url).pathname.slice(1)
    if (!ID.test(id)) return pagina(404, 'Link não encontrado.')

    const cache = caches.default
    const guardado = await cache.match(pedido)
    if (guardado) return guardado

    const base = env.FIRESTORE_BASE ?? 'https://firestore.googleapis.com'
    const projeto = env.FIRESTORE_PROJETO ?? PROJETO
    const doc = await fetch(
      `${base}/v1/projects/${projeto}/databases/(default)/documents/linksCurtos/${id}`
    )
    if (doc.status === 404) return pagina(404, 'Link não encontrado.')
    if (!doc.ok) return pagina(502, 'Não consegui abrir este link agora. Tente de novo.')

    const destino = (await doc.json())?.fields?.url?.stringValue
    let alvo
    try {
      alvo = new URL(destino)
    } catch {
      return pagina(404, 'Link não encontrado.')
    }
    if (alvo.protocol !== 'https:' && alvo.protocol !== 'http:') return pagina(404, 'Link não encontrado.')

    // 302 (não 301): link apagado no app deixa de valer em até 5 minutos
    const resposta = new Response(null, {
      status: 302,
      headers: {
        location: alvo.href,
        'cache-control': 'public, max-age=300',
        'referrer-policy': 'no-referrer'
      }
    })
    ctx.waitUntil(cache.put(pedido, resposta.clone()))
    return resposta
  }
}
