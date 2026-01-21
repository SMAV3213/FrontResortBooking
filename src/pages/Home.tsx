import React from "react";
import Hero from "../components/Hero/Hero";
import { mockRoomTypes } from "../mock/mockRoomTypes";
import TypeList from "../components/TypeList/TypeCardList";

export default function Home() {
    const [selectedId, setSelectedId] = React.useState<string | null>(mockRoomTypes[0]?.id ?? null)
    return (
        <div className="main">
            <Hero />
            <TypeList
                items={mockRoomTypes}
                selectedId={selectedId}
                onSelect={(item) => setSelectedId(item.id)}
                columnsMinWidth={320}
            />
        </div>
    )
}