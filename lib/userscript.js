import {
  getRootElement,
  setAttributes,
  addElement as _addElement,
} from './index.js'

export * from './index.js'

// eslint-disable-next-line no-unused-expressions, n/prefer-global/process
process.env.PLASMO_TAG === 'dev' &&
  (() => {
    const functions = document.GMFunctions
    if (typeof functions === 'object') {
      for (const key in functions) {
        if (Object.hasOwn(functions, key)) {
          window[key] = functions[key]
        }
      }
    }
  })()

/* eslint-disable new-cap, camelcase */
export const addElement =
  typeof GM_addElement === 'function'
    ? (parentNode, tagName, attributes) => {
        if (typeof parentNode === 'string') {
          return addElement(null, parentNode, tagName)
        }

        if (!tagName) {
          return
        }

        if (!parentNode) {
          parentNode = /^(script|link|style|meta)$/.test(tagName)
            ? getRootElement(1)
            : getRootElement(2)
        }

        if (typeof tagName === 'string') {
          let attributes2
          if (attributes) {
            const entries1 = []
            const entries2 = []
            for (const entry of Object.entries(attributes)) {
              if (/^(on\w+|innerHTML)$/.test(entry[0])) {
                entries2.push(entry)
              } else {
                entries1.push(entry)
              }
            }

            attributes = Object.fromEntries(entries1)
            attributes2 = Object.fromEntries(entries2)
          }

          const element = GM_addElement(null, tagName, attributes)
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

export const addStyle = (styleText) =>
  addElement(null, 'style', { textContent: styleText })

// Only register menu on top frame
export const registerMenuCommand = (name, callback, options) => {
  if (globalThis !== top) {
    return
  }

  if (typeof GM.registerMenuCommand !== 'function') {
    console.warn('Do not support GM.registerMenuCommand!')
    return
  }

  return GM.registerMenuCommand(name, callback, options)
}
/* eslint-enable new-cap, camelcase */
