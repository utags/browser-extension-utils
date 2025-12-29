export const doc = document

export const win = globalThis

// Polyfill for String.prototype.replaceAll()
if (typeof String.prototype.replaceAll !== 'function') {
  // eslint-disable-next-line no-extend-native
  String.prototype.replaceAll = String.prototype.replace
}

// Polyfill for Object.hasOwn()
if (typeof Object.hasOwn !== 'function') {
  Object.hasOwn = (instance, prop) =>
    Object.prototype.hasOwnProperty.call(instance, prop)
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

export const addAttribute = (
  element: HTMLElement | null | undefined,
  name: string,
  value: string
): void => {
  const orgValue = getAttribute(element, name)
  if (!orgValue) {
    setAttribute(element, name, value)
  } else if (!orgValue.includes(value)) {
    setAttribute(element, name, orgValue + ' ' + value)
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

export const noStyleSpace = (text: string): string =>
  text.replaceAll(/\s*([^\w-+%!])\s*/gm, '$1')

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

export const getRootElement = (type?: number): HTMLElement =>
  type === 1
    ? doc.head || doc.body || doc.documentElement
    : type === 2
      ? doc.body || doc.documentElement
      : doc.documentElement
