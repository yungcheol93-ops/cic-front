// src/features/works/components/FurnitureList.tsx

const MOCK_FURNITURES = [
    { id: "1", code:"WS-001", title: "Wall Selves", width: "2350", height:"600" , volume:"300", img: "../src/assets/images/furniture/furniture1.png"},
    { id: "2", code:"TA-001", title: "Dining Table", width: "2750", height:"900" , volume:"740", img: "../src/assets/images/furniture/furniture2.png" },
    { id: "3", code:"CH-001", title: "Dining Chair", width: "500", height:"790(420)" , volume:"300", img: "../src/assets/images/furniture/furniture3.png" },
];

import { useNavigate } from "react-router-dom";

export default function FurnitureList() {
    const navigate = useNavigate();

    return (
        <div className="h-full min-h-screen px-16 py-16">
            {MOCK_FURNITURES.map((f) => (
                <section
                        key={f.id}
                        className="grid grid-cols-2 gap-10 items-start cursor-pointer py-8"
                        onClick={() => navigate(`/Works/Furniture/${f.id}`)}
                    >
                        <img
                            src={f.img}
                            className="w-full h-[320px] object-cover rounded"
                            alt={f.title}
                        />

                        <div className="flex flex-col justify-center space-y-4">
                        <p className="text-md text-bold text-zinc-500">{f.code}.</p>
                        <p className="text-xl text-zinc-500">{f.title}.</p>
                            <div className="flex">
                                <p className="text-xs text-zinc-500">{f.width}*</p>
                                <p className="text-xs text-zinc-500">{f.height}*</p>
                                <p className="text-xs text-zinc-500">{f.volume}</p>
                            </div>

                        </div>

                </section>

            ))}

        </div>


    );
}
