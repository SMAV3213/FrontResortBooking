import React from "react";
import { mockRoomTypes } from "../mock/mockRoomTypes";
import TypeList from "../components/TypeList/TypeCardList";
import TypeInfo from "../components/TypeInfo/TypeInfo";
import type { RoomTypeWithoutRoomsDTO } from "../types/roomTypeDTOs";

const Types: React.FC = () => {
    const [selectedId, setSelectedId] = React.useState<string | null>(mockRoomTypes[0]?.id ?? null)
    const [selected, setSelected] = React.useState<RoomTypeWithoutRoomsDTO | null>(null)
    const [open, setOpen] = React.useState(false)

    return(
        <>
            <div className="main">
                <TypeList
                    items={mockRoomTypes}
                    selectedId={selectedId}
                    onSelect={(item) => {
                        setSelectedId(item.id)
                        setSelected(item)
                        setOpen(true)
                    }}
                    columnsMinWidth={320}
                    Name="Номера"
                />
            </div>
            <TypeInfo
                open={open}
                item={selected}
                onClose={() => setOpen(false)}
            />
        </>
    )
}

export default Types;