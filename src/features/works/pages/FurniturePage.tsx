import { useParams } from "react-router-dom";
import FurnitureList from "../components/FurnitureList";
import FurnitureDetail from "../components/FurnitureDetail";

export default function FurniturePage() {
    const { furnitureId } = useParams<{ furnitureId?: string }>();

    // 1) /Works/Furniture → 리스트
    if (!furnitureId) {
        return <FurnitureList />;
    }

    // 2) /Works/Furniture/:Furnitureid → 디테일
    return <FurnitureDetail id={furnitureId} />;
}