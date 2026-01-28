import React from 'react'
import TypeList from '../components/TypeList/TypeCardList'
import TypeInfo from '../components/TypeInfo/TypeInfo'
import Pagination from '../components/Pagination/Pagination'

import { roomTypesRequests } from '../api'
import { getApiErrorMessage } from '../api/getApiErrorMessage'
import type { RoomTypeWithoutRoomsDTO } from '../types/roomTypeDTOs'

const Types: React.FC = () => {
    const [items, setItems] = React.useState<RoomTypeWithoutRoomsDTO[]>([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const [page, setPage] = React.useState(1)
    const pageSize = 12
    const [total, setTotal] = React.useState(0)

    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)
    const [open, setOpen] = React.useState(false)

    const load = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await roomTypesRequests.getAll({ page, pageSize, sortBy: 'name', sortDir: 'asc' })
            setItems(res.items)
            setTotal(res.total)

            setSelectedId(res.items[0]?.id ?? null)
            setSelected(res.items[0] ?? null)
        } catch (e) {
            setItems([])
            setTotal(0)
            setSelectedId(null)
            setSelected(null)
            setError(getApiErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }, [page])

    React.useEffect(() => {
        load()
    }, [load])

    return (
        <>
            <div className="main">
                {error && <div className="br-container" style={{ marginTop: 12 }}>{error}</div>}
                {loading ? (
                    <div className="br-container" style={{ marginTop: 12, color: 'rgba(234,240,255,0.72)' }}>Загрузка…</div>
                ) : (
                    <>
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

                        <div className="br-container">
                            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
                        </div>
                    </>
                )}
            </div>

            <TypeInfo open={open} item={selected} onClose={() => setOpen(false)} showActions={false} />
        </>
    )
}

export default Types