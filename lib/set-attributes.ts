import {
  setStyle,
  createHTML,
  addEventListener,
  setAttribute,
} from './dom-utils'

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
