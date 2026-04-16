// src/features/works/components/FurnitureDetail.tsx
type Props = {
    id: string;
};


export default function FurnitureDetail({ id }: Props) {
    // TODO: 나중에는 여기서 id로 백엔드 호출해서 상세 데이터 가져오기
    // 예: useQuery(["furniture", id], ...)

    return (
        <div className="h-full min-h-screen px-16 py-16">
            {/* 여기부터 상세 정보 섹션 */}
            <div className="grid grid gap-10">
                <img src="../../src/assets/images/furniture/furniture1.png"
                     className="w-full h-full object-cover"
                />
                <div className="space-y-2 text-sm text-zinc-200">
                    <p className="text-lg text-bold text-zinc-500">ws-001.</p>
                    <p className="text-xl text-zinc-500">Wall Selves.</p>
                    <p className="text-md text-zinc-500">2350*600*300</p>
                </div>
            </div>
        </div>
    );
}
