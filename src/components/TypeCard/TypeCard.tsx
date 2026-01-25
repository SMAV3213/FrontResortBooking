import React from 'react'
import clsx from 'clsx'
import type { RoomTypeWithoutRoomsDTO } from '../../types/roomTypeDTOs'
import s from './typeCard.module.scss'
import { API_BASE } from '../../api/api'
type Props = {
  item: RoomTypeWithoutRoomsDTO
  selected?: boolean
  onSelect?: (item: RoomTypeWithoutRoomsDTO) => void
  className?: string
}

const priceFmt = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const TypeCard: React.FC<Props> = ({ item, selected, onSelect, className }) => {
  const cover = item.imageUrls?.[0]

  return (
    <button
      type="button"
      className={clsx(s.card, selected && s.selected, className)}
      onClick={() => onSelect?.(item)}
    >
      <div
        className={s.cover}
        style={cover ? { backgroundImage: `url(${API_BASE}${cover})` } : undefined}
        aria-label={item.name}>
      </div>

      <div className={s.body}>
        <div className={s.top}>
          <div className={s.titleWrap}>
            <div className={s.title}>{item.name}</div>
            {item.description ? <div className={s.sub}>{item.description}</div> : null}
          </div>

          <div className={s.price}>
            {priceFmt.format(item.pricePerNight)}
            <span className={s.per}>/ ночь</span>
          </div>
        </div>

        <div className={s.meta}>
          <span>👤 до {item.capacity}</span>
        </div>
      </div>
    </button>
  )
}

export default TypeCard