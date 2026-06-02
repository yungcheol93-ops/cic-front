import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    jsonLd?: object;
}

const SITE_NAME = "CIC Studio";
const BASE_URL = "https://www.cicworks.com";
const DEFAULT_DESCRIPTION =
    "CIC Studio(씨아이씨스튜디오)는 서울 강동구에 위치한 인테리어 디자인 스튜디오입니다. 공간 설계부터 가구 제작까지 총체적인 디자인 솔루션을 제공합니다.";

export default function SEO({ title, description, image, url, type = "website", jsonLd }: SEOProps) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | 씨아이씨스튜디오`;
    const metaDescription = description || DEFAULT_DESCRIPTION;
    const metaUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={metaUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="ko_KR" />
            {image && <meta property="og:image" content={image} />}
            {image && <meta name="twitter:image" content={image} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}
