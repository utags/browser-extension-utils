import {
  getRootElement,
  setAttributes,
  addElement as _addElement,
} from './index.js'

export * from './index.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const GM_addElement:
    | ((
        parentNode: HTMLElement | null | undefined,
        tagName: string,
        attributes?: any
      ) => HTMLElement)
    | undefined

  const GM: {
    registerMenuCommand: (name: string, callback: any, options?: any) => any
  }
  const process: any

  interface Document {
    GMFunctions?: Record<string, any>
  }
}

export const addElement =
  typeof GM_addElement === 'function'
    ? (
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
          let attributes2: Record<string, unknown> | undefined
          const eventListeners: Array<[string, any]> = []

          if (attributes) {
            // eslint-disable-next-line n/prefer-global/process, @typescript-eslint/no-unused-expressions
            process.env.NODE_ENV

            const entries1: Array<[string, unknown]> = []
            for (const [key, value] of Object.entries(attributes)) {
              if (key.startsWith('on')) {
                const eventName = key.slice(2).toLowerCase()
                eventListeners.push([eventName, value])
              } else {
                entries1.push([key, value])
              }
            }

            attributes = Object.fromEntries(entries1) as Record<string, unknown>
          }

          const element = GM_addElement(null, tagName, attributes)

          for (const [eventName, listener] of eventListeners) {
            element.addEventListener(
              eventName,
              listener as EventListenerOrEventListenerObject
            )
          }

          setAttributes(element, attributes2)
          parentNode.append(element)
          return element
        }

        // tagName: HTMLElement
        setAttributes(tagName, attributes)
        parentNode.append(tagName)
        return tagName
      }
    : _addElement

export const addStyle = (styleText: string): HTMLElement | undefined =>
  addElement(null, 'style', { textContent: styleText })

// Only register menu on top frame
export const registerMenuCommand = (
  name: string,
  callback: (event?: any) => void,
  options?: any
): any => {
  if (globalThis.self !== globalThis.top) {
    return
  }

  if (typeof GM.registerMenuCommand !== 'function') {
    console.warn('Do not support GM.registerMenuCommand!')
    return
  }

  return GM.registerMenuCommand(name, callback, options)
}
