export function uniq(array: any[]): any[]

export function toCamelCase(text: string): string

export function $(selectors: string): HTMLElement

export function $(
  element: HTMLElement | Document | string,
  selectors: string
): HTMLElement

export function querySelector(selectors: string): HTMLElement

export function querySelector(
  element: HTMLElement | Document | string,
  selectors: string
): HTMLElement

export function $$(selectors: string): HTMLElement[]

export function $$(
  element: HTMLElement | Document | string,
  selectors: string
): HTMLElement[]

export function querySelectorAll(selectors: string): HTMLElement[]

export function querySelectorAll(
  element: HTMLElement | Document | string,
  selectors: string
): HTMLElement[]

export function createElement(
  tagName: string,
  attributes?: Record<string, unknown>
): HTMLElement

export function addElement(
  tagName: string,
  attributes?: Record<string, unknown>
): HTMLElement

export function addElement(
  parentNode: HTMLElement,
  tagName: string,
  attributes?: Record<string, unknown>
): HTMLElement

export function addStyle(styleText: string): HTMLElement

export function addEventListener(
  element: HTMLElement | Document | EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): () => void

export function addEventListener(
  element: HTMLElement | Document | EventTarget,
  type: string | Record<string, unknown>
): () => void

export function getAttribute(element: HTMLElement, name: string): string

export function setAttribute(
  element: HTMLElement,
  name: string,
  value: string
): void

export type SetStyle = (
  element: HTMLElement,
  style: string | Record<string, unknown>,
  overwrite?: boolean
) => void

export function setStyle(
  element: HTMLElement,
  style: string | Record<string, unknown>,
  overwrite?: boolean
): void

export function toStyleMap(styleText: string): Record<string, string>

export function noStyleSpace(text: string): string

export function createSetStyle(styleText: string): SetStyle

export function isUrl(text: string): boolean
