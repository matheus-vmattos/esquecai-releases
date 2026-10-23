// Assina e confere o latest.yml do feed de atualização (ver
// docs/escopo-assinatura-atualizador.md). Roda só no job de publicação, atrás
// do ambiente `release`, que é quem tem o segredo ATUALIZADOR_CHAVE_PRIVADA.
//
// Uso (no job de publicação):
//   node assinar-feed.cjs assinar latest.yml latest.yml.sig
//
// A chave pública abaixo é a mesma que o app embute (CHAVE_PUBLICA_DO_ATUALIZADOR
// em src/main/verificacaoDoAtualizador.ts). O teste confere as duas.
const { createPrivateKey, createPublicKey, sign, verify } = require('crypto')
const { readFileSync, writeFileSync } = require('fs')

const CHAVE_PUBLICA = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAbMGREQrAUvTUdNorj1dVpUSaeZNLpfvXJydUy+jr2Os=
-----END PUBLIC KEY-----
`

function assinarConteudo(conteudo, chavePrivada) {
  return sign(null, conteudo, createPrivateKey(chavePrivada)).toString('base64') + '\n'
}

function conferir(conteudo, assinatura, chavePublica) {
  try {
    return verify(
      null,
      conteudo,
      createPublicKey(chavePublica),
      Buffer.from(assinatura.trim(), 'base64')
    )
  } catch {
    return false
  }
}

module.exports = { CHAVE_PUBLICA, assinarConteudo, conferir }

if (require.main === module) {
  const [modo, yml, sig] = process.argv.slice(2)
  if (modo !== 'assinar' || !yml || !sig) {
    console.error('uso: node assinar-feed.cjs assinar latest.yml latest.yml.sig')
    process.exit(2)
  }
  const chave = process.env.ATUALIZADOR_CHAVE_PRIVADA
  if (!chave) throw new Error('falta o segredo ATUALIZADOR_CHAVE_PRIVADA')
  const conteudo = readFileSync(yml)
  writeFileSync(sig, assinarConteudo(conteudo, chave))
  // confere com a chave que o app embute: se o segredo for de outro par, para aqui
  if (!conferir(conteudo, readFileSync(sig, 'utf8'), CHAVE_PUBLICA)) {
    throw new Error('a assinatura não confere com a chave pública do app: segredo errado?')
  }
  console.log(`latest.yml assinado e conferido (${sig})`)
}
