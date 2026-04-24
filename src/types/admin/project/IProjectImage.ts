
export interface IProjectImage {
    id: number | string;   // DB id or temp id
    file?: File;           // 새 업로드 파일
    preview?: string;      // 로컬 미리보기
    imageUrl?: string;     // 서버 이미지 URL
    order?: number;        // 정렬 순서
}