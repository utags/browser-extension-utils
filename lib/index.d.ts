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

export function getAttribute(
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  name: string
): string | undefined

export function setAttribute(
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  name: string,
  value: string
): void

export function removeAttribute(
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  name: string
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

export function addClass(
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  className: string
): void

export function removeClass(
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  className: string
): void

export function hasClass(
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  className: string
): boolean

export type SetStyle = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  style: string | Record<string, unknown>,
  overwrite?: boolean
) => void

export function setStyle(
  // eslint-disable-next-line @typescript-eslint/ban-types
  element: HTMLElement | null | undefined,
  style: string | Record<string, unknown>,
  overwrite?: boolean
): void

export function toStyleMap(styleText: string): Record<string, string>

export function noStyleSpace(text: string): string

export function createSetStyle(styleText: string): SetStyle

export function isUrl(text: string | undefined): boolean

// eslint-disable-next-line @typescript-eslint/ban-types
export function throttle(func: Function, interval: number): Function

export type MenuCallback = (event?: MouseEvent | KeyboardEvent) => void
export type RegisterMenuCommandOptions = {
  id?: string
  title?: string
  autoClose?: boolean
  // O - Tampermonkey
  // X - Violentmonkey
  accessKey?: string
}
export function registerMenuCommand(
  name: string,
  callback: MenuCallback,
  options?: RegisterMenuCommandOptions
): string | undefined

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
export async function runOnce(key: string, func: Function): Promise<any>

// eslint-disable-next-line @typescript-eslint/ban-types
export function runWhenRootExists(func: Function): void

// eslint-disable-next-line @typescript-eslint/ban-types
export function runWhenHeadExists(func: Function): void

// eslint-disable-next-line @typescript-eslint/ban-types
export function runWhenBodyExists(func: Function): void

// eslint-disable-next-line @typescript-eslint/ban-types
export function runWhenDomReady(func: Function): void

export async function sleep(time: number): Promise<void>

export type Cache = {
  get: (key: string | any[]) => any
  add: (key: string | any[], value: any) => void
}

export const cache: Cache

export function isVisible(element: HTMLElement): boolean

export function isTouchScreen(): boolean

export function parseInt10(
  number: string | undefined,
  defaultValue?: number
): number

// eslint-disable-next-line @typescript-eslint/naming-convention
export function createHTML(html: string): string

export function compareVersions(v1: string, v2: string): number
