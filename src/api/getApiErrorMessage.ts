import axios from 'axios'

export const getApiErrorMessage = (err: unknown): string => {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : 'Неизвестная ошибка'
  }

  const data = err.response?.data as any

  if (typeof data === 'string' && data.trim()) return data.trim()

  if (data?.errors && typeof data.errors === 'object') {
    const msgs: string[] = []

    for (const value of Object.values(data.errors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        msgs.push(...value.map((x) => String(x)))
      } else if (value != null) {
        msgs.push(String(value))
      }
    }

    const unique = Array.from(new Set(msgs.map((x) => x.trim()).filter(Boolean)))
    if (unique.length) return unique.map((m) => `• ${m}`).join('\n')
  }

  if (data?.message) return String(data.message)

  if (data?.detail) return String(data.detail)

  if (data?.title && data.title !== 'One or more validation errors occurred.') {
    return String(data.title)
  }

  return err.message || `Ошибка ${err.response?.status ?? ''}`.trim()
}