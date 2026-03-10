import React from 'react'
import clsx from 'clsx'

import { lockBodyScroll, unlockBodyScroll } from '../utils/bodyScrollLock'
import { roomTypesRequests } from '../api'
import { getApiErrorMessage } from '../api/getApiErrorMessage'
import { GUEST_OPTIONS } from '../shared/countArray'
import type { RoomTypeWithoutRoomsDTO, CreateRoomTypeDTO, UpdateRoomTypeDTO } from '../types/roomTypeDTOs'
import s from '../pages/Admin/admin.module.scss'

type Props = {
    open: boolean
    initial: RoomTypeWithoutRoomsDTO | null
    onClose: () => void
    onSaved: () => Promise<void> | void
}

type LocalPreview = { id: string; url: string; file: File }

const RoomTypeModal: React.FC<Props> = ({ open, initial, onClose, onSaved }) => {
    const [name, setName] = React.useState('')
    const [desc, setDesc] = React.useState('')
    const [capacity, setCapacity] = React.useState<number>(2)
    const [price, setPrice] = React.useState<number>(5000)

    const [images, setImages] = React.useState<File[]>([])
    const [previews, setPreviews] = React.useState<LocalPreview[]>([])

    const [saving, setSaving] = React.useState(false)

    React.useEffect(() => {
        if (!open) return
        lockBodyScroll()
        return () => unlockBodyScroll()
    }, [open])

    React.useEffect(() => {
        if (!open) return
        setName(initial?.name ?? '')
        setDesc(initial?.description ?? '')
        setCapacity(initial?.capacity ?? 2)
        setPrice(initial?.pricePerNight ?? 5000)
        setImages([])
        setPreviews([])
    }, [open, initial])

    React.useEffect(() => {
        // cleanup old urls
        previews.forEach((p) => URL.revokeObjectURL(p.url))

        const next: LocalPreview[] = images.map((file) => ({
            id: `${file.name}_${file.size}_${file.lastModified}`,
            url: URL.createObjectURL(file),
            file,
        }))

        setPreviews(next)

        return () => {
            next.forEach((p) => URL.revokeObjectURL(p.url))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images])

    if (!open) return null

    const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        setImages(files)
        e.target.value = ''
    }

    const removePicked = (id: string) => {
        setImages((prev) => prev.filter((f) => `${f.name}_${f.size}_${f.lastModified}` !== id))
    }

    const save = async () => {
        if (!name.trim()) return alert('Введите название')
        if (capacity < 1) return alert('Вместимость должна быть >= 1')
        if (price < 0) return alert('Цена должна быть >= 0')

        try {
            setSaving(true)

            if (!initial) {
                const dto: CreateRoomTypeDTO = { name: name.trim(), description: desc.trim(), capacity, pricePerNight: price }
                await roomTypesRequests.create(dto, images)
            } else {
                const dto: UpdateRoomTypeDTO = { name: name.trim(), description: desc.trim(), capacity, pricePerNight: price }
                await roomTypesRequests.update(initial.id, dto, images)
            }

            onClose()
            await onSaved()
        } catch (e) {
            alert(getApiErrorMessage(e))
        } finally {
            setSaving(false)
        }
    }

    const safeClose = () => {
        if (saving) return
        onClose()
    }

    return (
        <div className={s.modalOverlay} onClick={safeClose} role="presentation">
            <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className={s.modalHead}>
                    <div className={s.modalTitle}>{initial ? 'Редактировать тип' : 'Новый тип'}</div>
                    <button className={clsx('btn', 'btn-ghost')} onClick={safeClose} disabled={saving}>
                        Закрыть
                    </button>
                </div>

                <div className={s.form}>
                    <label className={s.label}>
                        Название
                        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>

                    <label className={s.label}>
                        Описание
                        <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    </label>

                    <div className={s.row2}>
                        <label className={s.label}>
                            Вместимость
                            <select className="select" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}>
                                {GUEST_OPTIONS.map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </label>

                        <label className={s.label}>
                            Цена за ночь
                            <input className="input" type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                        </label>
                    </div>

                    {initial?.imageUrls?.length ? (
                        <div className={s.previewBlock}>
                            <div className={s.previewTitle}>Текущие фото</div>
                            <div className={s.previewGrid}>
                                {initial.imageUrls.map((u) => (
                                    <a key={u} className={s.previewItem} href={u} target="_blank" rel="noreferrer">
                                        <img className={s.previewImg} src={u} alt="" />
                                    </a>
                                ))}
                            </div>
                            <div className={s.previewNote}>Если загрузить новые фотографии, старые будут заменены.</div>
                        </div>
                    ) : null}

                    <label className={s.label}>
                        Загрузить новые фото (несколько)
                        <input className="input" type="file" accept="image/*" multiple onChange={onPickFiles} />
                    </label>

                    {previews.length > 0 && (
                        <div className={s.previewBlock}>
                            <div className={s.previewTitle}>Выбранные файлы: {previews.length}</div>
                            <div className={s.previewGrid}>
                                {previews.map((p) => (
                                    <div key={p.id} className={s.previewItem}>
                                        <img className={s.previewImg} src={p.url} alt={p.file.name} />
                                        <button type="button" className={clsx('btn', 'btn-ghost', s.previewRemove)} onClick={() => removePicked(p.id)}>
                                            Убрать
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className={s.previewActions}>
                                <button type="button" className={clsx('btn', 'btn-ghost')} onClick={() => setImages([])}>
                                    Очистить выбор
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={s.modalActions}>
                        <button className={clsx('btn', 'btn-primary')} onClick={save} disabled={saving}>
                            {saving ? 'Сохраняем…' : 'Сохранить'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomTypeModal