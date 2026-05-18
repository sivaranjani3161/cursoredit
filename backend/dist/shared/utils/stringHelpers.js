"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStr = toStr;
exports.normalizeEmail = normalizeEmail;
exports.normalizeTagName = normalizeTagName;
exports.parseIntId = parseIntId;
exports.toNullableStr = toNullableStr;
exports.toNullableInt = toNullableInt;
/**
 * Trims and returns a string, or a fallback (default "").
 */
function toStr(value, fallback = "") {
    return String(value ?? fallback).trim();
}
/**
 * Normalises an email address: trims and lowercases.
 */
function normalizeEmail(value) {
    return String(value ?? "").trim().toLowerCase();
}
/**
 * Normalises a tag name: trim, lowercase, collapse inner spaces.
 */
function normalizeTagName(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}
/**
 * Parses a numeric id from a string route param.
 * Returns NaN if the string is not a valid integer.
 */
function parseIntId(value) {
    return Number(value);
}
/**
 * Returns an optional string column value: trims if truthy, null otherwise.
 */
function toNullableStr(value) {
    const trimmed = String(value ?? "").trim();
    return trimmed.length > 0 ? trimmed : null;
}
function toNullableInt(value) {
    if (value === undefined || value === null || value === "" || value === false)
        return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
}
