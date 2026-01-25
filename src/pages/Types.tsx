import React from 'react'
import TypeList from '../components/TypeList/TypeCardList'
import TypeInfo from '../components/TypeInfo/TypeInfo'

import type { RoomTypeWithoutRoomsDTO } from '../types/roomTypeDTOs'
import { roomTypesRequests } from '../api'
import { getApiErrorMessage } from '../api/getApiErrorMessage'

const Types: React.FC = () => {
    const [items, setItems] = React.useState<RoomTypeWithoutRoomsDTO[]>([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        let alive = true

        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await roomTypesRequests.getAll()
                if (!alive) return

                setItems(data)
                setSelectedId(data[0]?.id ?? null)
                setSelected(data[0] ?? null)
            } catch (e) {
                if (!alive) return
                setItems([])
                setSelectedId(null)
                setSelected(null)
                setError(getApiErrorMessage(e))
            } finally {
                if (alive) setLoading(false)
            }
        }

        load()
        return () => {
            alive = false
        }
    }, [])

    return (
        <>
            <div className="main">
                {error && (
                    <div className="br-container" style={{ marginTop: 12 }}>
                        <div
                            style={{
                                padding: 12,
                                borderRadius: 12,
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'rgba(255,255,255,0.04)',
                                whiteSpace: 'pre-line',
                            }}
                        >
                            {error}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="br-container" style={{ marginTop: 12, color: 'rgba(234,240,255,0.72)' }}>
                        Загружаем типы номеров…
                    </div>
                ) : (
                    <TypeList
                        items={items}
                        selectedId={selectedId}
                        onSelect={(item) => {
                            setSelectedId(item.id)
                            setSelected(item)
                            setOpen(true)
                        }}
                        columnsMinWidth={320}
                        Name="Номера"
                    />
                )}
            </div>

            <TypeInfo open={open} item={selected} onClose={() => setOpen(false)} />
        </>
    )
}

export default Types