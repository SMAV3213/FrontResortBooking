import React from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import type { RoomTypeWithoutRoomsDTO } from '../../types/roomTypeDTOs'
import s from './TypeInfo.module.scss'
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
const SWIPE_THRESHOLD = 50 // минимум пикселей для свайпа
const BOUNCE_MS = 300      // время возврата при попытке свайпнуть за край

const TypeInfo: React.FC<Props> = ({ open, item, onClose, className, showActions, bookingDisabled, onBook }) => {
    const isBrowser = typeof document !== 'undefined'

    const [activeIdx, setActiveIdx] = React.useState(0)
    const [mounted, setMounted] = React.useState(open)
    const [anim, setAnim] = React.useState<AnimState>(open ? 'open' : 'closed')

    // Свайп состояние
    const [dragOffset, setDragOffset] = React.useState(0)
    const [isDragging, setIsDragging] = React.useState(false)
    const [isBouncing, setIsBouncing] = React.useState(false)
    const touchRef = React.useRef<{ startX: number; startY: number; locked: boolean | null }>({
        startX: 0,
        startY: 0,
        locked: null,
    })
    const viewerRef = React.useRef<HTMLDivElement>(null)

    const images = item?.imageUrls ?? []
    const hasImages = images.length > 0
    const safeActiveIdx = Math.min(activeIdx, Math.max(0, images.length - 1))
    const activeImage = hasImages ? images[safeActiveIdx] : null

    // Анимация открытия/закрытия
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
        if (open) {
            setActiveIdx(0)
            setDragOffset(0)
        }
    }, [open, item?.id])

    // Клавиатура
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

    // Блокировка скролла
    React.useEffect(() => {
        if (!mounted || !isBrowser) return
        lockBodyScroll()
        return () => unlockBodyScroll()
    }, [mounted, isBrowser])


    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        if (images.length <= 1) return
        const touch = e.touches[0]
        touchRef.current = {
            startX: touch.clientX,
            startY: touch.clientY,
            locked: null, // ещё не определили направление
        }
        setIsDragging(true)
        setIsBouncing(false)
    }, [images.length])

    const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
        if (!isDragging || images.length <= 1) return

        const touch = e.touches[0]
        const dx = touch.clientX - touchRef.current.startX
        const dy = touch.clientY - touchRef.current.startY

        // Определяем направление при первом движении
        if (touchRef.current.locked === null) {
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                touchRef.current.locked = Math.abs(dx) > Math.abs(dy) // true = горизонтальный
            }
            return
        }

        // Если скролл вертикальный — не мешаем
        if (!touchRef.current.locked) return

        e.preventDefault()

        // Сопротивление на краях (резинка)
        const atStart = safeActiveIdx === 0 && dx > 0
        const atEnd = safeActiveIdx === images.length - 1 && dx < 0

        if (atStart || atEnd) {
            setDragOffset(dx * 0.3) // замедляем на краях
        } else {
            setDragOffset(dx)
        }
    }, [isDragging, images.length, safeActiveIdx])

    const handleTouchEnd = React.useCallback(() => {
        if (!isDragging) return
        setIsDragging(false)

        const dx = dragOffset

        if (Math.abs(dx) > SWIPE_THRESHOLD) {
            if (dx < 0 && safeActiveIdx < images.length - 1) {
                // Свайп влево → следующее фото
                setActiveIdx(safeActiveIdx + 1)
            } else if (dx > 0 && safeActiveIdx > 0) {
                // Свайп вправо → предыдущее фото
                setActiveIdx(safeActiveIdx - 1)
            }
        }

        // Анимация возврата
        setIsBouncing(true)
        setDragOffset(0)

        setTimeout(() => setIsBouncing(false), BOUNCE_MS)
    }, [isDragging, dragOffset, safeActiveIdx, images.length])


    const prev = () => setActiveIdx((i) => Math.max(0, i - 1))
    const next = () => setActiveIdx((i) => Math.min(images.length - 1, i + 1))

    if (!isBrowser || !mounted || !item) return null

    // Стиль для анимации свайпа
    const carouselStyle: React.CSSProperties = {
        display: 'flex',
        width: `${images.length * 100}%`,
        transform: `translateX(calc(-${safeActiveIdx * (100 / images.length)}% + ${dragOffset}px))`,
        transition: isDragging ? 'none' : isBouncing ? `transform ${BOUNCE_MS}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
    }

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
                        <div
                            className={s.viewer}
                            ref={viewerRef}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {hasImages ? (
                                <div style={carouselStyle}>
                                    {images.map((src, idx) => (
                                        <img
                                            key={src + idx}
                                            className={s.image}
                                            src={src}
                                            alt={`${item.name} фото ${idx + 1}`}
                                            draggable={false}
                                            style={{
                                                width: `${100 / images.length}%`,
                                                flexShrink: 0,
                                            }}
                                        />
                                    ))}
                                </div>
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

                        {/* Точки-индикаторы под фото */}
                        {hasImages && images.length > 1 && (
                            <>
                                <div className={s.dots}>
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={clsx(s.dot, idx === safeActiveIdx && s.dotActive)}
                                            onClick={() => setActiveIdx(idx)}
                                            aria-label={`Фото ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <div className={s.thumbs}>
                                    {images.map((src, idx) => (
                                        <button
                                            key={src + idx}
                                            type="button"
                                            className={clsx(s.thumbBtn, idx === safeActiveIdx && s.thumbActive)}
                                            onClick={() => setActiveIdx(idx)}
                                            aria-label={`Открыть фото ${idx + 1}`}
                                        >
                                            <img className={s.thumbImg} src={src} alt="" draggable={false} />
                                        </button>
                                    ))}
                                </div>
                            </>
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