"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapNestedItems = mapNestedItems;
exports.mapImageItems = mapImageItems;
function mapNestedItems(arr) {
    if (!Array.isArray(arr))
        return [];
    return arr
        .map((item) => {
        const i = item;
        return {
            title: String(i?.title ?? "").trim(),
            description: Array.isArray(i?.description)
                ? i.description
                    .map((p) => String(p ?? "").trim())
                    .filter(Boolean)
                : [],
            icon: i?.icon ? String(i.icon) : null,
            phaseNumber: i?.phaseNumber !== undefined && i?.phaseNumber !== null
                ? Number(i.phaseNumber)
                : undefined,
            sortOrder: i?.sortOrder !== undefined && i?.sortOrder !== null
                ? Number(i.sortOrder)
                : 0,
        };
    })
        .filter((item) => item.title.length > 0);
}
function mapImageItems(arr) {
    if (!Array.isArray(arr))
        return [];
    return arr
        .map((item) => {
        const i = item;
        return {
            id: i?.id ? Number(i.id) : undefined,
            imageUrl: String(i?.imageUrl ?? "").trim(),
            altText: i?.altText ? String(i.altText) : null,
        };
    })
        .filter((item) => item.imageUrl.length > 0);
}
