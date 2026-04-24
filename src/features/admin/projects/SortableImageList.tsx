import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function Item({ img, index, currentIndex, setCurrentIndex }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: img.id });

    return (
        <img
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            src={img.imageUrl || img.preview}
            onClick={() => setCurrentIndex(index)}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={`h-[100px] w-full object-cover ${
                currentIndex === index ? "border-2 border-black" : ""
            }`}
        />
    );
}

export default function SortableImageList({
                                              images,
                                              setImages,
                                              currentIndex,
                                              setCurrentIndex,
                                          }: any) {
    const handleDragEnd = (e: any) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;

        const oldIndex = images.findIndex((i: any) => i.id === active.id);
        const newIndex = images.findIndex((i: any) => i.id === over.id);

        setImages(arrayMove(images, oldIndex, newIndex));
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((i: any) => i.id)}>
                <div className="grid grid-cols-3 gap-4">
                    {images.map((img: any, index: number) => (
                        <Item
                            key={img.id}
                            img={img}
                            index={index}
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}