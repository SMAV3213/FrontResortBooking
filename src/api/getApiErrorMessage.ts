import axios from 'axios'

export const getApiErrorMessage = (err: unknown): string => {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : 'Неизвестная ошибка'
  }

  const data = err.response?.data as any

  if (typeof data === 'string' && data.trim()) return data

  if (data?.message) return String(data.message)

  if (data?.detail) return String(data.detail)
  if (data?.title) return String(data.title)

  if (data?.errors && typeof data.errors === 'object') {
    const msgs: string[] = []
    for (const key of Object.keys(data.errors)) {
      const arr = data.errors[key]
      if (Array.isArray(arr)) msgs.push(...arr.map(String))
    }
    if (msgs.length) return msgs.join('\n')
  }

  // fallback
  return err.message || `Ошибка ${err.response?.status ?? ''}`.trim()
}