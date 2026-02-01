import React from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import type { RoomTypeWithoutRoomsDTO } from '../../types/roomTypeDTOs'
import s from './typeInfo.module.scss'
import { API_BASE } from '../../api/api'
import { lockBodyScroll, unlockBodyScroll } from '../../utils/bodyScrollLock'

type Props = {
    open: boolean
    item: RoomTypeWithoutRoomsDTO | null
    onClose: () => void
    className?: string
    showActions?: boolean
    onBook?: (item: RoomTypeWithoutRoomsDTO) => void
    bookingDisabled?: boolean
}

const priceFmt = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
})

type AnimState = 'closed' | 'opening' | 'open' | 'closing'
const ANIM_MS = 320

const TypeInfo: React.FC<Props> = ({ open, item, onClose, className, showActions, bookingDisabled, onBook }) => {
    const isBrowser = typeof document !== 'undefined'

    const [activeIdx, setActiveIdx] = React.useState(0)
    const [mounted, setMounted] = React.useState(open)
    const [anim, setAnim] = React.useState<AnimState>(open ? 'open' : 'closed')

    const images = item?.imageUrls ?? []
    const hasImages = images.length > 0
    const safeActiveIdx = Math.min(activeIdx, Math.max(0, images.length - 1))
    const activeImage = hasImages ? images[safeActiveIdx] : null

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
        if (open) setActiveIdx(0)
    }, [open, item?.id])

    React.useEffect(() => {
        if (!open) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()

            if (!hasImages) return
            if (e.key === 'ArrowLeft') setActiveIdx((i) => Math.max(0, i - 1))
            if (e.key === 'ArrowRight') setActiveIdx((i) => Math.min(images.length - 1, i + 1))
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open, onClose, hasImages, images.length])

    React.useEffect(() => {
        if (!mounted || !isBrowser) return
        lockBodyScroll()
        return () => unlockBodyScroll()
    }, [mounted, isBrowser])

    if (!isBrowser || !mounted || !item) return null

    const prev = () => setActiveIdx((i) => Math.max(0, i - 1))
    const next = () => setActiveIdx((i) => Math.min(images.length - 1, i + 1))

    return createPortal(
        <div
            className={clsx(s.overlay, className)}
            data-state={anim}
            onClick={onClose}
            role="presentation"
        >
            <div
                className={s.modal}
                role="dialog"
                aria-modal="true"
                aria-label={`Информация о номере: ${item.name}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={s.header}>
                    <div className={s.titleWrap}>
                        <div className={s.title}>{item.name}</div>
                        <div className={s.subtitle}>
                            До {item.capacity} гостей • {priceFmt.format(item.pricePerNight)}/ночь
                        </div>
                    </div>

                    <button type="button" className={clsx('btn', 'btn-ghost', s.close)} onClick={onClose}>
                        Закрыть
                    </button>
                </div>

                <div className={s.content}>
                    <div className={s.gallery}>
                        <div className={s.viewer}>
                            {activeImage ? (
                                <img className={s.image} src={API_BASE + activeImage} alt={`${item.name} фото ${safeActiveIdx + 1}`} />
                            ) : (
                                <div className={s.noImage}>Нет фотографий</div>
                            )}

                            {hasImages && images.length > 1 && (
                                <div className={s.viewerControls}>
                                    <button type="button" className={clsx('btn', 'btn-ghost', s.nav)} onClick={prev} disabled={safeActiveIdx === 0}>
                                        ←
                                    </button>
                                    <div className={s.counter}>
                                        {safeActiveIdx + 1} / {images.length}
                                    </div>
                                    <button
                                        type="button"
                                        className={clsx('btn', 'btn-ghost', s.nav)}
                                        onClick={next}
                                        disabled={safeActiveIdx === images.length - 1}
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </div>

                        {hasImages && images.length > 1 && (
                            <div className={s.thumbs}>
                                {images.map((src, idx) => (
                                    <button
                                        key={src + idx}
                                        type="button"
                                        className={clsx(s.thumbBtn, idx === safeActiveIdx && s.thumbActive)}
                                        onClick={() => setActiveIdx(idx)}
                                        aria-label={`Открыть фото ${idx + 1}`}
                                    >
                                        <img className={s.thumbImg} src={API_BASE + src} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={s.info}>
                        <div className={s.block}>
                            <div className={s.blockTitle}>Описание</div>
                            <div className={s.text}>{item.description || '—'}</div>
                        </div>

                        <div className={s.block}>
                            <div className={s.blockTitle}>Условия</div>
                            <div className={s.meta}>
                                <div className={s.metaRow}>
                                    <span className={s.metaKey}>Вместимость</span>
                                    <span className={s.metaVal}>до {item.capacity}</span>
                                </div>
                                <div className={s.metaRow}>
                                    <span className={s.metaKey}>Цена</span>
                                    <span className={s.metaVal}>{priceFmt.format(item.pricePerNight)} / ночь</span>
                                </div>
                            </div>
                        </div>

                        {showActions && (
                            <div className={s.actions}>
                                <button
                                    type="button"
                                    className={clsx('btn', 'btn-primary')}
                                    onClick={() => item && onBook?.(item)}
                                    disabled={bookingDisabled}
                                >
                                    Забронировать
                                </button>
                                <button type="button" className={clsx('btn')} onClick={onClose}>
                                    Выбрать другой
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default TypeInfo