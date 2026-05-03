import { useEffect, useState, useRef } from "react";
import { getAbout, postAdminAbout } from "../../../api/about.api.ts";// 경로 확인 필요
import AlertModal from "../../../components/common/modal/AlertModal.tsx";
import {uploadImages} from "../../../api/cloudinary.about.api.ts";

export default function AdminAboutPage() {
    const [imageUrl, setImageUrl] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false); // 업로드 전용 로딩 상태

    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 파일 입력을 위한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getAbout().then(res => {
            setImageUrl(res.data.imageUrl);
            setContent(res.data.content);
        });
    }, []);

    // 사진 변경 핸들러
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 제공해주신 uploadImages 함수 사용
            const uploadedUrl = await uploadImages(file);
            setImageUrl(uploadedUrl); // 업로드 완료된 URL로 상태 업데이트
        } catch (e) {
            setError("이미지 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (uploading) return; // 업로드 중에는 저장 불가

        setLoading(true);
        try {
            const dto = {
                imageUrl:imageUrl,
                content:content
            };
            await postAdminAbout(dto);
            setStatusMessage("About 페이지가 성공적으로 수정되었습니다.");
        } catch (err) {
            setError("수정 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        /* 전체 화면 고정 (스크롤 방지) */
        <div className="max-w-6xl mx-auto flex flex-col bg-white ">
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex justify-between items-center border-b sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <label className="text-lg font-bold text-zinc-900">대표 이미지</label>
                    </div>

                    <div className="flex items-center gap-4">
                        {uploading && (
                            <span className="text-sm text-amber-600 font-medium animate-pulse">
                                업로드 중...
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className={`px-4 py-2 bg-black text-white font-bold 
                            hover:bg-zinc-800 transition-all ${(loading || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "저장 중..." : "저장하기"}
                        </button>
                    </div>
                </div>

                {/* --- 본문 영역 --- */}
                <div className="flex flex-col py-8 gap-8">

                    {/* 이미지 영역 */}
                    <section>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative w-full h-[300px] bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-zinc-100 transition-all shadow-sm"
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="About" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-zinc-400 text-sm font-medium">이미지를 선택하세요</span>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 컨텐츠 영역: 바닥에 붙지 않도록 높이 조절 및 여백 부여 */}
                    <section className="flex flex-col">
                        <label className="block text-sm font-bold text-zinc-900 mb-3">소개 문구</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요..."
                            className="w-full h-[200px] p-8 text-right
                            bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-1
                              text-zinc-700 text-base resize-none shadow-sm"
                        />
                    </section>
                </div>
            </form>

            <AlertModal open={!!statusMessage} message={statusMessage || ""} onClose={() => setStatusMessage(null)} />
            <AlertModal open={!!error} message={error || ""} onClose={() => setError(null)} />
        </div>
    );
}