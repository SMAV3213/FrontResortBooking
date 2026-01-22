export type JwtPayload = Record<string, any>

const base64UrlDecode = (input: string) => {
    const pad = '='.repeat((4 - (input.length % 4)) % 4)
    const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/')
    return decodeURIComponent(
        atob(b64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    )
}

export const decodeJwt = <T = JwtPayload>(token: string): T | null => {
    try {
        const [, payload] = token.split('.')
        if (!payload) return null
        return JSON.parse(base64UrlDecode(payload)) as T
    } catch {
        return null
    }
}

export const getUserIdFromJwt = (p: JwtPayload | null): string | null => {
    return p?.sub ?? null
}

export const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

export const getRoleFromJwt = (p: JwtPayload | null): string | null => {
    return p?.[CLAIM_ROLE] ?? p?.role ?? null
}