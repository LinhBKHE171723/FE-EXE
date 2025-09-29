const API_BASE = import.meta.env.VITE_API_BASE_URL
const AI_BASE = import.meta.env.VITE_AI_API_URL || (API_BASE ? API_BASE + '/ai' : '')
let token = localStorage.getItem('gaosach:token') || null
export const setToken = (t) => { token = t; if (t) localStorage.setItem('gaosach:token', t); else localStorage.removeItem('gaosach:token') }
async function handleRes(res){
  const contentType = res.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await res.json() : await res.text()
  if (res.status === 401) { setToken(null) }
  if (!res.ok) { const message = typeof payload==='string'? payload : payload?.message || res.statusText; throw new Error(message) }
  return payload
}
export async function request(path, { method='GET', data, headers={}, ...rest } = {}){
  if (!API_BASE) throw new Error('Thiếu VITE_API_BASE_URL trong .env')
  const res = await fetch(`${API_BASE}${path}`, {
    method, headers: { 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}), ...headers },
    body: data ? JSON.stringify(data) : undefined, credentials:'include', ...rest
  })
  return handleRes(res)
}
export async function aiRequest(path, { method='POST', data, headers={}, ...rest } = {}){
  if (!AI_BASE) throw new Error('Thiếu VITE_AI_API_URL hoặc VITE_API_BASE_URL để suy ra AI_BASE')
  const url = path.startsWith('http') ? path : `${AI_BASE}${path}`
  const res = await fetch(url, {
    method, headers: { 'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}), ...headers },
    body: data ? JSON.stringify(data) : undefined, ...rest
  })
  return handleRes(res)
}