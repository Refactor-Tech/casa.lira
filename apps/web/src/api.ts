import type { ApiError, Product, ProductInput } from '@casa-lira/contracts'

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: ApiError,
  ) {
    super(detail.message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body != null) headers.set('Content-Type', 'application/json')
  const response = await fetch(path, { ...init, headers })
  if (!response.ok) {
    let detail: ApiError
    try {
      detail = await response.json() as ApiError
    } catch {
      detail = { code: 'HTTP_ERROR', message: 'Não foi possível concluir a operação.' }
    }
    throw new ApiRequestError(response.status, detail)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const catalogApi = {
  listPublic: () => request<Product[]>('/api/products'),
  getPublic: (id: number) => request<Product>(`/api/products/${id}`),
  listAdmin: () => request<Product[]>('/api/admin/products'),
  getAdmin: (id: number) => request<Product>(`/api/admin/products/${id}`),
  create: (input: ProductInput) => request<Product>('/api/admin/products', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, input: ProductInput) => request<Product>(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  publish: (id: number) => request<Product>(`/api/admin/products/${id}/publish`, { method: 'POST' }),
  unpublish: (id: number) => request<Product>(`/api/admin/products/${id}/unpublish`, { method: 'POST' }),
  remove: (id: number) => request<void>(`/api/admin/products/${id}`, { method: 'DELETE' }),
}
