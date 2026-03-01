import React from 'react'
import clsx from 'clsx'
import s from './EntitySearchSelect.module.scss'

export type SearchOption<T = unknown> = {
    value: string
    label: string
    raw: T
}

type Props<T> = {
    value: SearchOption<T> | null
    onChange: (v: SearchOption<T> | null) => void
    placeholder?: string
    disabled?: boolean
    loadOptions: (query: string) => Promise<SearchOption<T>[]>
    className?: string
}

const EntitySearchSelect = <T,>({
    value,
    onChange,
    placeholder = 'Поиск…',
    disabled,
    loadOptions,
    className,
}: Props<T>) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null)

    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [options, setOptions] = React.useState<SearchOption<T>[]>([])
    const [active, setActive] = React.useState(0)

    React.useEffect(() => {
        if (!open) return
        const onDown = (e: MouseEvent) => {
            if (!rootRef.current) return
            if (!rootRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [open])

    React.useEffect(() => {
        if (!open) return
        let alive = true
        const t = window.setTimeout(async () => {
            try {
                setLoading(true)
                const data = await loadOptions(query.trim())
                if (!alive) return
                setOptions(data)
                setActive(0)
            } finally {
                if (alive) setLoading(false)
            }
        }, 250)

        return () => {
            alive = false
            window.clearTimeout(t)
        }
    }, [open, query, loadOptions])

    const displayValue = open ? query : (value?.label ?? '')

    const selectOption = (opt: SearchOption<T>) => {
        onChange(opt)
        setOpen(false)
        setQuery('')
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
            setOpen(true)
            return
        }
        if (!open) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((i) => Math.min(options.length - 1, i + 1))
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((i) => Math.max(0, i - 1))
        }
        if (e.key === 'Enter') {
            e.preventDefault()
            const opt = options[active]
            if (opt) selectOption(opt)
        }
        if (e.key === 'Escape') {
            setOpen(false)
        }
    }

    return (
        <div ref={rootRef} className={clsx(s.root, className)}>
            <div className={s.inputWrap}>
                <input
                    className={clsx('input', s.input)}
                    value={displayValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    onFocus={() => {
                        setOpen(true)
                        setQuery('')
                    }}
                    onChange={(e) => {
                        setOpen(true)
                        setQuery(e.target.value)
                    }}
                    onKeyDown={onKeyDown}
                />

                {value && !open && (
                    <button type="button" className={clsx('btn', 'btn-ghost', s.clear)} onClick={() => onChange(null)}>
                        ×
                    </button>
                )}
            </div>

            {open && (
                <div className={s.menu} role="listbox">
                    {loading ? (
                        <div className={s.meta}>Загрузка…</div>
                    ) : options.length === 0 ? (
                        <div className={s.meta}>Ничего не найдено</div>
                    ) : (
                        options.map((opt, idx) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={clsx(s.option, idx === active && s.optionActive)}
                                onMouseEnter={() => setActive(idx)}
                                onClick={() => selectOption(opt)}
                            >
                                {opt.label}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default EntitySearchSelect