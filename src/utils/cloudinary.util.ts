export const extractPublicId = (url: string) => {
    const parts = url.split("/");

    const fileName = parts.pop();
    const folder = parts.slice(parts.indexOf("upload") + 2).join("/");

    if (!fileName) return "";

    const name = fileName.split(".")[0];

    return `${folder}/${name}`;
};