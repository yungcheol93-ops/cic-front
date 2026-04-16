export type InteriorProject = {
    id: string;
    code: string;
    title: string;
    location: string;
    year: string;
    img: string;
};

export const INTERIOR_PROJECTS: InteriorProject[] = [
    {
        id: "1",
        code: "sp-001",
        title: "잠실 롯데캐슬골드 72평형",
        location: "Korea, Seoul",
        year: "2024",
        img: "../src/assets/images/interior/interior1.png",
    },
    {
        id: "2",
        code: "sp-002",
        title: "장면을 담은 집",
        location: "Korea, Seoul",
        year: "2023",
        img: "../src/assets/images/interior/interior2.png",
    },
    {
        id: "3",
        code: "sp-003",
        title: "마당이 있는 집",
        location: "Korea, Seoul",
        year: "2024",
        img: "../src/assets/images/interior/interior1.png",
    },
];

