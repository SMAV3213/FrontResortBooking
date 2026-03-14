import React from 'react'
import TypeList from '../components/TypeList/TypeCardList'
import TypeInfo from '../components/TypeInfo/TypeInfo'
import Pagination from '../components/Pagination/Pagination'

import { useRoomTypesList } from '../api/queries'
import { getApiErrorMessage } from '../api/getApiErrorMessage'
import type { RoomTypeWithoutRoomsDTO } from '../types/roomTypeDTOs'

const pageSize = 12

const Types: React.FC = () => {
    const [page, setPage] = React.useState(1)
    const { data, isLoading, isFetching, error, isPlaceholderData } = useRoomTypesList({
        page,
        pageSize,
        sortBy: 'name',
        sortDir: 'asc',
    })

    const items = data?.items ?? []
    const total = data?.total ?? 0

    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        setSelectedId(items[0]?.id ?? null)
        setSelected(items[0] ?? null)
    }, [items])

    const errorMsg = error ? getApiErrorMessage(error) : null

    return (
        <>
            <div className="main">
                {errorMsg && <div className="br-container" style={{ marginTop: 12 }}>{errorMsg}</div>}
                {isLoading && !data ? (
                    <div className="br-container" style={{ marginTop: 12, color: 'rgba(234,240,255,0.72)' }}>Загрузка…</div>
                ) : (
                    <>
                        {(isFetching && isPlaceholderData) && (
                            <div className="br-container" style={{ marginTop: 8, fontSize: 12, color: 'rgba(234,240,255,0.6)' }}>
                                Обновление…
                            </div>
                        )}
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