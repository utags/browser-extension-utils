import {
  getRootElement,
  setAttributes,
  addElement as _addElement,
} from './index.js'

export * from './index.js'

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
          let attributes1: Record<string, string> | undefined
          let attributes2: Record<string, unknown> | undefined
          if (attributes) {
            const entries1: Array<[string, unknown]> = []
            const entries2: Array<[string, unknown]> = []
            for (const entry of Object.entries(attributes)) {
              // Some userscript managers do not support innerHTML
              // Stay do not support multiple classes: GM_addElement('div', {"class": "a b"}). Remove `|class` when it is supported
              if (/^(on\w+|innerHTML|class)$/.test(entry[0])) {
                entries2.push(entry)
              } else {
                entries1.push(entry)
              }
            }

            attributes1 = Object.fromEntries(entries1) as Record<string, string>
            attributes2 = Object.fromEntries(entries2) as Record<
              string,
              unknown
            >
          }

          try {
            const element = GM_addElement(tagName, attributes1)
            setAttributes(element, attributes2)
            parentNode.append(element)
            return element
          } catch (error) {
            console.error('GM_addElement error:', error)
            return _addElement(parentNode, tagName, attributes)
          }
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
  options?: Parameters<typeof GM_registerMenuCommand>[2]
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
