export function uniq(array: any[]): any[]
export function toCamelCase(text: string): string
export function querySelector(element, selectors?: string): HTMLElement
export function querySelectorAll(element, selectors?: string): any[]
export function $(element, selectors?: string): HTMLElement
export function $$(element, selectors?: string): any[]
export function createElement(type: string): HTMLElement
export function addEventListener(element, type, listener): void
export function setAttribute(element, attr, value): void
export function setStyle(element, style): void
export function toStyleMap(styleText: string): Record<string, unknown>
export function noStyleSpace(text: string): string
export function createSetStyle(styleText: string): setStyle
export function isUrl(text: string): boolean
