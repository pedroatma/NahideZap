/**
 * CONTORNO TEMPORÁRIO — bug da Meta Cloud API iniciado em 28/08/2026.
 *
 * Desde 28/08/2026 o endpoint POST /{phoneNumberId}/messages da Cloud API
 * responde HTTP 500 ({"error":{"code":1,"message":"An unknown error has
 * occurred.","type":"OAuthException"}}) quando o corpo é enviado como
 * application/json. O MESMO payload em application/x-www-form-urlencoded
 * retorna 200 e devolve o wamid. Confirmado no fórum da Meta e reproduzido
 * no console.
 *
 * Este helper converte o payload em URLSearchParams para o formato de
 * formulário. Assim que a Meta corrigir o bug, ESTE ARQUIVO DEVE SER
 * REMOVIDO e os pontos de envio devem voltar para Content-Type
 * application/json + JSON.stringify(payload).
 */

/**
 * Converte um payload de mensagem em URLSearchParams (form-urlencoded).
 *
 * Regras:
 * - undefined e null são ignorados (não entram no corpo).
 * - Valores escalares (string, number, boolean, bigint) vão como String(value).
 * - Valores objeto vão como JSON.stringify(value). IMPORTANTE: em JavaScript
 *   `typeof [] === 'object'`, então ARRAYS caem aqui também e são serializados
 *   como JSON. Isso é essencial para componentes de template, que chegam como
 *   array e não podem virar "[object Object]".
 */
export function toGraphFormBody(payload: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) {
      continue
    }

    if (typeof value === 'object') {
      // Objetos e arrays: serializa como JSON (formulário não aceita aninhamento).
      params.append(key, JSON.stringify(value))
    } else {
      // Escalares.
      params.append(key, String(value))
    }
  }

  return params
}
