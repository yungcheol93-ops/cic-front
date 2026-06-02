import SEO from "../../components/seo/SEO.tsx";

export default function NewsPage() {
    return (
        <div className="h-full flex flex-col pt-8 md:pt-14 pb-8 w-full max-w-[1200px] mx-auto">
            <SEO
                title="News"
                description="CIC Studio의 최신 뉴스와 소식을 확인하세요."
                url="/news"
            />
            <h1 className="text-center">페이지 준비중</h1>
        </div>
    );
}