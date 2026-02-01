let locks = 0
let prevBodyOverflow: string | null = null
let prevHtmlOverflow: string | null = null
let prevBodyPaddingRight: string | null = null

const getScrollbarWidth = () => {
    if (typeof window === 'undefined') return 0
    return window.innerWidth - document.documentElement.clientWidth
}

export const lockBodyScroll = () => {
    if (typeof document === 'undefined') return

    if (locks === 0) {
        prevBodyOverflow = document.body.style.overflow
        prevHtmlOverflow = document.documentElement.style.overflow
        prevBodyPaddingRight = document.body.style.paddingRight

        const sw = getScrollbarWidth()
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'

        // чтобы страница не "дёргалась" при пропаже скроллбара
        if (sw > 0) {
            document.body.style.paddingRight = `${sw}px`
        }
    }

    locks += 1
}

export const unlockBodyScroll = () => {
    if (typeof document === 'undefined') return

    locks = Math.max(0, locks - 1)

    if (locks === 0) {
        document.body.style.overflow = prevBodyOverflow ?? ''
        document.documentElement.style.overflow = prevHtmlOverflow ?? ''
        document.body.style.paddingRight = prevBodyPaddingRight ?? ''

        prevBodyOverflow = null
        prevHtmlOverflow = null
        prevBodyPaddingRight = null
    }
}

/** аварийный сброс, если где-то всё-таки залипло */
export const resetBodyScrollLock = () => {
    locks = 0
    if (typeof document === 'undefined') return
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    document.body.style.paddingRight = ''
}