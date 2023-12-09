export function stripHtml(html: string) {
    if (typeof html !== "string") {
        throw new TypeError("Expected a string");
    }
    return html.replace(/(<([^>]+)>)/gi, "");
}