export const doc: Document

export const win: Window

export function uniq(array: any[]): any[]

export function toCamelCase(text: string): string

export function $(
  selectors: string,
  element?: HTMLElement | Document
): HTMLElement | undefined

export function querySelector(
  selectors: string,
  element?: HTMLElement | Document
): HTMLElement | undefined

export function $$(
  selectors: string,
  element?: HTMLElement | Document
): HTMLElement[]

export function querySelectorAll(
  selectors: string,
  element?: HTMLElement | Document
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
  tagName: string | HTMLElement,
  attributes?: Record<string, unknown>
): HTMLElement

export function addStyle(styleText: string): HTMLElement

export function addEventListener(
  element: HTMLElement | Document | EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void

export function addEventListener(
  element: HTMLElement | Document | EventTarget,
  type: string | Record<string, unknown>
): void

export function removeEventListener(
  element: HTMLElement | Document | EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void

export function removeEventListener(
  element: HTMLElement | Document | EventTarget,
  type: string | Record<string, unknown>
): void

export function getAttribute(element: HTMLElement, name: string): string

export function setAttribute(
  element: HTMLElement,
  name: string,
  value: string
): void

export function setAttributes(
  element: HTMLElement,
  attributes: Record<string, unknown>
): void

export function addAttribute(
  element: HTMLElement,
  name: string,
  value: string
): void

export function addClass(element: HTMLElement, className: string): void

export function removeClass(element: HTMLElement, className: string): void

export function hasClass(element: HTMLElement, className: string): boolean

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

// eslint-disable-next-line @typescript-eslint/ban-types
export function throttle(func: Function, interval: number): Function

export type MenuCallback = (event?: MouseEvent | KeyboardEvent) => void
export function registerMenuCommand(
  name: string,
  callback: MenuCallback,
  accessKey?: string
): void

export function extendHistoryApi(): void

export const actionHref: string

export function getOffsetPosition(
  element: HTMLElement | undefined,
  referElement?: HTMLElement | undefined
): {
  top: number
  left: number
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function runOnce(key: string, func: Function): any
