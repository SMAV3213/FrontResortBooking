import React from 'react'
import clsx from 'clsx'
import TypeCard from '../TypeCard/TypeCard'
import type { RoomTypeWithoutRoomsDTO } from '../../types/roomTypeDTOs'
import s from './TypeCardList.module.scss'

type Props = {
    items: RoomTypeWithoutRoomsDTO[]
    selectedId?: string | null
    onSelect?: (item: RoomTypeWithoutRoomsDTO) => void
    className?: string
    columnsMinWidth?: number
    emptyText?: string
    Name?: string
}

const TypeList: React.FC<Props> = ({
    items,
    selectedId,
    onSelect,
    className,
    columnsMinWidth,
    emptyText = 'Типы номеров не найдены',
    Name,
}) => {
    if (!items?.length) {
        return <div className={clsx(s.empty, className)}>{emptyText}</div>
    }

    return (
        <section className={clsx(s['br-list'])}>
            <div className={clsx(s['br-list-overlay'])}>
                <div className={clsx(s['div-name'])}>
                    <span className={clsx(s['name-text'])}>{Name}</span>
                </div>
                <div
                    className={clsx(s['grid'], clsx(['br-container']))}
                    style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${columnsMinWidth}px, 1fr))` }}
                    role="list"
                >
                    {items.map((item) => (
                        <div key={item.id} role="listitem" className={s.cell}>
                            <TypeCard
                                item={item}
                                selected={Boolean(selectedId && item.id === selectedId)}
                                onSelect={onSelect}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section >
    )
}

export default TypeList