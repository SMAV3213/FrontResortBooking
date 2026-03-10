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
const SLIDE_MS = 360       // длительность перехода между слайдами
const SWIPE_THRESHOLD = 50
const BOUNCE_MS = 300

const TypeInfo: React.FC<Props> = ({
    open,
    item,
    onClose,
    className,
    showActions,
    bookingDisabled,
    onBook,
}) => {
    const isBrowser = typeof document !== 'undefined'

    const [mounted, setMounted] = React.useState(open)
    const [anim, setAnim] = React.useState<AnimState>(open ? 'open' : 'closed')

    const [slideIdx, setSlideIdx] = React.useState(0)
    const [skipTransition, setSkipTransition] = React.useState(false)

    const [dragOffset, setDragOffset] = React.useState(0)
    const [isDragging, setIsDragging] = React.useState(false)
    const [isBouncing, setIsBouncing] = React.useState(false)
    const touchRef = React.useRef<{
        startX: number
        startY: number
        locked: boolean | null
    }>({ startX: 0, startY: 0, locked: null })
    const viewerRef = React.useRef<HTMLDivElement>(null)

    const images = item?.imageUrls ?? []
    const hasImages = images.length > 0
    const canLoop = images.length > 1

    const extImages = React.useMemo(() => {
        if (!canLoop) return images
        return [images[images.length - 1], ...images, images[0]]
    }, [images, canLoop])

    const visualIdx = canLoop
        ? ((slideIdx - 1 + images.length) % images.length)
        : slideIdx


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
            setSlideIdx(canLoop ? 1 : 0)
            setDragOffset(0)
            setSkipTransition(true)
        }
    }, [open, item?.id, canLoop])

    React.useEffect(() => {
        if (!skipTransition) return
        let raf1: number | undefined
        let raf2: number | undefined
        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => setSkipTransition(false))
        })
        return () => {
            if (raf1) cancelAnimationFrame(raf1)
            if (raf2) cancelAnimationFrame(raf2)
        }
    }, [skipTransition])

    React.useEffect(() => {
        if (!open) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (images.length <= 1) return
            if (e.key === 'ArrowLeft')
                setSlideIdx((i) => Math.max(0, i - 1))
            if (e.key === 'ArrowRight')
                setSlideIdx((i) => Math.min(extImages.length - 1, i + 1))
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open, onClose, images.length, extImages.length])

    React.useEffect(() => {
        if (!mounted || !isBrowser) return
        lockBodyScroll()
        return () => unlockBodyScroll()
    }, [mounted, isBrowser])


    const handleTransitionEnd = React.useCallback(
        (e: React.TransitionEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
            if (!canLoop) return

            if (slideIdx === 0) {
                // клон последнего → настоящий последний
                setSkipTransition(true)
                setSlideIdx(images.length)
            } else if (slideIdx === extImages.length - 1) {
                // клон первого → настоящий первый
                setSkipTransition(true)
                setSlideIdx(1)
            }
        },
        [slideIdx, canLoop, images.length, extImages.length],
    )

    const handleTouchStart = React.useCallback(
        (e: React.TouchEvent) => {
            if (images.length <= 1) return
            const t = e.touches[0]
            touchRef.current = { startX: t.clientX, startY: t.clientY, locked: null }
            setIsDragging(true)
            setIsBouncing(false)
        },
        [images.length],
    )

    const handleTouchMove = React.useCallback(
        (e: React.TouchEvent) => {
            if (!isDragging || images.length <= 1) return

            const t = e.touches[0]
            const dx = t.clientX - touchRef.current.startX
            const dy = t.clientY - touchRef.current.startY

            if (touchRef.current.locked === null) {
                if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                    touchRef.current.locked = Math.abs(dx) > Math.abs(dy)
                }
                return
            }
            if (!touchRef.current.locked) return

            e.preventDefault()
            setDragOffset(dx) 
        },
        [isDragging, images.length],
    )

    const handleTouchEnd = React.useCallback(() => {
        if (!isDragging) return
        setIsDragging(false)

        if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
            if (dragOffset < 0)
                setSlideIdx((i) => Math.min(extImages.length - 1, i + 1))
            else
                setSlideIdx((i) => Math.max(0, i - 1))
        }

        setIsBouncing(true)
        setDragOffset(0)
        setTimeout(() => setIsBouncing(false), BOUNCE_MS)
    }, [isDragging, dragOffset, extImages.length])

    const prev = () => setSlideIdx((i) => Math.max(0, i - 1))
    const next = () => setSlideIdx((i) => Math.min(extImages.length - 1, i + 1))
    const goToSlide = (idx: number) => setSlideIdx(canLoop ? idx + 1 : idx)

    if (!isBrowser || !mounted || !item) return null

    const carouselStyle: React.CSSProperties = {
        display: 'flex',
        width: `${extImages.length * 100}%`,
        transform: `translateX(calc(-${slideIdx * (100 / extImages.length)}% + ${dragOffset}px))`,
        transition:
            skipTransition || isDragging
                ? 'none'
                : isBouncing
                    ? `transform ${BOUNCE_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
                    : `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
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
                            До {item.capacity} гостей •{' '}
                            {priceFmt.format(item.pricePerNight)}/ночь
                        </div>
                    </div>
                    <button
                        type="button"
                        className={clsx('btn', 'btn-ghost', s.close)}
                        onClick={onClose}
                    >
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
                                <div
                                    style={carouselStyle}
                                    onTransitionEnd={handleTransitionEnd}
                                >
                                    {extImages.map((src, idx) => (
                                        <img
                                            key={`slide-${idx}`}
                                            className={s.image}
                                            src={src}
                                            alt={`${item.name} фото`}
                                            draggable={false}
                                            style={{
                                                width: `${100 / extImages.length}%`,
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
                                    <button
                                        type="button"
                                        className={clsx('btn', 'btn-ghost', s.nav)}
                                        onClick={prev}
                                    >
                                        ←
                                    </button>
                                    <div className={s.counter}>
                                        {visualIdx + 1} / {images.length}
                                    </div>
                                    <button
                                        type="button"
                                        className={clsx('btn', 'btn-ghost', s.nav)}
                                        onClick={next}
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </div>

                        {hasImages && images.length > 1 && (
                            <>
                                <div className={s.dots}>
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={clsx(
                                                s.dot,
                                                idx === visualIdx && s.dotActive,
                                            )}
                                            onClick={() => goToSlide(idx)}
                                            aria-label={`Фото ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <div className={s.thumbs}>
                                    {images.map((src, idx) => (
                                        <button
                                            key={src + idx}
                                            type="button"
                                            className={clsx(
                                                s.thumbBtn,
                                                idx === visualIdx && s.thumbActive,
                                            )}
                                            onClick={() => goToSlide(idx)}
                                            aria-label={`Открыть фото ${idx + 1}`}
                                        >
                                            <img
                                                className={s.thumbImg}
                                                src={src}
                                                alt=""
                                                draggable={false}
                                            />
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
                                    <span className={s.metaVal}>
                                        до {item.capacity}
                                    </span>
                                </div>
                                <div className={s.metaRow}>
                                    <span className={s.metaKey}>Цена</span>
                                    <span className={s.metaVal}>
                                        {priceFmt.format(item.pricePerNight)} / ночь
                                    </span>
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
                                <button
                                    type="button"
                                    className={clsx('btn')}
                                    onClick={onClose}
                                >
                                    Выбрать другой
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    )
}

export default TypeInfo