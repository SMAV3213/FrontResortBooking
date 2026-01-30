import React from 'react'
import clsx from 'clsx'
import s from './Pagination.module.scss'
type Props = {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    className?: string
}

const Pagination: React.FC<Props> = ({ page, pageSize, total, onPageChange, className }) => {
    const pages = Math.max(1, Math.ceil(total / pageSize))
    const prevDisabled = page <= 1
    const nextDisabled = page >= pages

    return (
        <div className={clsx(className)} style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 }}>
            <button className={clsx('btn', 'btn-ghost')} disabled={prevDisabled} onClick={() => onPageChange(page - 1)}>
                Назад
            </button>

            <div className={clsx(s.text)}>
                Страница <b>{page}</b> из <b>{pages}</b> • всего <b>{total}</b>
            </div>

            <button className={clsx('btn', 'btn-ghost')} disabled={nextDisabled} onClick={() => onPageChange(page + 1)}>
                Вперёд
            </button>
        </div>
    )
}

export default Pagination