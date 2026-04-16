// src/features/works/pages/InteriorPage.tsx
import { useParams } from "react-router-dom";
import InteriorList from "../components/InteriorList";
import InteriorDetail from "../components/InteriorDetail";

export default function InteriorPage() {
    const { interiorId } = useParams<{ interiorId?: string }>();

    if (!interiorId) {
        return <InteriorList />;
    }

    return <InteriorDetail id={interiorId} />;
}
