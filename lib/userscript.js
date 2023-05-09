import {
  doc,
  setAttributes,
  addElement as _addElement,
  addStyle as _addStyle,
} from "./index.js"

export * from "./index.js"

// eslint-disable-next-line no-unused-expressions, n/prefer-global/process
process.env.PLASMO_TAG === "dev" &&
  (() => {
    const functions = document.GMFunctions
    if (typeof functions === "object") {
      for (const key in functions) {
        if (Object.hasOwn(functions, key)) {
          window[key] = functions[key]
        }
      }
    }
  })()

/* eslint-disable new-cap, camelcase */
export const addElement =
  typeof GM_addElement === "function"
    ? (parentNode, tagName, attributes) => {
        if (!parentNode) {
          return
        }

        if (typeof parentNode === "string") {
          attributes = tagName
          tagName = parentNode
          parentNode = doc.head
        }

        if (typeof tagName === "string") {
          const element = GM_addElement(tagName)
          setAttributes(element, attributes)
          parentNode.append(element)
          return element
        }

        // tagName: HTMLElement
        setAttributes(tagName, attributes)
        parentNode.append(tagName)
        return tagName
      }
    : _addElement

export const addStyle =
  typeof GM_addStyle === "function"
    ? (styleText) => GM_addStyle(styleText)
    : _addStyle

// Only register menu on top frame
export const registerMenuCommand = (name, callback, accessKey) => {
  if (window !== top) {
    return
  }

  if (typeof GM.registerMenuCommand !== "function") {
    console.warn("Do not support GM.registerMenuCommand!")
    return
  }

  GM.registerMenuCommand(name, callback, accessKey)
}
/* eslint-enable new-cap, camelcase */
