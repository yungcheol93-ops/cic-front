import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import SortableItem from "./SortableItem.tsx";

type Props<T> = {
    items: T[];
    getId: (item: T) => number;
    onChangeOrder: (items: T[]) => void;
    renderItem: (item: T) => React.ReactNode;
};

export default function SortableList<T>({
                                            items,
                                            getId,
                                            onChangeOrder,
                                            renderItem,
                                        }: Props<T>) {
    const [localItems, setLocalItems] = useState(items);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = localItems.findIndex(
            (i) => getId(i) === active.id
        );
        const newIndex = localItems.findIndex(
            (i) => getId(i) === over.id
        );

        const newItems = arrayMove(localItems, oldIndex, newIndex);

        setLocalItems(newItems);
        onChangeOrder(newItems);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={localItems.map(getId)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-4">
                    {localItems.map((item) => (
                        <SortableItem key={getId(item)} id={getId(item)}>
                            {renderItem(item)}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}