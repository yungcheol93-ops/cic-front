import {  useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getAuthState } from "../../Login/auth.ts";
import {getPublicProject} from "../../../api/project.api.ts";

export default function PublicProjectDetailPage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;
    if (auth.role !== "admin") return <Navigate to="/MyProject" replace />;

    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<any>(null);

    const [showContract, setShowContract] = useState(false);
    const [showEstimate, setShowEstimate] = useState(false);

    useEffect(() => {
        if (!projectId) return < div>로딩중</div>;
        getPublicProject(Number(projectId))
            .then(res => {
                console.log("api응답", res.data);
                    setProject(res.data);
            });
    }, [projectId]);

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <div className="flex items-start justify-between gap-6 mb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-cic font-light uppercase">프로젝트 상세</h1>
                    {/*<p className="text-xs text-zinc-500">등록일: {(project.createdAt)}</p>*/}
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                        onClick={() => navigate("/Admin/ProjectList")}
                    >
                        목록으로
                    </button>
                </div>
            </div>

            <section className="border border-zinc-200 rounded p-5">
                <h2 className="text-lg mb-4">시공 이미지</h2>

                <div className="grid grid-cols-3 gap-4">
                    {project.images?.map((img: any) => (
                        <img
                            key={img.id}
                            src={img.imageUrl}
                            className="w-full h-[150px] object-cover rounded"
                        />
                    ))}
                </div>
            </section>

            <div className="max-w-3xl space-y-6">
                <section className="border border-zinc-200 rounded p-5">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="text-xs text-zinc-500">프로젝트명</p>
                            <p className="text-lg text-zinc-800">{project.name}</p>
                        </div>

                        <div className="space-y-1 text-sm">
                            <p className="text-xs text-zinc-500">기간</p>
                            <p className="text-zinc-700">
                                {project.startDate} ~ {project.endDate}
                            </p>
                        </div>


                        <div className="flex flex-wrap gap-2 pt-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                                onClick={() => setShowContract(true)}
                            >
                                계약서
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                                onClick={() => setShowEstimate(true)}
                            >
                                견적서 보기
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                                onClick={() => navigate("/Admin/Schedule")}
                            >
                                시공 스케쥴표 보기
                            </button>
                        </div>
                    </div>
                </section>

                <section className="border border-zinc-200 rounded p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-zinc-800">계약서 보기</p>
                            <p className="text-xs text-zinc-500">
                                {project.contract?.name ? `파일: ${project.contract.name}` : "예시 계약서가 표시됩니다."}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                            onClick={() => setShowContract((v) => !v)}
                        >
                            {showContract ? "닫기" : "보기"}
                        </button>
                    </div>

                    {showContract && (
                        <div className="mt-4 border border-zinc-200 rounded p-4 bg-zinc-50 text-sm text-zinc-700 space-y-2">
                            <p className="font-medium">[예시] 인테리어 공사 계약서</p>
                            <p>1) 공사 범위: 주거 인테리어(도장/바닥/가구 일부)</p>
                            <p>2) 공사 기간: 30일</p>
                            <p>3) 대금 조건: 계약금 30% / 중도금 40% / 잔금 30%</p>
                            <p className="text-xs text-zinc-500">실제 파일 뷰어(PDF) 연결은 추후 업로드/서버 연동 시 추가</p>
                        </div>
                    )}
                </section>

                <section className="border border-zinc-200 rounded p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-zinc-800">견적서 보기</p>
                            <p className="text-xs text-zinc-500">
                                {project.estimateDocId ? "견적서가 연결되어 있습니다." : "예시 견적서가 표시됩니다."}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                            onClick={() => setShowEstimate((v) => !v)}
                        >
                            {showEstimate ? "닫기" : "보기"}
                        </button>
                    </div>

                    {showEstimate && (
                        <div className="mt-4 border border-zinc-200 rounded overflow-hidden">
                            <div className="grid grid-cols-12 bg-zinc-50 text-xs text-zinc-600">
                                <div className="col-span-3 px-3 py-2 border-r border-zinc-200">공종</div>
                                <div className="col-span-4 px-3 py-2 border-r border-zinc-200">내용(예시)</div>
                                <div className="col-span-2 px-3 py-2 border-r border-zinc-200 text-right">금액</div>
                                <div className="col-span-3 px-3 py-2 text-right">비고</div>
                            </div>
                            {[
                                { c: "철거", s: "기존 마감 철거", a: 1800000, r: "폐기물 포함" },
                                { c: "목공", s: "가벽/천장 보강", a: 3200000, r: "-" },
                                { c: "도장", s: "내부 전체 도장", a: 1400000, r: "친환경 페인트" },
                            ].map((row, idx) => (
                                <div key={idx} className="grid grid-cols-12 text-sm border-t border-zinc-200">
                                    <div className="col-span-3 px-3 py-2 border-r border-zinc-200 text-zinc-700">{row.c}</div>
                                    <div className="col-span-4 px-3 py-2 border-r border-zinc-200 text-zinc-700">{row.s}</div>
                                    <div className="col-span-2 px-3 py-2 border-r border-zinc-200 text-right text-zinc-700">
                                        {row.a.toLocaleString("ko-KR")}
                                    </div>
                                    <div className="col-span-3 px-3 py-2 text-right text-zinc-500">{row.r}</div>
                                </div>
                            ))}
                            <div className="px-3 py-3 bg-zinc-50 border-t border-zinc-200 text-sm text-zinc-700 text-right">
                                합계: <span className="font-medium">{(1800000 + 3200000 + 1400000).toLocaleString("ko-KR")}</span>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

