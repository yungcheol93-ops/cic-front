import { useEffect, useState } from "react";
import { getAbout } from "../../api/about.api.ts";

export default function AboutPage() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAbout()
            .then(res => {
                setData(res.data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex flex-col pt-8 md:pt-14 pb-8 w-full max-w-[1200px] mx-auto animate-pulse">
                <div className="flex-1 w-full min-h-[50vh] bg-zinc-200 rounded-md" />
                <div className="mt-6 space-y-2 flex flex-col items-end">
                    <div className="w-48 h-4 bg-zinc-200 rounded" />
                    <div className="w-64 h-4 bg-zinc-200 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pb-8 w-full max-w-[1200px] mx-auto">
            {/* 이미지 영역 */}
            <section className="flex relative flex-1 w-full max-h-[65vh] items-center justify-center bg-zinc-50 overflow-hidden group rounded-md">
                {data?.imageUrl ? (
                    <img
                        src={data.imageUrl}
                        className="w-full h-full object-contain transition-all duration-500"
                        alt="About"
                    />
                ) : (

                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                        No Image Available
                    </div>
                )}
            </section>

            {/* 브랜드 소개 */}
            <section className="absolute bottom-0 mt-6 mb-10 text-right px-2 md:px-0 w-full">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                    {data?.content }
                </p>
            </section>
        </div>
    );
}