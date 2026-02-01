import React from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import s from './confirmModal.module.scss'
import { lockBodyScroll, unlockBodyScroll } from '../../utils/bodyScrollLock'

type Props = {
    open: boolean
    title?: string
    text?: React.ReactNode
    confirmText?: string
    cancelText?: string
    variant?: 'default' | 'danger'
    loading?: boolean
    onConfirm: () => void | Promise<void>
    onClose: () => void
}

type AnimState = 'closed' | 'opening' | 'open' | 'closing'
const ANIM_MS = 220

const ConfirmModal: React.FC<Props> = ({
    open,
    title = 'Подтвердите действие',
    text,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    variant = 'default',
    loading,
    onConfirm,
    onClose,
}) => {
    const isBrowser = typeof document !== 'undefined'
    const [mounted, setMounted] = React.useState(open)
    const [anim, setAnim] = React.useState<AnimState>(open ? 'open' : 'closed')

    React.useEffect(() => {
        let t: number | undefined
        let raf1: number | undefined
        let raf2: number | undefined

        if (open) {
            setMounted(true)
            setAnim('opening')
            raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => setAnim('open'))
            })
        } else if (mounted) {
            setAnim('closing')
            t = window.setTimeout(() => {
                setMounted(false)
                setAnim('closed')
            }, ANIM_MS)
        }

        return () => {
            if (t) window.clearTimeout(t)
            if (raf1) cancelAnimationFrame(raf1)
            if (raf2) cancelAnimationFrame(raf2)
        }
    }, [open, mounted])

    React.useEffect(() => {
        if (!mounted || !isBrowser) return
        lockBodyScroll()
        return () => unlockBodyScroll()
    }, [mounted, isBrowser])

    React.useEffect(() => {
        if (!open) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) onClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open, onClose, loading])

    if (!isBrowser || !mounted) return null

    const safeClose = () => {
        if (loading) return
        onClose()
    }

    return createPortal(
        <div className={s.overlay} data-state={anim} onClick={safeClose} role="presentation">
            <div
                className={clsx(s.modal, variant === 'danger' && s.danger)}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className={s.head}>
                    <div className={s.title}>{title}</div>
                    <button className={clsx('btn', 'btn-ghost', s.close)} onClick={safeClose} disabled={loading}>
                        Закрыть
                    </button>
                </div>

                {text ? <div className={s.text}>{text}</div> : null}

                <div className={s.actions}>
                    <button className={clsx('btn', 'btn-ghost')} onClick={safeClose} disabled={loading}>
                        {cancelText}
                    </button>

                    <button className={clsx('btn', variant === 'danger' ? s.btnDanger : 'btn-primary')} onClick={onConfirm} disabled={loading}>
                        {loading ? 'Подождите…' : confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmModal