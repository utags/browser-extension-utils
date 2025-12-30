import {
  doc,
  win,
  addEventListener,
  removeEventListener,
  getRootElement,
} from './dom-utils'
import { setAttributes } from './set-attributes'
import { createElement } from './create-element'
import { addElement } from './add-element'

export * from './dom-utils'
export * from './set-attributes'
export * from './create-element'
export * from './add-element'
export type RegisterMenuCommandOptions = Parameters<
  typeof GM_registerMenuCommand
>[2]

export const uniq = <T>(array: T[]): T[] => [...new Set(array)]

export const $ = (
  selector: string,
  context: Element | Document = doc
): HTMLElement | null => context.querySelector(selector)!

export const $$ = (
  selector: string,
  context: Element | Document = doc
): HTMLElement[] =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [...context.querySelectorAll(selector)] as HTMLElement[]

export const addStyle = (
  style: string,
  attributes?: Record<string, unknown>
): HTMLStyleElement => {
  const element = createElement('style', {
    textContent: style,
    ...attributes,
  }) as HTMLStyleElement
  getRootElement(1).append(element)
  return element
}

export type MenuCallback = (event?: MouseEvent | KeyboardEvent) => void

export const registerMenuCommand = (
  _name?: string,
  _callback?: MenuCallback,
  _options?: Parameters<typeof GM_registerMenuCommand>[2]
): Promise<string | number | undefined> | undefined => undefined

export const extendHistoryApi = (): void => {
  // https://dirask.com/posts/JavaScript-on-location-changed-event-on-url-changed-event-DKeyZj
  const pushState = history.pushState
  const replaceState = history.replaceState

  history.pushState = function (...args) {
    pushState.apply(history, args)
    globalThis.dispatchEvent(new Event('pushstate'))
    globalThis.dispatchEvent(new Event('locationchange'))
  }

  history.replaceState = function (...args) {
    replaceState.apply(history, args)
    globalThis.dispatchEvent(new Event('replacestate'))
    globalThis.dispatchEvent(new Event('locationchange'))
  }

  globalThis.addEventListener('popstate', () => {
    globalThis.dispatchEvent(new Event('locationchange'))
  })

  // Usage example:
  // window.addEventListener("locationchange", function () {
  //   console.log("onlocationchange event occurred!")
  // })
}

// eslint-disable-next-line no-script-url
export const actionHref = 'javascript:;'

export const getOffsetPosition = (
  element: HTMLElement | undefined,
  referElement?: HTMLElement
): {
  top: number
  left: number
} => {
  const position = { top: 0, left: 0 }
  referElement = referElement || doc.body

  while (element && element !== referElement) {
    position.top += element.offsetTop
    position.left += element.offsetLeft
    element = element.offsetParent as HTMLElement
  }

  return position
}

const runOnceCache: Record<string, any> = {}
export const runOnce = async (
  key: string,
  func: () => Promise<any> | any
): Promise<any> => {
  if (Object.hasOwn(runOnceCache, key)) {
    return runOnceCache[key]
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result = await func()

  if (key) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    runOnceCache[key] = result
  }

  return result
}

const cacheStore: Record<string, any> = {}
const makeKey = (key: string | any[]) =>
  Array.isArray(key) ? key.join(':') : key

export type Cache = {
  get: (key: string | any[]) => any
  add: (key: string | any[], value: any) => void
}

export const cache: Cache = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  get: (key: string | any[]) => cacheStore[makeKey(key)],
  add(key: string | any[], value: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cacheStore[makeKey(key)] = value
  },
}

export const sleep = async (time: number): Promise<any> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, time)
  })

export const parseInt10 = (
  number: string | number | undefined,
  defaultValue?: number
): number => {
  if (typeof number === 'number' && !Number.isNaN(number)) {
    return number
  }

  if (typeof defaultValue !== 'number') {
    defaultValue = Number.NaN
  }

  if (!number) {
    return defaultValue
  }

  const result = Number.parseInt(String(number), 10)
  return Number.isNaN(result) ? defaultValue : result
}

const rootFuncArray: Array<() => void> = []
const headFuncArray: Array<() => void> = []
const bodyFuncArray: Array<() => void> = []
let headBodyObserver: MutationObserver

const startObserveHeadBodyExists = () => {
  if (headBodyObserver) {
    return
  }

  headBodyObserver = new MutationObserver(() => {
    if (doc.head && doc.body) {
      headBodyObserver.disconnect()
    }

    if (doc.documentElement && rootFuncArray.length > 0) {
      for (const func of rootFuncArray) {
        func()
      }

      rootFuncArray.length = 0
    }

    if (doc.head && headFuncArray.length > 0) {
      for (const func of headFuncArray) {
        func()
      }

      headFuncArray.length = 0
    }

    if (doc.body && bodyFuncArray.length > 0) {
      for (const func of bodyFuncArray) {
        func()
      }

      bodyFuncArray.length = 0
    }
  })

  headBodyObserver.observe(doc, {
    childList: true,
    subtree: true,
  })
}

/**
 * Run function when document.documentElement exsits.
 */
export const runWhenRootExists = (func: () => void): void => {
  if (!doc.documentElement) {
    rootFuncArray.push(func)
    startObserveHeadBodyExists()
    return
  }

  func()
}

/**
 * Run function when document.head exsits.
 */
export const runWhenHeadExists = (func: () => void): void => {
  if (!doc.head) {
    headFuncArray.push(func)
    startObserveHeadBodyExists()
    return
  }

  func()
}

/**
 * Run function when document.body exsits. The function executed before DOMContentLoaded.
 */
export const runWhenBodyExists = (func: () => void): void => {
  if (!doc.body) {
    bodyFuncArray.push(func)
    startObserveHeadBodyExists()
    return
  }

  func()
}

/**
 * Equals to jQuery.domready
 */
export const runWhenDomReady = (func: () => void): void => {
  if (doc.readyState === 'interactive' || doc.readyState === 'complete') {
    func()
    return
  }

  const handler = () => {
    if (doc.readyState === 'interactive' || doc.readyState === 'complete') {
      func()
      removeEventListener(doc, 'readystatechange', handler)
    }
  }

  addEventListener(doc, 'readystatechange', handler)
}

export const isVisible = (element: HTMLElement): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const el = element as any

  if (typeof el.checkVisibility === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return el.checkVisibility() as boolean
  }

  return element.offsetParent !== null
}

export const isTouchScreen = (): boolean => 'ontouchstart' in win

export const isUrl = (text: string): boolean => /^https?:\/\//.test(text)

/**
 *
 * @param { function } func
 * @param { number } interval
 * @returns
 */
export const throttle = (
  func: (...args: any[]) => any,
  interval: number
): ((...args: any[]) => void) => {
  let timeoutId: any = null
  let next = false
  const handler = (...args: any[]) => {
    if (timeoutId) {
      next = true
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      func.apply(this, args)
      timeoutId = setTimeout(() => {
        timeoutId = null
        if (next) {
          next = false
          handler()
        }
      }, interval)
    }
  }

  return handler
}

/**
 * Compare two semantic version strings
 * @param {string} v1 - First version string (e.g., "1.2.0")
 * @param {string} v2 - Second version string (e.g., "1.1.5")
 * @returns {number} - Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 * @throws {Error} - Throws error for invalid version strings
 */
export function compareVersions(v1: string, v2: string): number {
  // Input validation
  if (typeof v1 !== 'string' || typeof v2 !== 'string') {
    throw new TypeError('Version strings must be of type string')
  }

  if (!v1.trim() || !v2.trim()) {
    throw new Error('Version strings cannot be empty')
  }

  // Validate version format (basic semantic versioning)
  const versionRegex = /^\d+(\.\d+)*$/
  if (!versionRegex.test(v1) || !versionRegex.test(v2)) {
    throw new Error(
      "Invalid version format. Use semantic versioning (e.g., '1.2.3')"
    )
  }

  const v1Parts = v1.split('.').map(Number)
  const v2Parts = v2.split('.').map(Number)
  const maxLength = Math.max(v1Parts.length, v2Parts.length)

  for (let i = 0; i < maxLength; i++) {
    const num1 = v1Parts[i] || 0 // Use logical OR for cleaner default assignment
    const num2 = v2Parts[i] || 0

    if (num1 !== num2) {
      return num1 > num2 ? 1 : -1 // Simplified comparison
    }
  }

  return 0 // Versions are equal
}
