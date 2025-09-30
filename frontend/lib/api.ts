const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function postJson(url: string, data: any) {
  const response = await fetch(`${BASE_URL}/api${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result?.message || 'Something went wrong')
  }
  return result
}

export async function getJson(url: string) {
  const response = await fetch(`${BASE_URL}/api${url}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result?.message || 'Something went wrong')
  }
  return result
}


