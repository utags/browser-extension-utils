export const doc = document

export const win = globalThis

export const uniq = <T>(array: T[]): T[] => [...new Set(array)]

// Polyfill for String.prototype.replaceAll()

if (typeof String.prototype.replaceAll !== 'function') {
  // eslint-disable-next-line no-extend-native
  String.prototype.replaceAll = String.prototype.replace
}

export const toCamelCase = function (text: string): string {
  return text.replaceAll(
    /^([A-Z])|[\s-_](\w)/g,
    (_match: string, p1: string, p2: string) => {
      if (p2) return p2.toUpperCase()
      return p1.toLowerCase()
    }
  )
}

export const $ = (
  selectors: string,
  element?: HTMLElement | Document
): HTMLElement | undefined =>
  (element || doc).querySelector<HTMLElement>(selectors) || undefined
export const $$ = (
  selectors: string,
  element?: HTMLElement | Document
): HTMLElement[] => [
  ...(element || doc).querySelectorAll<HTMLElement>(selectors),
]
export const querySelector = $
export const querySelectorAll = $$

export const getRootElement = (type?: number): HTMLElement =>
  type === 1
    ? doc.head || doc.body || doc.documentElement
    : type === 2
      ? doc.body || doc.documentElement
      : doc.documentElement

export const createElement = (
  tagName: string,
  attributes?: Record<string, unknown>
): HTMLElement =>
  setAttributes(
    doc.createElement(tagName),
    attributes
  ) as unknown as HTMLElement

export const addElement = (
  parentNode: HTMLElement | string | null | undefined,
  tagName: string | HTMLElement,
  attributes?: Record<string, unknown>
): HTMLElement | undefined => {
  if (typeof parentNode === 'string') {
    return addElement(
      null,
      parentNode,
      tagName as unknown as Record<string, unknown>
    )
  }

  if (!tagName) {
    return undefined
  }

  if (!parentNode) {
    parentNode = /^(script|link|style|meta)$/.test(tagName as string)
      ? getRootElement(1)
      : getRootElement(2)
  }

  if (typeof tagName === 'string') {
    const element = createElement(tagName, attributes)
    parentNode.append(element)
    return element
  }

  // tagName: HTMLElement
  setAttributes(tagName, attributes)
  parentNode.append(tagName)
  return tagName
}

export const addStyle = (styleText: string): HTMLElement => {
  const element = createElement('style', { textContent: styleText })
  getRootElement(1).append(element)
  return element
}

export const addEventListener = (
  element: HTMLElement | Document | EventTarget | null | undefined,
  type: string | Record<string, any>,
  listener?: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void => {
  if (!element) {
    return
  }

  if (typeof type === 'object') {
    for (const type1 in type) {
      if (Object.hasOwn(type, type1)) {
        element.addEventListener(
          type1,
          (type as any)[type1] as EventListenerOrEventListenerObject
        )
      }
    }
  } else if (typeof type === 'string' && typeof listener === 'function') {
    element.addEventListener(type, listener, options)
  }
}

export const removeEventListener = (
  element: HTMLElement | Document | EventTarget | null | undefined,
  type: string | Record<string, any>,
  listener?: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void => {
  if (!element) {
    return
  }

  if (typeof type === 'object') {
    for (const type1 in type) {
      if (Object.hasOwn(type, type1)) {
        element.removeEventListener(
          type1,
          (type as any)[type1] as EventListenerOrEventListenerObject
        )
      }
    }
  } else if (typeof type === 'string' && typeof listener === 'function') {
    element.removeEventListener(type, listener, options)
  }
}

export const getAttribute = (
  element: HTMLElement | null | undefined,
  name: string
): string | undefined =>
  element && element.getAttribute
    ? element.getAttribute(name) || undefined
    : undefined

export const setAttribute = (
  element: HTMLElement | null | undefined,
  name: string,
  value: string
): void => {
  if (element && element.setAttribute) {
    element.setAttribute(name, value)
  }
}

export const removeAttribute = (
  element: HTMLElement | null | undefined,
  name: string
): void => {
  if (element && element.removeAttribute) {
    element.removeAttribute(name)
  }
}

export const addClass = (
  element: HTMLElement | null | undefined,
  className: string
): void => {
  if (!element || !element.classList) {
    return
  }

  element.classList.add(className)
}

export const removeClass = (
  element: HTMLElement | null | undefined,
  className: string
): void => {
  if (!element || !element.classList) {
    return
  }

  element.classList.remove(className)
}

export const hasClass = (
  element: HTMLElement | null | undefined,
  className: string
): boolean => {
  if (!element || !element.classList) {
    return false
  }

  return element.classList.contains(className)
}

export type SetStyle = (
  element: HTMLElement | null | undefined,
  style: string | Record<string, unknown>,
  overwrite?: boolean
) => void

export const setStyle = (
  element: HTMLElement | null | undefined,
  values: string | Record<string, any>,
  overwrite?: boolean
): void => {
  if (!element) {
    return
  }

  // element.setAttribute("style", value) -> Fail when violates CSP
  const style = element.style

  if (typeof values === 'string') {
    style.cssText = overwrite ? values : style.cssText + ';' + values
    return
  }

  if (overwrite) {
    style.cssText = ''
  }

  for (const key in values) {
    if (Object.hasOwn(values, key)) {
      ;(style as any)[key] = String(values[key]).replace('!important', '')
    }
  }
}

// convert `font-size: 12px; color: red` to `{"fontSize": "12px"; "color": "red"}`

const toStyleKeyValues = (styleText: string): Record<string, string> => {
  const result: Record<string, string> = {}
  const keyValues = styleText.split(/\s*;\s*/)
  for (const keyValue of keyValues) {
    const kv = keyValue.split(/\s*:\s*/)
    // TODO: fix when key is such as -webkit-xxx
    const key = toCamelCase(kv[0])
    if (key) {
      result[key] = kv[1]
    }
  }

  return result
}

export const toStyleMap = (styleText: string): Record<string, string> => {
  styleText = noStyleSpace(styleText)
  const map: Record<string, string> = {}
  const keyValues = styleText.split('}')
  for (const keyValue of keyValues) {
    const kv = keyValue.split('{')
    if (kv[0] && kv[1]) {
      map[kv[0]] = kv[1]
    }
  }

  return map
}

export const noStyleSpace = (text: string): string =>
  text.replaceAll(/\s*([^\w-+%!])\s*/gm, '$1')

export const createSetStyle = (styleText: string): SetStyle => {
  const styleMap = toStyleMap(styleText)
  return (element, value, overwrite) => {
    if (typeof value === 'object') {
      setStyle(element, value, overwrite)
    } else if (typeof value === 'string') {
      const key = noStyleSpace(value)
      const value2 = styleMap[key]
      setStyle(element, value2 || value, overwrite)
    }
  }
}

export const isUrl = (text: string | undefined): boolean =>
  /^https?:\/\//.test(text || '')

/**
 *
 * @param { function } func
 * @param { number } interval
 * @returns
 */
export const throttle = (
  func: (...args: any[]) => any,
  interval: number
): ((...args: any[]) => any) => {
  let timeoutId: any = null
  let next = false
  const handler = (...args: any[]) => {
    if (timeoutId) {
      next = true
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      func(...args)
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

// Polyfill for Object.hasOwn()
if (typeof Object.hasOwn !== 'function') {
  Object.hasOwn = (instance, prop) =>
    Object.prototype.hasOwnProperty.call(instance, prop)
}

export type MenuCallback = (event?: MouseEvent | KeyboardEvent) => void
export type RegisterMenuCommandOptions = {
  id?: string | number
  title?: string
  autoClose?: boolean
  // O - Tampermonkey
  // X - Violentmonkey
  accessKey?: string
}

export const registerMenuCommand = (
  _name?: string,
  _callback?: MenuCallback,
  _options?: RegisterMenuCommandOptions
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

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const tt = (globalThis as any).trustedTypes
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const escapeHTMLPolicy =
  tt !== undefined && typeof tt.createPolicy === 'function'
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      tt.createPolicy('beuEscapePolicy', {
        createHTML: (string: string) => string,
      })
    : undefined

export const createHTML = (html: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  escapeHTMLPolicy ? (escapeHTMLPolicy.createHTML(html) as string) : html

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

export const setAttributes = (
  element: HTMLElement | null | undefined,
  attributes?: Record<string, unknown>
): HTMLElement | null | undefined => {
  if (element && attributes) {
    for (const name in attributes) {
      if (Object.hasOwn(attributes, name)) {
        const value = attributes[name]
        if (value === undefined) {
          continue
        }

        if (/^(value|textContent|innerText)$/.test(name)) {
          ;(element as any)[name] = value
        } else if (/^(innerHTML)$/.test(name)) {
          element.innerHTML = createHTML(value as string)
        } else if (name === 'style') {
          setStyle(element, value as string | Record<string, any>, true)
        } else if (/on\w+/.test(name)) {
          const type = name.slice(2)
          addEventListener(
            element,
            type,
            value as EventListenerOrEventListenerObject
          )
        } else {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          setAttribute(element, name, String(value))
        }
      }
    }
  }

  return element
}
